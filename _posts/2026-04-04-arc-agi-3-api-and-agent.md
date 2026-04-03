---
layout: post
title: "ARC-AGI-3 API와 Agent 동작 방식"
date: 2026-04-04
tags: [ARC-AGI, AI, Agent, API]
---

## ARC-AGI-3란?

ARC Prize 팀이 2026년에 발표한 최초의 인터랙티브 추론 벤치마크. 기존 ARC-AGI(정적 퍼즐)와 달리, AI 에이전트가 환경 내에서 직접 탐색하고 경험을 통해 적응해야 한다.

핵심 측정 능력:
- 탐색 (Exploration)
- 인식 → 계획 → 행동 (Percept → Plan → Action)
- 메모리 & 목표 획득
- 장기 계획 (Long-horizon planning)

## 전체 인터랙션 플로우

```
1. GET  /api/games                → 게임 목록 조회
2. POST /api/scorecard/open       → 스코어카드 생성 (card_id 발급)
3. POST /api/cmd/RESET            → 게임 시작 → guid + 초기 프레임 반환
4. 루프:
     에이전트가 64×64 프레임 관찰
     → 액션 결정 (ACTION1~7)
     → POST /api/cmd/{ACTION}
     → 새 프레임 + 상태 반환
   (WIN 또는 GAME_OVER 또는 예산 소진까지 반복)
5. POST /api/scorecard/close      → 최종 스코어 저장
```

## API 엔드포인트

베이스 URL: `https://three.arcprize.org`
인증 헤더: `X-API-Key: <your_key>`

| 메서드 | 엔드포인트 | 설명 |
|---|---|---|
| GET | `/api/games` | 게임 목록 |
| POST | `/api/scorecard/open` | 스코어카드 열기 |
| POST | `/api/scorecard/close` | 스코어카드 닫기 |
| POST | `/api/cmd/{action}` | 액션 실행 |

### 액션 실행 요청

```json
{
  "game_id": "ls20-016295f7601e",
  "guid": "<세션 guid>",
  "x": 32,
  "y": 16,
  "reasoning": {}
}
```

### 응답

```json
{
  "guid": "...",
  "frame": [[...], ...],
  "state": "IN_PROGRESS",
  "levels_completed": 2,
  "win_levels": 5,
  "available_actions": ["ACTION1", "ACTION2", ...]
}
```

## 7가지 액션

| 액션 | 의미 | 타입 |
|---|---|---|
| RESET | 게임 시작/재시작 | simple |
| ACTION1 | 위 이동 | simple |
| ACTION2 | 아래 이동 | simple |
| ACTION3 | 왼쪽 이동 | simple |
| ACTION4 | 오른쪽 이동 | simple |
| ACTION5 | 행동 수행 | simple |
| ACTION6 | (x, y) 클릭 (0~63 좌표) | complex |
| ACTION7 | 실행 취소 | simple |

## 에이전트 구조

추상 기본 클래스에서 2개 메서드 구현 필수:

```python
class Agent(ABC):
    MAX_ACTIONS: int = 80  # 무한루프 방지

    def is_done(self, frames, latest_frame) -> bool:
        """True 반환 시 루프 종료"""

    def choose_action(self, frames, latest_frame) -> GameAction:
        """다음 액션 반환"""
```

### 최소 구현 예시 (랜덤 에이전트)

```python
class Random(Agent):
    def is_done(self, frames, latest_frame):
        return latest_frame.state is GameState.WIN

    def choose_action(self, frames, latest_frame):
        if latest_frame.state in [GameState.NOT_PLAYED, GameState.GAME_OVER]:
            return GameAction.RESET

        action = random.choice([a for a in GameAction if a != GameAction.RESET])

        if action.is_simple():
            action.reasoning = "랜덤 선택"
        elif action.is_complex():  # ACTION6
            action.set_data({"x": random.randint(0, 63), "y": random.randint(0, 63)})
        return action
```

## 2개 주요 레포 비교

**arcprize/ARC-AGI-3-Agents** (에이전트 개발용)
- `arc_agi` 라이브러리로 HTTP 추상화
- `arc_env.step()` 호출 → 내부에서 API 처리
- OpenAI / LangGraph / SmolAgents / 멀티모달 템플릿 포함
- AgentOps 모니터링 지원

**arcprize/arc-agi-3-benchmarking** (벤치마킹용)
- HTTP API 직접 호출 (GameClient)
- OpenAI / Anthropic / Gemini 등 멀티 프로바이더 지원
- 체크포인트 / 비용 추적 / Docker 지원
- MultimodalAgent 기반 (step() 메서드 1개 구현)

## 실행 방법

```bash
# 에이전트 레포
git clone https://github.com/arcprize/ARC-AGI-3-Agents
cp .env.example .env  # ARC_API_KEY 설정
uv run main.py --agent=random --game=ls20

# 벤치마킹 레포
uv run python -m arcagi3.runner --game_id ls20 --config gpt-4o-openai --max_actions 40
```

## 핵심 포인트

- `guid`는 RESET 시 발급되는 세션 토큰으로 모든 액션에 포함 필수
- `reasoning`은 서버 로깅용이라 게임 로직에 영향 없음
- v0.9.3 변경: `score` → `levels_completed`, `win_score` → `win_levels`
- ACTION6 좌표는 0~63 범위 (벤치마킹 레포는 0~127을 내부에서 /2 처리)

## 참고

- [arcprize/ARC-AGI-3-Agents](https://github.com/arcprize/ARC-AGI-3-Agents)
- [arcprize/arc-agi-3-benchmarking](https://github.com/arcprize/arc-agi-3-benchmarking)
- [ARC-AGI-3 공식 사이트](https://arcprize.org/arc-agi/3)
- [공식 문서](https://docs.arcprize.org/)

---
layout: post
title: "Claude Code 에이전트 오케스트레이션 활용법"
date: 2026-03-24
tags: [claude-code, ai, agent, orchestration]
---

Claude Code는 단순한 AI 어시스턴트가 아니라 **에이전트를 조율하는 오케스트레이터**로 활용할 수 있다. 여러 서브에이전트를 병렬로 실행하거나, 역할별로 분리하여 복잡한 작업을 자동화할 수 있다.

## 기본 구조: Orchestrator → Subagent

```
User
  └── Orchestrator (메인 Claude)
        ├── Explore Agent  → 코드베이스 탐색
        ├── Plan Agent     → 설계 및 아키텍처
        └── General Agent  → 구현 / 검증
```

Orchestrator는 작업을 분해하고 조율하며, Subagent는 독립적인 단위 작업을 수행한다. 각 서브에이전트는 **독립적인 컨텍스트 윈도우**를 가지므로, 메인 컨텍스트를 보호하면서 병렬 처리가 가능하다.

## 사용 가능한 Subagent 타입

- **`general-purpose`**: 모든 도구 사용 가능, 복잡한 다단계 작업
- **`Explore`**: 코드 탐색/검색 전용, 파일 수정 불가 (안전)
- **`Plan`**: 설계 및 아키텍처 계획 전용, 파일 수정 불가

## 핵심 활용 패턴

### 1. 병렬 분석

프론트엔드와 백엔드를 동시에 분석해서 API 불일치를 찾는 경우, 두 개의 Explore 에이전트를 동시에 실행하면 된다.

```
Explore Agent A: src/api/** 분석
Explore Agent B: frontend/src/** 분석  ← 동시 실행
         ↓
  Orchestrator: 결과 종합 → 불일치 리포트
```

`run_in_background: true` 옵션으로 병렬 실행하고, 완료 후 결과를 통합한다.

### 2. 대규모 리팩토링 파이프라인

```
Plan Agent      → 변경 범위 파악, 우선순위 결정
    ↓
Explore Agents  → 각 모듈별 패턴 수집 (병렬)
    ↓
General Agents  → 각 모듈 수정 (병렬, worktree 격리)
    ↓
Orchestrator    → 충돌 해결, 통합
```

### 3. worktree 격리

위험하거나 실험적인 작업은 격리된 git worktree에서 실행한다.

```python
Agent(
  subagent_type="general-purpose",
  isolation="worktree",  # 별도 브랜치에서 실행
  prompt="..."
)
```

변경사항이 없으면 자동으로 cleanup되고, 변경이 있으면 브랜치 경로가 반환된다. 대규모 변경을 안전하게 시도할 수 있는 핵심 기능이다.

## CLAUDE.md 잘 쓰는 법

에이전트는 매번 새 컨텍스트로 시작한다. CLAUDE.md는 에이전트의 **온보딩 문서**라고 생각하고 작성해야 한다.

```markdown
## Project Overview
이 프로젝트는 X를 위한 Y 시스템입니다.
주요 컴포넌트: A(역할), B(역할), C(역할)

## Directory Structure
src/
  api/      - REST API 엔드포인트
  services/ - 비즈니스 로직
  models/   - DB 모델

## Commands
- 테스트: `cd backend && pytest tests/ -x --tb=short`
- 린트: `ruff check src/`

## Conventions
- API 응답 형식: {"status": "ok/error", "data": ...}
- 에러 처리: 커스텀 AppException 사용

## Out of Scope
- legacy/ 디렉토리 수정 금지
- 프로덕션 DB 직접 접근 금지
```

**핵심 원칙:**
- 명령어는 실행 가능한 형태로 정확하게 작성
- 금지 사항을 명시적으로 기재 (에이전트는 권한이 있으면 뭐든 시도함)
- 아키텍처 결정의 배경(Why)도 기록 → 에이전트가 더 맞는 판단을 내림

## 에이전트 프롬프트 잘 쓰는 법

서브에이전트에게 주는 프롬프트는 구체적인 아웃풋 형식을 지정해야 한다.

```
# 나쁜 예
"인증 코드 좀 봐줘"

# 좋은 예
"src/auth/ 디렉토리를 탐색하여:
1. JWT 토큰 검증 로직의 위치와 방식
2. 세션 만료 처리 흐름
3. 보안 취약점이 있을 수 있는 패턴
위 세 가지를 구체적인 파일명과 라인 번호와 함께 보고해줘"
```

## 병렬 vs 순차 실행 판단 기준

- **병렬 가능**: 독립적인 파일/모듈 수정, 읽기 전용 탐색
- **순차 필요**: A의 결과가 B의 입력, 공유 파일 수정

## 주의사항: Prompt Injection

외부 데이터(웹 페이지, API 응답)를 처리하는 에이전트는 prompt injection에 취약할 수 있다. 서브에이전트의 결과를 무조건 신뢰하지 말고, 중요한 결정은 Orchestrator가 직접 검증해야 한다.

## 실전 체크리스트

- [ ] CLAUDE.md에 명령어, 디렉토리 구조, 금지 사항 명시
- [ ] 큰 작업은 Plan 에이전트로 설계 먼저
- [ ] 독립적인 작업은 병렬 실행으로 속도 향상
- [ ] 위험한 변경은 `isolation: "worktree"` 사용
- [ ] 서브에이전트 프롬프트에 예상 아웃풋 형식 명시
- [ ] 서브에이전트 결과는 요약 요청 (컨텍스트 절약)

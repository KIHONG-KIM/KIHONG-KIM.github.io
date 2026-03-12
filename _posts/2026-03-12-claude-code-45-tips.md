---
layout: post
title: "Claude Code 45가지 팁 정리"
date: 2026-03-12
tags: [claude-code, productivity, workflow]
---

> 출처: [ykdojo/claude-code-tips](https://github.com/ykdojo/claude-code-tips)

## 기본 설정

**Tip 0: 상태바 커스터마이징**
하단 상태바에 모델명, 디렉토리, git 브랜치, 토큰 사용량 등을 표시할 수 있다. `scripts/context-bar.sh` 스크립트로 설정.

**Tip 1: 필수 슬래시 커맨드**
- `/usage` — 현재 rate limit 확인
- `/chrome` — 브라우저 통합 토글
- `/mcp` — MCP 서버 관리
- `/stats` — GitHub 잔디 스타일 사용 통계
- `/clear` — 대화 초기화

**Tip 7: 터미널 alias 설정**
Claude Code 쓰면서 터미널을 더 많이 쓰게 되니 자주 쓰는 명령어는 alias로 등록해두면 편하다.

**Tip 33: 승인된 커맨드 주기적으로 감사**
`rm -rf ~/` 같은 위험한 명령어가 허용 목록에 들어가 있을 수 있다. 정기적으로 점검 필요.

---

## 컨텍스트 관리

**Tip 5: AI 컨텍스트는 우유 같다 — 신선할수록 좋다**
새 대화일수록 성능이 좋다. 새로운 주제는 새 대화로 시작하자.

**Tip 8: `/compact` 적극 활용**
컨텍스트가 길어지면 `/compact`로 요약해서 공간을 확보할 수 있다. 자동 compact도 있지만 먼저 수동으로 해주는 게 낫다.

**Tip 15: 시스템 프롬프트 줄이기**
기본 시스템 프롬프트 + 툴 정의가 ~19k 토큰을 차지한다. 패치로 ~9k까지 줄일 수 있다.

**Tip 13: 대화 히스토리 검색**
과거 대화는 `~/.claude/projects/`에 로컬 저장된다. Claude에게 검색해달라고 하면 된다.

---

## 생산성

**Tip 2: 음성으로 대화하기**
타이핑보다 음성이 훨씬 빠르다. superwhisper, MacWhisper 등 로컬 음성 인식 도구 추천. Claude Code에 내장 음성 모드도 생겼다.

**Tip 3: 큰 문제는 작게 쪼개기**
A → B 직진 대신 A → A1 → A2 → A3 → B. 전통적인 소프트웨어 공학과 동일한 원칙.

**Tip 9: write-test 사이클 완성하기**
자율 작업을 맡기려면 결과 검증 방법을 줘야 한다. 코드 작성 → 실행 → 결과 확인 사이클이 닫혀 있어야 한다.

**Tip 14: 터미널 탭으로 멀티태스킹**
여러 Claude Code 인스턴스 실행 시 동시에 3~4개 이상은 집중력이 분산된다.

**Tip 16: Git worktree로 병렬 작업**
같은 프로젝트에서 여러 작업을 동시에 할 때 git worktree를 쓰면 충돌 없이 병렬 진행 가능.

**Tip 17: 긴 작업 대기 시 지수 백오프**
Docker 빌드, GitHub CI 대기 중에 exponential backoff 방식으로 체크 간격을 늘리면 효율적.

**Tip 23: 대화 클론/포크**
특정 지점에서 다른 접근을 시도하고 싶을 때 대화를 복제할 수 있다. `scripts/clone-conversation.sh` 참고.

**Tip 24: realpath로 절대 경로 사용**
다른 폴더의 파일을 참조할 때 `realpath <파일>` 로 절대 경로를 얻어서 넘겨주면 확실하다.

**Tip 36: 백그라운드 실행**
긴 bash 명령은 `Ctrl+B`로 백그라운드로 보낼 수 있다. subagent도 백그라운드 실행 가능.

**Tip 38: 입력창 단축키**
readline 스타일 단축키 지원. `Ctrl+A` (줄 처음), `Ctrl+E` (줄 끝), `Ctrl+W` (단어 삭제) 등.

---

## CLAUDE.md / 설정

**Tip 25: CLAUDE.md vs Skills vs Slash Commands vs Plugins 차이**
- **CLAUDE.md** — 프로젝트 컨텍스트, Claude가 항상 읽는 파일
- **Skills** — 재사용 가능한 프롬프트 템플릿 (`~/.claude/skills/`)
- **Slash Commands** — 터미널에서 `/명령어` 형식
- **Plugins** — 외부 배포 가능한 확장

**Tip 30: CLAUDE.md는 간결하게, 주기적으로 리뷰**
반복해서 말하게 되는 내용만 넣는다. 처음엔 없어도 된다.

**Tip 4: attribution 비활성화**
커밋/PR에 Claude 크레딧을 없애려면 `~/.claude/settings.json`에 추가:
```json
{
  "attribution": {
    "commit": "",
    "pr": ""
  }
}
```

---

## 활용 영역

**Tip 18: 글쓰기 어시스턴트**
먼저 컨텍스트와 상세 지시사항을 주고, 음성으로 쭉 피드백을 주면 효율적.

**Tip 26: PR 리뷰**
`gh` 명령으로 PR 정보를 가져오고, 인터랙티브하게 리뷰할 수 있다.

**Tip 27: 리서치 도구**
Google이나 Deep Research 대체로도 강력하다. 특히 특정 코드베이스와 엮인 리서치에 탁월.

**Tip 29: DevOps 엔지니어로 활용**
GitHub Actions CI 실패 시 Claude에게 넘기면 잘 파고든다.

**Tip 21: 위험한 작업은 컨테이너 안에서**
`--dangerously-skip-permissions` 사용 시 컨테이너 환경 권장.

---

## 마인드셋

**Tip 22: 실력을 키우는 가장 좋은 방법은 그냥 쓰는 것**
클라이밍 선수에게 "어떻게 잘해요?"라고 물으면 "그냥 클라이밍 하면 돼요." — 동일.

**Tip 32: 추상화 레벨 선택**
일회성/비중요 프로젝트는 vibe coding으로도 충분. 모든 코드를 다 검토할 필요 없다.

**Tip 35: 모르는 영역에서 더 과감하게**
Claude Code를 쓰면서 "일단 시도해보자"는 태도가 생겼다. 이터레이티브하게 문제를 풀어가면 된다.

**Tip 37: 개인화 소프트웨어의 시대**
나만을 위한 도구를 직접 만드는 비용이 0에 가까워졌다. 상용 앱 대신 직접 만드는 게 더 나을 수 있다.

**Tip 39: 계획도 하되, 프로토타입도 빠르게**
기술 선택 등 큰 결정은 초반에. 하지만 너무 계획만 하지 말고 빠르게 만들어보는 것도 중요.

**Tip 40: 과복잡한 코드는 단순화**
Claude Code는 코드를 더 많이 쓰는 경향이 있다. `/simplify` 같은 커맨드로 정기적으로 단순화 요청.

**Tip 41: 자동화의 자동화**
생산성 향상에서 끝나는 게 아니라 그 과정 자체를 자동화하는 것이 진짜 목표.

---

## 기타

**Tip 6: 터미널 출력 가져오기**
Claude Code 출력을 클린하게 복사하는 방법들 — 파일로 저장, pbcopy 등 활용.

**Tip 11: Gemini CLI를 fallback으로**
Claude의 WebFetch가 막힌 사이트(Reddit 등)는 Gemini CLI를 통해 우회 가능.

**Tip 19: 마크다운 최고**
Google Docs, Notion 대신 마크다운으로 문서 작성하는 게 Claude Code와 함께라면 훨씬 효율적.

**Tip 34: 테스트를 많이 써라 (TDD)**
Claude Code로 코드를 많이 생성할수록 실수도 많아진다. 테스트가 안전망.

**Tip 44: dx 플러그인 설치**
이 레포의 여러 팁을 하나의 플러그인으로 묶은 것. `dx`라는 이름.

**Tip 45: 빠른 설치 스크립트**
여러 추천 설정을 한 번에 설치하는 스크립트 제공.

---

## PS. 더 읽을거리

- [공식 Best Practices](https://code.claude.com/docs/en/best-practices)
- [45가지 팁 모음 (GitHub)](https://github.com/ykdojo/claude-code-tips)
- [32가지 팁 뉴스레터 (Substack)](https://agenticcoding.substack.com/p/32-claude-code-tips-from-basics-to)
- [50가지 팁 - Geeky Gadgets](https://www.geeky-gadgets.com/claude-code-tips-2/)
- [Builder.io 블로그](https://www.builder.io/blog/claude-code)

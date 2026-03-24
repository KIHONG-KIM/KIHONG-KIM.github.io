---
layout: post
title: "Claude Code 에이전트 오케스트레이션 완전 가이드"
date: 2026-03-24
tags: [claude-code, ai, agent, orchestration]
---

Claude Code는 `/agents` 명령어로 서브에이전트를 만들고, 메인 Claude가 오케스트레이터로서 이들을 조율하는 구조를 갖는다. 오늘 공식 문서를 통해 정확한 구조와 활용법을 정리했다.

## 전체 구조

```
메인 Claude (오케스트레이터 — 별도 파일 없음)
    ├── .claude/agents/code-reviewer.md
    ├── .claude/agents/debugger.md
    └── .claude/agents/data-scientist.md
```

- **메인 Claude가 오케스트레이터**다. 별도 파일을 만들 필요 없다.
- **서브에이전트는 다른 서브에이전트를 생성할 수 없다.** 중첩 위임이 필요하면 메인에서 순차 호출해야 한다.

---

## /agents 명령어

```
/agents
```

인터랙티브 UI로 서브에이전트를 생성·수정·삭제할 수 있다. Claude가 자동으로 frontmatter를 생성해주는 기능도 있다.

CLI에서 목록만 보려면:

```bash
claude agents
```

---

## 파일 저장 위치

```
~/.claude/agents/          ← 개인 전체 프로젝트 공통
my-project/
└── .claude/agents/        ← 이 프로젝트 전용 (git 커밋 → 팀 공유)
```

같은 이름이 있으면 프로젝트 > 유저 순으로 우선순위가 높다.

---

## agents 파일 작성법

```markdown
---
name: code-reviewer
description: 코드 수정 직후 자동으로 실행. 보안 취약점, 품질, 가독성 리뷰 전문가.
tools: Read, Grep, Glob, Bash
model: sonnet
---

당신은 시니어 코드 리뷰어입니다.
(이하 시스템 프롬프트)
```

### frontmatter 전체 필드

```yaml
name: my-agent              # 필수. 소문자 + 하이픈

description: "..."          # 필수. Claude가 자동 위임 여부를 판단하는 핵심 기준

tools: Read, Grep, Bash     # 허용 도구 (생략 시 전체 상속)
disallowedTools: Write, Edit  # 이것만 제외하고 나머지 상속

model: haiku / sonnet / opus / inherit

permissionMode: default / acceptEdits / bypassPermissions / plan

isolation: worktree         # git worktree 격리 실행 (변경 없으면 자동 cleanup)

memory: project             # .claude/agent-memory/ (팀 공유)
memory: user                # ~/.claude/agent-memory/ (개인 전체)
memory: local               # .claude/agent-memory-local/ (개인, git 제외)

maxTurns: 20
background: true            # 항상 백그라운드 실행
effort: low / medium / high / max

skills:
  - api-conventions         # 시작 시 스킬 내용 주입 (상속 X, 명시 필요)

mcpServers:
  - playwright:             # 이 에이전트 전용 MCP 서버
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
```

---

## description이 가장 중요하다

Claude는 `description`만 보고 위임 여부를 결정한다. 시스템 프롬프트보다 중요하다.

```yaml
# 나쁨
description: "코드 리뷰 에이전트"

# 좋음
description: |
  코드 변경 직후 자동 실행. Use proactively after any code change.
  보안 취약점, 코드 품질, 유지보수성을 검토.
  git diff 기반으로 수정된 파일에 집중.
```

`Use proactively` 문구가 자동 위임을 강화한다.

---

## 실전 예시

### 코드 리뷰어 (읽기 전용)

```markdown
---
name: code-reviewer
description: 코드 수정 직후 자동으로 실행. 품질·보안·가독성 리뷰. Use proactively after code changes.
tools: Read, Grep, Glob, Bash
model: sonnet
---

시니어 코드 리뷰어로서 다음을 검토합니다.

실행 순서:
1. git diff로 변경사항 파악
2. 수정된 파일에 집중

우선순위별 리뷰:
- Critical: 보안 취약점, 노출된 시크릿, 입력 검증 누락
- Warning: 중복 코드, 에러 처리 부재
- Suggestion: 가독성, 성능 개선

각 항목에 현재 코드와 개선 코드 예시를 포함합니다.
```

### 격리된 리팩토링 에이전트

```markdown
---
name: refactor-agent
description: 대규모 리팩토링 작업. 실험적 변경을 안전하게 시도.
tools: Read, Edit, Write, Bash, Grep, Glob
model: sonnet
isolation: worktree
permissionMode: acceptEdits
---

안전한 리팩토링 전문가입니다.
격리된 git worktree에서 작업하므로 메인 브랜치에 영향이 없습니다.
```

### DB 읽기 전용 에이전트 (훅 활용)

```markdown
---
name: db-reader
description: 데이터 분석 및 리포트 생성. SELECT 쿼리만 허용.
tools: Bash
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly.sh"
---

읽기 전용 DB 분석가입니다.
SELECT 쿼리로만 데이터를 조회하며, 쓰기 요청은 거절합니다.
```

---

## 오케스트레이션 패턴

### 자동 위임
description을 잘 쓰면 Claude가 알아서 위임한다.

### 명시적 호출
```
@"code-reviewer (agent)" 인증 모듈 리뷰해줘
```

### 병렬 실행
```
backend와 frontend를 별도 에이전트로 동시에 분석해서 API 불일치를 찾아줘
```

### 순차 체인
```
code-reviewer로 성능 문제를 찾고, 결과를 optimizer 에이전트로 수정해줘
```

### 백그라운드 실행
```
테스트 전체를 백그라운드에서 실행하고 실패한 케이스만 요약해줘
```
실행 중 Ctrl+B로도 백그라운드 전환 가능.

---

## 서브에이전트 vs Skills vs Agent Teams

| 구분 | 서브에이전트 | Skills | Agent Teams |
|---|---|---|---|
| 컨텍스트 | 독립 | 메인 공유 | 완전 독립 |
| 병렬 실행 | 메인에서만 | X | O |
| 용도 | 반복 역할 정의 | 재사용 워크플로 | 대규모 병렬 작업 |

---

## 실전 체크리스트

- [ ] `description`에 "언제 사용하는지" 구체적으로 작성 + `Use proactively` 추가
- [ ] `tools`는 필요한 것만 (최소 권한 원칙)
- [ ] 위험한 작업은 `isolation: worktree`
- [ ] 팀 공유 에이전트는 `.claude/agents/` → git 커밋
- [ ] 반복 학습이 필요한 에이전트는 `memory: project`
- [ ] `/agents` 명령어로 관리 (생성·수정·삭제)
- [ ] 서브에이전트는 CLAUDE.md를 읽지만, 스킬은 `skills:` 로 명시 주입 필요

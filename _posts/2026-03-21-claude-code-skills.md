---
layout: post
title: "Claude Code 스킬(Skills) 시스템 정리"
date: 2026-03-21
tags: [claude-code, skills, workflow, productivity]
---

## 스킬이란?

CLAUDE.md가 "항상 적용되는 규칙"이라면, 스킬은 **원할 때 호출하는 자동화 명령어**다.

- `/til`, `/commit`, `/deploy` 처럼 슬래시로 직접 호출하거나
- Claude가 대화 맥락을 보고 자동으로 호출하기도 한다

---

## 파일 위치

| 범위 | 경로 |
|------|------|
| 글로벌 (모든 프로젝트) | `~/.claude/skills/<이름>/SKILL.md` |
| 프로젝트 전용 | `.claude/skills/<이름>/SKILL.md` |

---

## SKILL.md 프론트매터

```yaml
---
name: skill-name
description: 설명 (Claude가 자동 호출 여부 판단에 사용)
argument-hint: "[인자]"
disable-model-invocation: true  # true = 수동 호출만 가능
user-invocable: false           # false = / 메뉴에서 숨김
allowed-tools: Read, Bash(git *)
context: fork                   # 독립 서브에이전트로 실행
---
```

---

## 호출 방법

**수동**: 직접 슬래시 명령어 입력
```
/til
/fix-issue 123
```

**자동**: `description`을 보고 Claude가 판단해서 호출
→ `disable-model-invocation: true`로 막을 수 있음

---

## CLAUDE.md vs 스킬

| | CLAUDE.md | 스킬 |
|--|-----------|------|
| 로드 시점 | 항상 | 호출될 때만 |
| 용도 | 규칙·배경지식 | 반복 작업 자동화 |
| 인자 전달 | 불가 | 가능 (`$ARGUMENTS`) |

---

## 유용한 스킬 아이디어

| 스킬 | 설명 |
|------|------|
| `/commit` | 컨벤션에 맞는 커밋 메시지 자동 작성 |
| `/pr` | PR 제목/본문 자동 생성 |
| `/til` | TIL 작성 → 커밋 → 푸시 |
| `/deploy` | 빌드 → 테스트 → 배포 순서 실행 |
| `/review` | 현재 변경사항 코드 리뷰 |
| `/test` | 현재 파일에 맞는 테스트 자동 작성 |

---

## 핵심 원칙

- **CLAUDE.md** → 코딩 스타일, 프로젝트 구조 같은 "규칙"
- **스킬** → 커밋, 배포, TIL 푸시 같은 "반복 작업"
- "한 달 뒤에도 똑같이 반복할 것 같다" → 스킬로 만들 가치 있음

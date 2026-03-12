---
layout: post
title: "GitHub CLI (gh) 명령어 정리"
date: 2026-03-12
tags: [github, cli, git, cheatsheet]
---

> `gh` — GitHub의 공식 CLI. 브라우저 없이 PR, Issue, Actions 등을 터미널에서 처리.

## 설치 & 인증

```bash
# 설치 (mac)
brew install gh

# 로그인
gh auth login

# 현재 로그인 상태 확인
gh auth status
```

---

## Pull Request

```bash
# PR 생성
gh pr create --title "제목" --body "내용"

# 드래프트 PR 생성
gh pr create --draft --title "WIP: 제목"

# 현재 브랜치 PR 보기
gh pr view

# PR 목록
gh pr list

# PR 머지
gh pr merge 123

# PR 체크아웃
gh pr checkout 123

# PR 리뷰 요청
gh pr review 123 --approve
gh pr review 123 --request-changes --body "수정 필요"
gh pr review 123 --comment --body "코멘트"

# PR 댓글 보기
gh api repos/OWNER/REPO/pulls/123/comments

# PR 설명 수정 이력 (GraphQL)
gh api graphql -f query='
query {
  repository(owner: "OWNER", name: "REPO") {
    pullRequest(number: 123) {
      userContentEdits(first: 100) {
        nodes { editedAt editor { login } }
      }
    }
  }
}'
```

---

## Issue

```bash
# Issue 생성
gh issue create --title "버그: ..." --body "내용"

# Issue 목록
gh issue list

# Issue 보기
gh issue view 42

# Issue 닫기
gh issue close 42

# Issue 코멘트
gh issue comment 42 --body "코멘트 내용"

# Label 지정
gh issue create --label "bug,enhancement"

# Assignee 지정
gh issue create --assignee "@me"
```

---

## Repository

```bash
# 레포 생성
gh repo create my-repo --public
gh repo create my-repo --private --description "설명"

# 레포 클론
gh repo clone OWNER/REPO

# 레포 포크
gh repo fork OWNER/REPO

# 레포 정보
gh repo view

# 브라우저에서 열기
gh repo view --web

# 레포 목록
gh repo list
```

---

## Actions (CI/CD)

```bash
# 워크플로우 목록
gh workflow list

# 워크플로우 실행
gh workflow run deploy.yml

# 최근 실행 목록
gh run list

# 실행 상태 보기
gh run view 123456

# 실행 로그 보기
gh run view 123456 --log

# 실패한 step 로그만
gh run view 123456 --log-failed

# 실행 watch (완료까지 대기)
gh run watch 123456
```

---

## Release

```bash
# 릴리즈 생성
gh release create v1.0.0 --title "v1.0.0" --notes "변경 내용"

# 파일 첨부
gh release create v1.0.0 ./dist/app.tar.gz

# 릴리즈 목록
gh release list

# 릴리즈 다운로드
gh release download v1.0.0
```

---

## Gist

```bash
# Gist 생성
gh gist create file.txt --public

# Gist 목록
gh gist list

# Gist 편집
gh gist edit GIST_ID
```

---

## 기타 유용한 것들

```bash
# 브라우저에서 현재 레포 열기
gh browse

# 특정 파일/PR/Issue 브라우저로 열기
gh browse src/main.py
gh browse --pr 123

# SSH key 추가
gh ssh-key add ~/.ssh/id_rsa.pub --title "my key"

# 환경변수(secrets) 설정
gh secret set MY_SECRET

# GitHub Pages 활성화
gh api repos/OWNER/REPO/pages \
  --method POST \
  -f source[branch]=main \
  -f source[path]=/

# 임의의 REST API 호출
gh api repos/OWNER/REPO/issues --jq '.[].title'

# JSON 출력 + jq 파이프
gh pr list --json number,title,state | jq '.[] | select(.state=="OPEN")'
```

---

## Claude Code와 함께 쓰는 패턴

```bash
# Claude에게 위임하기 좋은 것들
# - 커밋 메시지 작성 후 push
# - PR 생성 (드래프트로 안전하게)
# - CI 실패 로그 가져와서 디버깅
# - Issue 정리 및 코멘트

# 예: CI 실패 디버깅
gh run view --log-failed | pbcopy
# → Claude에게 붙여넣기 후 분석 요청
```

> **Tip**: `gh api` + GraphQL로 GitHub 대부분의 데이터에 접근 가능.
> 공식 docs: `gh help` 또는 `gh <command> --help`

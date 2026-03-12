---
layout: post
title: "Git & GitHub CLI (gh) 명령어 정리"
date: 2026-03-12
tags: [github, cli, git, cheatsheet]
---

> `git` — 버전 관리 / `gh` — GitHub 공식 CLI. 브라우저 없이 PR, Issue, Actions 등을 터미널에서 처리.

---

## Git 기본

```bash
# 초기화 & 설정
git init
git config --global user.name "이름"
git config --global user.email "이메일"

# 상태 확인
git status
git log --oneline --graph --all   # 브랜치 그래프 포함
git diff                          # unstaged 변경사항
git diff --staged                 # staged 변경사항
```

---

## Git 스테이징 & 커밋

```bash
git add 파일명
git add .                         # 전체 추가
git add -p                        # 변경사항 조각별로 선택

git commit -m "메시지"
git commit --amend                # 마지막 커밋 수정 (push 전에만)

# 스테이징 취소
git restore --staged 파일명
# 변경사항 되돌리기
git restore 파일명
```

---

## Git 브랜치

```bash
git branch                        # 브랜치 목록
git branch 브랜치명               # 브랜치 생성
git switch 브랜치명               # 브랜치 이동
git switch -c 브랜치명            # 생성 + 이동

git branch -d 브랜치명            # 브랜치 삭제 (merged)
git branch -D 브랜치명            # 강제 삭제

git merge 브랜치명                # 현재 브랜치에 머지
git rebase main                   # main 위로 rebase
```

---

## Git 원격 저장소

```bash
git remote add origin URL
git remote -v                     # 원격 목록

git fetch                         # 원격 변경사항 가져오기 (머지 안 함)
git pull                          # fetch + merge
git pull --rebase                 # fetch + rebase

git push origin 브랜치명
git push -u origin 브랜치명      # upstream 설정
git push --force-with-lease       # 안전한 force push
```

---

## Git 되돌리기

```bash
# 커밋 되돌리기 (히스토리 보존)
git revert HEAD
git revert 커밋해시

# 커밋 취소 (로컬에서만)
git reset --soft HEAD~1           # 커밋만 취소, 변경사항 staged 유지
git reset --mixed HEAD~1          # 커밋 + unstaged로 내림 (기본값)
git reset --hard HEAD~1           # 커밋 + 변경사항 모두 삭제 ⚠️

# 특정 파일만 이전 커밋 상태로
git checkout 커밋해시 -- 파일명
```

---

## Git Stash

```bash
git stash                         # 현재 변경사항 임시 저장
git stash push -m "설명"
git stash list
git stash pop                     # 꺼내기 + 목록에서 제거
git stash apply stash@{0}         # 꺼내기 (목록 유지)
git stash drop stash@{0}          # 삭제
```

---

## Git Worktree

```bash
# 같은 레포를 다른 폴더에서 다른 브랜치로 작업
git worktree add ../feature-branch feature/some-feature
git worktree list
git worktree remove ../feature-branch
```

---

## Git 유용한 명령어

```bash
# 특정 문자열이 추가/삭제된 커밋 찾기
git log -S "검색어"

# 특정 파일의 변경 이력
git log --follow -p 파일명

# 누가 이 줄을 작성했나
git blame 파일명

# 두 커밋 사이 diff
git diff 커밋A..커밋B

# 커밋 간 파일 목록만
git diff --name-only 커밋A..커밋B

# 버그 유발 커밋 이진 탐색
git bisect start
git bisect bad                    # 현재 커밋 = 버그 있음
git bisect good 커밋해시          # 정상이었던 커밋
# → 자동으로 중간 커밋 체크아웃, 반복
git bisect reset                  # 종료

# .gitignore에 이미 추적된 파일 제거
git rm --cached 파일명
```

---

## gh 설치 & 인증

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

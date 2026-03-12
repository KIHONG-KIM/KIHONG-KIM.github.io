---
layout: post
title: "GitHub Pages로 TIL 블로그 세팅"
date: 2026-03-12
tags: [blog, github-pages, jekyll]
---

## 오늘 배운 것

GitHub Pages + Jekyll 조합으로 개인 TIL 블로그를 세팅했다.

## 핵심 포인트

- `username.github.io` 이름의 레포를 만들면 `https://username.github.io`로 자동 서빙된다
- `_posts/YYYY-MM-DD-title.md` 형식으로 파일을 만들면 Jekyll이 자동으로 포스트로 인식
- `_config.yml`에서 사이트 메타데이터 설정
- GitHub Pages는 Jekyll을 빌드 과정 없이 지원함 (push만 하면 자동 배포)

## 구조

```
.
├── _config.yml       # 사이트 설정
├── _layouts/         # HTML 템플릿
├── _posts/           # TIL 포스트 (마크다운)
├── assets/css/       # 스타일
└── index.html        # 메인 목록 페이지
```

---
layout: post
title: "워크스페이스 정리 & 세션 리뷰"
date: 2026-03-12
tags: [workflow, claude, til-blog]
---

## 오늘 한 것

- aimo3 Kaggle 코드 리팩토링 (`config.py`, `solver.py`, `sandbox.py`, `tool.py`)
- Kaggle 노트북 분석 및 리팩토링 프로젝트 (`kaggle-notebook/`)
- `duplicate_slides.py` 작성
- GitHub Pages + Jekyll 기반 TIL 블로그 세팅 (지금 이 블로그)

## 워크스페이스 구조

세션마다 랜덤 ID 폴더가 생기는 구조라 빈 폴더가 쌓인다.
주기적으로 정리 필요.

```
workspace/
├── cgejacev/   # aimo3 리팩토링
├── mwm7s7uc/   # duplicate_slides.py, kaggle 스크린샷
├── tzlmxj2y/   # kaggle-notebook 리팩토링
└── til-blog/   # 이 블로그
```

## Claude 사용량 (2026-03-12 기준)

- 오늘: $4.22 / 4.6M 토큰
- 어제: $1.76 / 2.0M 토큰
- 세션 수: 10개

`npx ccusage daily` 로 확인 가능.

## 배운 것

- `username.github.io` 레포를 만들면 별도 설정 없이 GitHub Pages가 자동 활성화된다
- Jekyll `_posts/YYYY-MM-DD-title.md` 규칙만 지키면 빌드 없이 push만으로 배포된다
- `group_by_exp` 필터로 연도별 그룹핑 가능

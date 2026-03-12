---
layout: post
title: "Kaggle CLI 주요 명령어 정리"
date: 2026-03-12
tags: [kaggle, cli, data-science, cheatsheet]
---

Kaggle CLI를 사용하면 터미널에서 데이터셋 다운로드, 경진대회 참가, 노트북 제출까지 모든 작업을 처리할 수 있다.

## 설치 & 인증

```bash
pip install kaggle

# API 토큰 설정 (kaggle.com → Account → API → Create New Token)
mkdir -p ~/.kaggle
mv kaggle.json ~/.kaggle/
chmod 600 ~/.kaggle/kaggle.json
```

## 경진대회 (Competitions)

```bash
# 경진대회 목록 검색
kaggle competitions list
kaggle competitions list -s "titanic"        # 키워드 검색

# 경진대회 파일 목록 확인
kaggle competitions files titanic

# 데이터 다운로드
kaggle competitions download -c titanic
kaggle competitions download -c titanic -p ./data   # 저장 경로 지정
kaggle competitions download -c titanic -f train.csv # 특정 파일만

# 제출
kaggle competitions submit -c titanic -f submission.csv -m "first submission"

# 리더보드 확인
kaggle competitions leaderboard -c titanic --show
```

## 데이터셋 (Datasets)

```bash
# 데이터셋 검색
kaggle datasets list -s "house prices"

# 데이터셋 다운로드
kaggle datasets download username/dataset-name
kaggle datasets download username/dataset-name -p ./data --unzip

# 내 데이터셋 목록
kaggle datasets list --mine

# 데이터셋 생성 & 업로드
kaggle datasets init -p ./my-dataset          # dataset-metadata.json 생성
kaggle datasets create -p ./my-dataset        # 최초 업로드
kaggle datasets version -p ./my-dataset -m "v2 update"  # 버전 업데이트
```

## 노트북 (Kernels)

```bash
# 노트북 목록
kaggle kernels list
kaggle kernels list --mine

# 노트북 다운로드
kaggle kernels pull username/kernel-name
kaggle kernels pull username/kernel-name -p ./notebooks --metadata

# 노트북 제출 (실행)
kaggle kernels push -p ./my-kernel            # kernel-metadata.json 필요

# 실행 상태 확인
kaggle kernels status username/kernel-name

# 출력 결과 다운로드
kaggle kernels output username/kernel-name -p ./output
```

## 모델 (Models)

```bash
# 모델 목록 검색
kaggle models list -s "llama"

# 모델 인스턴스 다운로드
kaggle models instances get username/model-name/framework/variant
```

## 유용한 옵션

```bash
# 압축 해제까지 한번에
kaggle competitions download -c titanic --unzip

# 조용한 출력 (스크립트용)
kaggle competitions download -c titanic -q

# CSV 형식으로 출력
kaggle competitions list --csv

# 페이지 수 조절
kaggle datasets list -s "nlp" --page-size 20 --page 2
```

## kernel-metadata.json 예시

```json
{
  "id": "username/my-kernel",
  "title": "My Kernel",
  "code_file": "notebook.ipynb",
  "language": "python",
  "kernel_type": "notebook",
  "is_private": true,
  "enable_gpu": false,
  "enable_internet": true,
  "dataset_sources": ["username/dataset-name"],
  "competition_sources": ["titanic"],
  "kernel_sources": []
}
```

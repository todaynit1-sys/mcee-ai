# 기후 AI프렌즈 소개 사이트 — GitHub 배포본

20팀 목록, 팀별 소개 20페이지, 대표 이미지 20장, 에코프렌즈 소개 영상이 포함된 정적 웹사이트입니다.
원본 성과요약서·발표자료, 내부 작업 기록, 페이지 생성 도구는 포함하지 않았습니다.

## GitHub Pages 배포

1. GitHub에 새 저장소를 만듭니다. 기본 브랜치는 `main`으로 사용합니다.
2. **이 폴더 안의 내용 전체**를 저장소 최상위에 올립니다. `.github/workflows/pages.yml`도 반드시 포함합니다. ZIP 자체를 올리는 방식은 아닙니다.
3. 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 선택합니다.
4. **Actions → Deploy AI Friends to GitHub Pages → Run workflow**를 실행합니다.
5. 성공한 실행의 `github-pages` 배포 주소로 접속합니다. 이후 `main`에 변경사항을 올리면 자동 배포됩니다.

보통 주소는 `https://계정명.github.io/저장소명/` 형태입니다. 개인 도메인도 Pages 설정에서 연결할 수 있습니다.
공개 저장소는 코드와 포함된 이미지·영상도 공개됩니다. 비공개 저장소의 Pages 이용 가능 여부는 계정 요금제에 따라 다릅니다.

## 파일 구성

- `site/index.html`: 20팀 목록
- `site/teams/`: 팀별 소개
- `site/assets/`: CSS, JavaScript, 썸네일, 영상
- `.github/workflows/pages.yml`: 자동 배포 설정
- `prepare.py`: 링크 검사, 배포 주소 기반 공유 메타데이터·사이트맵 설정

## 로컬 확인

```sh
python prepare.py
python -m http.server 4173 --directory site
```

`http://localhost:4173`에서 확인합니다. 서버나 데이터베이스는 필요하지 않습니다.
배포본 수정은 HTML/CSS/JS에서 직접 하거나 원래 작업 폴더에서 다시 생성한 최신 파일로 교체하세요.
실제 GitHub 업로드·온라인 배포는 아직 수행되지 않았습니다.

공식 안내: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

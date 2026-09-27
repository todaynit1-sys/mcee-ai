# Vercel 배포 수정본
모든 파일을 같은 위치에 두는 배포본입니다. index.html이 메인입니다.

1. 압축을 실제 폴더에 풉니다.
2. GitHub 저장소의 Add file → Upload files에서 이 폴더 안의 파일 전체를 업로드합니다. 같은 이름의 파일은 새 버전으로 교체합니다.
3. Commit changes를 누르면 연결된 Vercel에서 재배포됩니다.
4. Vercel 프로젝트의 Root Directory는 저장소 루트(비워 둠), Framework Preset은 Other, Build Command는 비워 둡니다. Output Directory는 기본값 또는 . 입니다.

원본 PDF와 내부 작업 자료는 포함하지 않았습니다. 기존에 올린 pages.yml은 Vercel에서 사용하지 않습니다.

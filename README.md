# WhatsInMyBack?
node.js 기반 웹 제작 프로젝트


## 🖥️ 프로젝트 소개
자신의 취향이 담긴 아이템 목록을 다른 사람들에게 공유할 수 있는 커뮤니티 플랫폼
<br>

## 🕰️ 개발 기간
* 24.03.22일 - 22.06.23일 (3개월)

### 🧑‍🤝‍🧑 맴버구성
 - 로그인 기능
   - 김아진 : 로그인/회원가입, HRD 설계
   - 이다인 : 로그인/회원가입, 로그아웃, 게시판 댓글 일부
 - 게시글 기능
   - 이지연 : 게시글 등록/수정/삭제, 댓글/대댓글, 브랜치 관리, 헤더디자인
   - 김근혜 : 게시글 등록/수정/삭제, 검색, 좋아요/북마크, 이미지 등
 - 프로필 기능
   - 정지윤 : 마이 페이지, 북마크 및 좋아요 모아보기, 팔로워 팔로잉
   - 최정빈 : 댓글 페이지, 회원 탈퇴, 회원 정보 수정

### ⚙️ 개발 환경
- `Node.js(20.14.0)`
- **IDE** : Visual Studio Code
- **Framework** : Express.js
- **Database** : MySQL
- **Cloud Platform**: Google Cloud Platform (GCP)


## ⭐ ERD
<img src="https://github.com/JiyunJeong01/WhatsInMyBack/assets/89970899/f54b544e-bb2e-4ace-8e0e-bb0bcaec9479" width="80%" />

## 📌 주요 기능
#### 로그인 
- DB값 검증
- 로그인 시 쿠키(Cookie) 및 세션(Session) 생성
#### 회원가입 
- ID 중복 체크
- 입력 형식 검증
### 홈 페이지
- 네비게이션
- 최신 글 노출
### 게시글 작성
- 로그인 상태 검증
- 테마 선택
- 제목 및 내용 입력
- 해시태그 입력
- 이미지 업로드
- 제품목록(제품명, 제품 카테고리, 제품 브랜드, 구매 링크) 작성
### 게시글 조회
- 좋아요 및 북마크
- 제품정보 링크 연결
- 댓글 및 대댓글 작성
- 상대 프로필 이동
#### 마이 페이지 
- 회원정보 변경
- DB 검증
- 회원 탈퇴
- 팔로워 팔로잉
- 게시글 페이지 로딩
### 검색
- 제목/내용/해시태그 검색
- 최신순/조회순/댓글순/좋아요순/북마크순 정렬


## 💻 구현 화면
홈 페이지|게시글 페이지
--- | --- | 
![localhost_](https://github.com/JiyunJeong01/WhatsInMyBack/assets/89970899/a838421e-495a-4187-8c3d-dcb053f11257)|![localhost_post_121_detail](https://github.com/JiyunJeong01/WhatsInMyBack/assets/89970899/102803c6-ab66-4f4f-b33b-91fa7bb16cc1)

마이 페이지|로그인 페이지
--- | --- | 
![localhost_profile_124](https://github.com/JiyunJeong01/WhatsInMyBack/assets/89970899/f01a4ad5-ef0a-43bf-bc67-bd1b259513dc)|![localhost_auth_login](https://github.com/JiyunJeong01/WhatsInMyBack/assets/89970899/7f8225d9-f16b-4427-9080-8bb9d5e673de)
## ▶️ 데모 영상
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/cLGqxM8C4R8/0.jpg)](https://www.youtube.com/watch?v=cLGqxM8C4R8)

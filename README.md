<<<<<<< HEAD
# 반복 민원 상담 AI 자동응답 서비스

## 1. 프로젝트 받아오기

GitHub 저장소를 처음 받는 경우 아래 명령어를 실행합니다.

```powershell
cd C:\Users\gudrb
git clone 저장소_URL civil-ai-project
cd civil-ai-project
```

예시:

```powershell
cd C:\Users\gudrb
git clone https://github.com/깃허브아이디/저장소이름.git civil-ai-project
cd civil-ai-project
```

이미 저장소를 받아온 상태라면 최신 코드를 가져옵니다.

```powershell
git pull
```

---

## 2. 프로젝트 개요

금오공과대학교 학사 공지 및 반복 민원 데이터를 기반으로, 사용자의 질문에 대해 RAG 기반 AI가 답변 초안을 생성하고 교직원이 검토 및 승인한 뒤 최종 답변을 제공하는 반자동 상담 지원 시스템입니다.

현재는 Spring Boot와 FastAPI 연동 구조를 중심으로 구현되어 있으며, 이후 ChromaDB와 임베딩 모델을 연결하여 RAG 기반 답변 생성 시스템으로 확장할 예정입니다.

---

## 3. 프로젝트 구조

```text
civil-ai-project
├─ backend       # Spring Boot 서버
├─ ai-server     # FastAPI AI 서버
├─ .gitignore
└─ README.md
```

---

## 4. 기술 스택

### Backend

- Java 17
- Spring Boot
- Spring Data JPA
- MySQL
- Gradle
- Springdoc OpenAPI / Swagger UI

### AI Server

- Python
- FastAPI
- Uvicorn
- 추후 ChromaDB, 임베딩 모델, LLM 연동 예정

---

## 5. 현재 구현된 기능

### Spring Boot

- 사용자 문의 등록
- 문의 목록 조회
- 문의 상세 조회
- 문의 상태 변경
- FastAPI AI 서버 호출
- AI 답변 초안 저장
- 최종 답변 승인 및 저장
- Swagger UI를 통한 API 테스트 지원

### FastAPI

- AI 서버 상태 확인
- 질문 기반 임시 답변 초안 생성
- Spring Boot 연동용 API 제공
- FastAPI `/docs`를 통한 API 테스트 지원

---

## 6. 실행 방법

### 6.1 MySQL DB 생성

MySQL Workbench 또는 터미널에서 아래 SQL을 실행합니다.

```sql
CREATE DATABASE civil_ai
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

---

### 6.2 FastAPI 실행

```powershell
cd ai-server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

FastAPI 서버 주소:

```text
http://localhost:8000
```

FastAPI 문서 확인:

```text
http://localhost:8000/docs
```

---

### 6.3 Spring Boot 실행

```powershell
cd backend
.\gradlew bootRun
```

또는 IntelliJ에서 `CivilAiApplication`을 실행합니다.

Spring Boot 서버 주소:

```text
http://localhost:8080
```

---

## 7. API 문서 확인 방법

### 7.1 FastAPI API 문서

FastAPI 서버 실행 후 아래 주소로 접속합니다.

```text
http://localhost:8000/docs
```

해당 화면에서 AI 서버의 API를 직접 테스트할 수 있습니다.

---

### 7.2 Spring Boot API 문서

Spring Boot 서버 실행 후 아래 주소로 접속합니다.

```text
http://localhost:8080/swagger-ui.html
```

또는 아래 주소로 접속할 수 있습니다.

```text
http://localhost:8080/swagger-ui/index.html
```

Springdoc 설정에서 Swagger UI 경로를 `/docs`로 변경한 경우 아래 주소를 사용합니다.

```text
http://localhost:8080/docs
```

OpenAPI JSON 원본은 아래 주소에서 확인할 수 있습니다.

```text
http://localhost:8080/v3/api-docs
```

---

## 8. 주요 API

### 8.1 문의 등록

```http
POST http://localhost:8080/api/inquiries
Content-Type: application/json
```

```json
{
  "studentName": "김형규",
  "studentNumber": "20200369",
  "content": "등록금 추가 납부 기간이 언제인가요?"
}
```

---

### 8.2 문의 목록 조회

```http
GET http://localhost:8080/api/inquiries
```

---

### 8.3 문의 상세 조회

```http
GET http://localhost:8080/api/inquiries/{inquiryId}
```

---

### 8.4 AI 답변 초안 생성

```http
POST http://localhost:8080/api/inquiries/{inquiryId}/ai-recommendation
```

---

### 8.5 AI 답변 초안 조회

```http
GET http://localhost:8080/api/inquiries/{inquiryId}/ai-recommendation
```

---

### 8.6 최종 답변 승인

```http
POST http://localhost:8080/api/inquiries/{inquiryId}/answers/approve
Content-Type: application/json
```

```json
{
  "finalAnswer": "관리자가 검토 후 작성한 최종 답변입니다.",
  "reviewerName": "교직원A"
}
```

---

### 8.7 최종 답변 조회

```http
GET http://localhost:8080/api/inquiries/{inquiryId}/answers
```

---

## 9. 현재 시스템 흐름

```text
사용자 문의 등록
↓
Spring Boot가 MySQL에 문의 저장
↓
Spring Boot가 FastAPI AI 서버 호출
↓
FastAPI가 답변 초안 반환
↓
Spring Boot가 AI 초안 저장
↓
교직원이 초안 검토 및 승인
↓
최종 답변 저장
↓
사용자에게 최종 답변 제공
```

---

## 10. 문의 상태 흐름

```text
RECEIVED
↓
AI_DRAFTED
↓
COMPLETED
```

### 상태 설명

| 상태 | 설명 |
|---|---|
| `RECEIVED` | 사용자가 문의를 등록한 상태 |
| `AI_DRAFTED` | AI 답변 초안이 생성된 상태 |
| `COMPLETED` | 관리자가 최종 답변을 승인한 상태 |

---

## 11. 다음 개발 예정

- AI 초안 중복 생성 방지
- 최종 답변 중복 승인 방지
- ChromaDB 연동
- 공지/FAQ 문서 저장 API 구현
- RAG 기반 유사 문서 검색
- LLM 기반 답변 생성
- React 프론트엔드 구현

---

## 12. Git 초기화 및 첫 커밋

새 프로젝트를 처음 Git 저장소로 만들 경우 프로젝트 최상단 폴더에서 실행합니다.

```powershell
cd C:\Users\gudrb\civil-ai-project
git init
git add .
git commit -m "Initial project structure with Spring Boot and FastAPI"
```

Git 사용자 설정이 되어 있지 않으면 아래 명령어를 먼저 실행합니다.

```powershell
git config --global user.name "김형규"
git config --global user.email "your-github-email@example.com"
```

그 후 다시 커밋합니다.

```powershell
git commit -m "Initial project structure with Spring Boot and FastAPI"
```

---

## 13. GitHub 원격 저장소 연결

GitHub에 빈 저장소를 만든 뒤 아래 명령어로 원격 저장소를 연결합니다.

```powershell
git remote add origin 저장소_URL
git branch -M main
git push -u origin main
```

예시:

```powershell
git remote add origin https://github.com/깃허브아이디/저장소이름.git
git branch -M main
git push -u origin main
```

이미 원격 저장소가 연결되어 있는지 확인하려면 아래 명령어를 실행합니다.

```powershell
git remote -v
```

---

## 14. 주의 사항

아래 파일과 폴더는 Git에 올리지 않습니다.

```text
.venv/
venv/
__pycache__/
chroma_db/
.env
build/
.gradle/
.idea/
```

해당 항목들은 `.gitignore`에 추가하여 관리합니다.

---

## 15. 실행 순서 요약

처음 실행할 때는 아래 순서를 따릅니다.

```text
1. GitHub 저장소 clone
2. MySQL DB 생성
3. FastAPI 서버 실행
4. Spring Boot 서버 실행
5. Swagger UI 또는 Postman으로 API 테스트
```

FastAPI와 Spring Boot는 각각 다른 포트에서 실행됩니다.

```text
FastAPI      : http://localhost:8000
Spring Boot  : http://localhost:8080
```
=======
# civil-ai-project
>>>>>>> c899fb41f26598948fdc7cb9323ac21f3a2d3a12

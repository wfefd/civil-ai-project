반복 민원 상담 AI 자동응답 시스템

금오공과대학교 학사 민원에서 반복적으로 발생하는 문의를 효율적으로 처리하기 위한 RAG 기반 AI 답변 지원 시스템입니다.

학생이 문의를 등록하면 관리자는 AI 답변 초안과 과거 유사 답변을 참고하여 최종 답변을 작성할 수 있습니다. 최종 답변은 관리자의 검토와 승인을 거쳐 학생에게 제공되며, 이후 ChromaDB에 HISTORY 데이터로 적재되어 반복 민원 추천에 재활용됩니다.

본 시스템은 AI가 최종 답변을 자동 확정하는 구조가 아니라, AI가 답변 초안을 생성하고 교직원이 검토·승인하는 반자동 민원 처리 지원 시스템입니다.

1. 프로젝트 개요

대학 행정 민원에서는 수강신청, 등록금, 장학금, 휴복학, 졸업, 식당 등 유사한 문의가 반복적으로 발생합니다. 기존 FAQ 검색이나 규칙 기반 챗봇은 표현이 달라지거나 오타가 포함된 질문에 대응하기 어렵고, 교직원이 반복적으로 같은 답변을 작성해야 하는 문제가 있습니다.

본 프로젝트는 학교 공지사항, QnA, 과거 최종 답변 이력을 AI 검색 데이터로 활용하여 다음 기능을 제공합니다.

학생 문의 등록
학생 본인 문의 및 답변 조회
관리자 전체 문의 조회
AI 답변 초안 생성
과거 유사 답변 추천
최종 답변 승인
최종 답변 HISTORY 적재
공지사항 및 QnA 크롤링
ChromaDB 기반 유사도 검색
Gemini API 기반 답변 초안 생성
2. 주요 기능
학생 기능
회원가입 및 로그인
문의 등록
본인이 작성한 문의 목록 조회
문의 상세 및 최종 답변 확인
JWT 기반 본인 문의 접근 제한
관리자 기능
전체 문의 목록 조회
문의 상세 조회
AI 답변 초안 생성
반복 민원 유사 답변 추천
최종 답변 작성 및 승인
문의 상태 관리
AI 기능
사용자 문의 전처리
jamo 기반 도메인 오타 보정
BGE-M3 임베딩 모델 기반 벡터 변환
ChromaDB 유사 문서 검색
Gemini API 기반 AI 답변 초안 생성
HISTORY 기반 반복 민원 추천
크롤링 기능
학교 공지사항 크롤링
QnA 게시글 크롤링
QnA 댓글 API 답변 데이터 수집
PDF, DOCX, HWPX 등 첨부파일 텍스트 추출
articleNo 및 정규화 URL 기반 중복 저장 방지
키워드 기반 카테고리 자동 분류
3. 시스템 구조
civil-ai-project
├─ frontend          # React 프론트엔드
├─ backend           # Spring Boot 백엔드
├─ ai-draft-server   # FastAPI AI 서버
├─ README.md
└─ .gitignore
전체 흐름
학생 문의 등록
↓
React Frontend
↓
Spring Boot Backend
↓
MySQL에 문의 저장
↓
관리자 AI 초안 생성 요청
↓
FastAPI AI Server
↓
질문 전처리 및 오타 보정
↓
BGE-M3 임베딩
↓
ChromaDB에서 NOTICE / QNA / HISTORY 검색
↓
검색 문서 + 사용자 질문을 Gemini API에 전달
↓
AI 답변 초안 생성
↓
관리자 검토 및 최종 답변 승인
↓
MySQL AnswerHistory 저장
↓
ChromaDB HISTORY 적재
↓
반복 민원 추천에 재활용
4. 기술 스택
영역	기술
Frontend	React, JavaScript, CSS
Backend	Java 17, Spring Boot, Spring Security, JWT, Spring Data JPA
Database	MySQL
AI Server	Python, FastAPI, Uvicorn
Vector DB	ChromaDB
Embedding	BGE-M3, sentence-transformers
LLM	Gemini API
Crawling	Jsoup
Typo Correction	jamo
API Test	Swagger UI, FastAPI Docs, Postman
5. AI 서버 의존성 관리

AI 서버는 Python 패키지를 requirements.txt로 관리합니다.

ai-draft-server/requirements.txt 파일을 생성한 뒤 아래 내용을 추가합니다.

fastapi
uvicorn[standard]
pydantic
python-dotenv

chromadb
sentence-transformers
torch

google-generativeai

jamo
numpy
requests

설치 명령어는 다음과 같습니다.

cd ai-draft-server

python -m venv .venv

Windows PowerShell:

.\.venv\Scripts\activate

macOS/Linux:

source .venv/bin/activate

의존성 설치:

pip install -r requirements.txt

Gemini API 연동 코드에서 google-genai 패키지를 사용하고 있다면 google-generativeai 대신 google-genai를 사용해야 합니다.

6. 실행 방법
6.1 프로젝트 clone
git clone https://github.com/wfefd/civil-ai-project.git
cd civil-ai-project
6.2 MySQL 데이터베이스 생성

MySQL에서 아래 SQL을 실행합니다.

CREATE DATABASE civil_ai
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
6.3 Backend 설정

backend/src/main/resources/application.yml 또는 별도 설정 파일에 DB, JWT, AI 서버 주소를 설정합니다.

예시:

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/civil_ai?serverTimezone=Asia/Seoul&characterEncoding=UTF-8
    username: root
    password: your_mysql_password
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        format_sql: true

ai:
  server:
    url: http://localhost:8000

jwt:
  secret: civilai-jwt-secret-key-civilai-jwt-secret-key-123456
  access-token-valid-time: 7200000

crawler:
  qna-cookie: your_qna_login_cookie

qna-cookie는 QnA 게시판 접근이 필요한 경우 설정합니다. 개인 로그인 쿠키나 API 키는 GitHub에 올리지 않아야 합니다.

6.4 AI Server 실행
cd ai-draft-server

python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt

uvicorn main:app --reload --port 8000

macOS/Linux에서는 가상환경 활성화 명령어만 아래처럼 사용합니다.

source .venv/bin/activate

AI 서버 주소:

http://localhost:8000

FastAPI 문서:

http://localhost:8000/docs
6.5 Backend 실행
cd backend
.\gradlew bootRun

macOS/Linux:

./gradlew bootRun

Spring Boot 서버 주소:

http://localhost:8080

Swagger UI:

http://localhost:8080/swagger-ui/index.html

또는 설정에 따라:

http://localhost:8080/docs
6.6 Frontend 실행
cd frontend
npm install
npm run dev

프론트엔드 개발 서버 주소:

http://localhost:5173
7. 실행 순서 요약

처음 실행할 때는 아래 순서를 권장합니다.

1. MySQL DB 생성
2. AI Server 실행
3. Backend 실행
4. Frontend 실행
5. 회원가입 및 로그인
6. 학생 문의 등록
7. 관리자 AI 초안 생성 및 최종 답변 승인
8. 주요 API
Auth
Method	URL	설명
POST	/api/auth/signup	회원가입
POST	/api/auth/login	로그인
GET	/api/auth/me	현재 로그인 사용자 조회
Inquiry
Method	URL	설명
POST	/api/inquiries	학생 문의 등록
GET	/api/inquiries/my	학생 본인 문의 목록 조회
GET	/api/inquiries	관리자 전체 문의 조회
GET	/api/inquiries/{inquiryId}	문의 상세 조회
PATCH	/api/inquiries/{inquiryId}/status	문의 상태 변경
AI Recommendation
Method	URL	설명
POST	/api/inquiries/{inquiryId}/ai-recommendation	AI 답변 초안 생성
GET	/api/inquiries/{inquiryId}/ai-recommendation	AI 답변 초안 조회
GET	/api/inquiries/{inquiryId}/similar-answers	반복 민원 유사 답변 추천
Answer
Method	URL	설명
POST	/api/inquiries/{inquiryId}/answers/approve	최종 답변 승인
GET	/api/inquiries/{inquiryId}/answers	최종 답변 조회
9. ChromaDB 저장 구조

ChromaDB에는 NOTICE, QNA, HISTORY 데이터가 저장됩니다.

source_type	설명	활용
NOTICE	학교 공지사항	AI 답변 초안 참고
QNA	학교 QnA 데이터	AI 답변 초안 참고
HISTORY	관리자가 승인한 과거 최종 답변	반복 민원 추천 및 AI 초안 참고
NOTICE

공지사항 본문 content를 chunk 단위로 나누어 저장합니다.

id: NOTICE-{id}-CHUNK-{index}

document:
  Source Type: NOTICE
  Category: 수업
  Title: 공지사항 제목
  Content Chunk: 공지사항 본문 일부
  Keywords: 수업, 보강, 학사일정
QNA

QnA 답변 데이터를 chunk 단위로 나누어 저장합니다.

id: QNA-{id}-CHUNK-{index}

document:
  Source Type: QNA
  Category: 수강신청
  Question: 질문 제목
  Answer Chunk: 답변 내용 일부
  Keywords: 수강신청, 정정기간
HISTORY

HISTORY는 chunk로 나누지 않고 질문-답변 한 쌍을 하나의 문서로 저장합니다.

유사도 비교에는 질문 중심 document를 사용하고, 실제 답변은 metadata에 저장합니다.

id: HISTORY-{id}

document:
  Source Type: HISTORY
  Category: 수업
  Question: 계절학기 신청 기간이 언제인가요?

metadata:
  source_type: HISTORY
  question: 계절학기 신청 기간이 언제인가요?
  answer: 관리자가 승인한 최종 답변
10. 향후 개선 과제
AI 답변 초안 생성 속도 개선
비동기 처리 및 프롬프트 최적화
반복 민원 추천 정확도 개선
카테고리 필터링 및 최소 유사도 임계값 적용
Spring Scheduler 기반 자동 크롤링
실제 교직원 답변 이력 데이터 확장
관리자 계정 사전 승인 방식 적용
운영 환경 배포 및 로그 모니터링 개선
11. 프로젝트 의의

본 프로젝트는 단순 문의 게시판이 아니라, 학교 공지사항과 QnA, 과거 답변 이력을 AI 검색 데이터로 활용하는 민원 처리 지원 시스템입니다.

AI가 답변을 자동으로 확정하지 않고, 관리자가 검토하고 승인하는 구조를 유지함으로써 행정 답변의 책임성과 신뢰성을 확보하고자 하였습니다.

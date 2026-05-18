import { useState } from "react";
import StudentInquiryCreate from "./pages/StudentInquiryCreate";
import StudentInquiryStatus from "./pages/StudentInquiryStatus";
import AdminInquiryList from "./pages/AdminInquiryList";
import AdminInquiryDetail from "./pages/AdminInquiryDetail";
import "./App.css";

function App() {
  const [mode, setMode] = useState("student");
  const [createdInquiryId, setCreatedInquiryId] = useState(null);
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>반복 민원 상담 AI 자동응답 서비스</h1>
          <p>학생 문의 등록 · AI 초안 생성 · 교직원 최종 승인 흐름</p>
        </div>

        <nav className="top-nav">
          <button
            className={mode === "student" ? "active" : ""}
            onClick={() => setMode("student")}
          >
            학생 화면
          </button>
          <button
            className={mode === "admin" ? "active" : ""}
            onClick={() => setMode("admin")}
          >
            관리자 화면
          </button>
        </nav>
      </header>

      {mode === "student" && (
        <main className="student-layout">
          <StudentInquiryCreate onCreated={setCreatedInquiryId} />
          <StudentInquiryStatus inquiryId={createdInquiryId} />
        </main>
      )}

      {mode === "admin" && (
        <main className="admin-layout">
          <section className="left-panel">
            <AdminInquiryList onSelectInquiry={setSelectedInquiryId} />
          </section>

          <section className="right-panel">
            {selectedInquiryId ? (
              <AdminInquiryDetail inquiryId={selectedInquiryId} />
            ) : (
              <div className="card empty-box">
                <h2>문의 선택 필요</h2>
                <p>왼쪽 목록에서 검토할 문의를 선택하세요.</p>
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}

export default App;
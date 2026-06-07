import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentInquiryCreate from "./pages/StudentInquiryCreate";
import StudentInquiryStatus from "./pages/StudentInquiryStatus";
import AdminInquiryList from "./pages/AdminInquiryList";
import AdminInquiryDetail from "./pages/AdminInquiryDetail";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import "./App.css";

function AdminPage() {
  return (
    <main className="admin-layout">
      <section className="left-panel">
        <AdminInquiryList />
      </section>

      <section className="right-panel">
        <div className="card empty-box">
          <h2>문의 선택 필요</h2>
          <p>왼쪽 목록에서 검토할 문의를 선택하세요.</p>
        </div>
      </section>
    </main>
  );
}

function AdminDetailPage() {
  return (
    <main className="admin-layout">
      <section className="left-panel">
        <AdminInquiryList />
      </section>

      <section className="right-panel">
        <AdminInquiryDetail />
      </section>
    </main>
  );
}

function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <BrowserRouter>
      <div className="app">
        {isLoggedIn && (
          <header className="app-header">
            <div>
              <h1>반복 민원 상담 AI 자동응답 서비스</h1>
              <p>
                현재 접속 유형: {role === "ADMIN" ? "관리자" : "학생"}
              </p>
            </div>

            <nav className="top-nav">
              {role === "STUDENT" && (
                <Link to="/student" className="nav-button">
                  학생 화면
                </Link>
              )}

              {role === "ADMIN" && (
                <Link to="/admin" className="nav-button">
                  관리자 화면
                </Link>
              )}

              <button onClick={logout}>
                로그아웃
              </button>
            </nav>
          </header>
        )}

        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentInquiryCreate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/inquiries/:id"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentInquiryStatus />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inquiries"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/inquiries/:id"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDetailPage />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState("STUDENT");

    const login = () => {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", role);

        if (role === "ADMIN") {
            navigate("/admin");
        } else {
            navigate("/student");
        }
    };

    return (
        <main className="login-layout">
            <div className="card login-card">
                <h2>로그인</h2>
                <p className="description">
                    사용자 유형을 선택하여 시스템에 접속합니다.
                </p>

                <label>사용자 유형</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="STUDENT">학생</option>
                    <option value="ADMIN">관리자</option>
                </select>

                <button onClick={login}>
                    로그인
                </button>
            </div>
        </main>
    );
}

export default LoginPage;
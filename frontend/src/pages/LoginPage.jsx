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
            <div className="login-card">
                <div className="login-logo">Kumoh</div>

                <h1>반복 민원 상담 AI 자동응답 서비스</h1>
                <p>
                    사용자 유형을 선택하여 로그인하세요.
                </p>

                <div className="login-role-group">
                    <button
                        className={role === "STUDENT" ? "role-button active" : "role-button"}
                        onClick={() => setRole("STUDENT")}
                    >
                        학생
                    </button>

                    <button
                        className={role === "ADMIN" ? "role-button active" : "role-button"}
                        onClick={() => setRole("ADMIN")}
                    >
                        관리자
                    </button>
                </div>

                <button className="login-button" onClick={login}>
                    로그인
                </button>
            </div>
        </main>
    );
}

export default LoginPage;
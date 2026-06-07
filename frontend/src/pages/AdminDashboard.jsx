import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function AdminDashboard() {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/admin/dashboard");
            setDashboard(response.data);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "관리자 대시보드를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading && !dashboard) {
        return (
            <main className="admin-layout">
                <div className="card">
                    <p>대시보드를 불러오는 중...</p>
                </div>
            </main>
        );
    }

    if (!dashboard) {
        return (
            <main className="admin-layout">
                <div className="card">
                    <p>대시보드 정보를 불러오지 못했습니다.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="dashboard-layout">
            <section className="dashboard-grid">
                <div className="stat-card">
                    <span>전체 문의</span>
                    <strong>{dashboard.totalInquiryCount}</strong>
                </div>

                <div className="stat-card">
                    <span>접수</span>
                    <strong>{dashboard.receivedCount}</strong>
                </div>

                <div className="stat-card">
                    <span>AI 초안 생성</span>
                    <strong>{dashboard.aiDraftedCount}</strong>
                </div>

                <div className="stat-card">
                    <span>답변 완료</span>
                    <strong>{dashboard.completedCount}</strong>
                </div>
            </section>

            <section className="dashboard-content">
                <div className="card">
                    <div className="card-header">
                        <h2>자주 들어오는 문의 유형 TOP 10</h2>
                        <button onClick={fetchDashboard}>새로고침</button>
                    </div>

                    {dashboard.topCategories.length === 0 && (
                        <p className="muted">아직 집계된 문의 유형이 없습니다.</p>
                    )}

                    <div className="top-category-list">
                        {dashboard.topCategories.map((item, index) => (
                            <div key={item.category} className="top-category-item">
                                <span>{index + 1}. {item.category}</span>
                                <strong>{item.count}건</strong>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h2>최근 문의</h2>
                        <button onClick={() => navigate("/admin/inquiries")}>
                            전체 목록
                        </button>
                    </div>

                    {dashboard.recentInquiries.length === 0 && (
                        <p className="muted">최근 문의가 없습니다.</p>
                    )}

                    <div className="inquiry-list">
                        {dashboard.recentInquiries.map((inquiry) => (
                            <button
                                key={inquiry.id}
                                className="inquiry-item"
                                onClick={() => navigate(`/admin/inquiries/${inquiry.id}`)}
                            >
                                <div className="inquiry-title">
                                    #{inquiry.id} {inquiry.category || "미분류"}
                                </div>
                                <div className="inquiry-content">
                                    {inquiry.content}
                                </div>
                                <div className={`status status-${inquiry.status}`}>
                                    {inquiry.status}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default AdminDashboard;
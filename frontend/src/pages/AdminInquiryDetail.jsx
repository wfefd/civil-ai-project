import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

function AdminInquiryDetail() {
    const { id } = useParams();
    const inquiryId = id;

    const [inquiry, setInquiry] = useState(null);
    const [aiDraft, setAiDraft] = useState(null);
    const [finalAnswer, setFinalAnswer] = useState("");
    const [reviewerName, setReviewerName] = useState("교직원A");
    const [loading, setLoading] = useState(false);

    const fetchInquiry = async () => {
        const response = await api.get(`/api/inquiries/${inquiryId}`);
        setInquiry(response.data);
        return response.data;
    };

    const fetchAiDraft = async () => {
        try {
            const response = await api.get(
                `/api/inquiries/${inquiryId}/ai-recommendation`
            );

            setAiDraft(response.data);
            setFinalAnswer(response.data.draftAnswer);
        } catch (error) {
            setAiDraft(null);
            setFinalAnswer("");
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            await fetchInquiry();
            await fetchAiDraft();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "문의 상세 조회에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const createAiDraft = async () => {
        try {
            setLoading(true);

            const response = await api.post(
                `/api/inquiries/${inquiryId}/ai-recommendation`
            );

            setAiDraft(response.data);
            setFinalAnswer(response.data.draftAnswer);

            await fetchInquiry();

            alert("AI 답변 초안이 생성되었습니다.");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "AI 초안 생성에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const approveAnswer = async () => {
        if (!aiDraft) {
            alert("AI 답변 초안이 먼저 필요합니다.");
            return;
        }

        if (!finalAnswer.trim()) {
            alert("최종 답변 내용을 입력하세요.");
            return;
        }

        if (!reviewerName.trim()) {
            alert("검토자 이름을 입력하세요.");
            return;
        }

        try {
            setLoading(true);

            await api.post(`/api/inquiries/${inquiryId}/answers/approve`, {
                finalAnswer,
                reviewerName,
            });

            await fetchInquiry();

            alert("최종 답변이 승인되었습니다.");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "최종 답변 승인에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (inquiryId) {
            loadData();
        }
    }, [inquiryId]);

    if (loading && !inquiry) {
        return (
            <div className="card">
                <p>문의 상세 정보를 불러오는 중...</p>
            </div>
        );
    }

    if (!inquiry) {
        return (
            <div className="card">
                <p>문의 정보를 찾을 수 없습니다.</p>
            </div>
        );
    }

    const isCompleted = inquiry.status === "COMPLETED";

    return (
        <div className="card detail-card">
            <h2>문의 상세 및 교직원 승인</h2>

            <div className="section">
                <h3>1. 사용자 문의</h3>
                <div className="info-box">
                    <p>
                        <strong>문의 ID:</strong> {inquiry.id}
                    </p>
                    <p>
                        <strong>학생 이름:</strong> {inquiry.studentName}
                    </p>
                    <p>
                        <strong>학번:</strong> {inquiry.studentNumber}
                    </p>
                    <p>
                        <strong>상태:</strong>{" "}
                        <span className={`status status-${inquiry.status}`}>
                            {inquiry.status}
                        </span>
                    </p>
                    <p>
                        <strong>카테고리:</strong> {inquiry.category || "미분류"}
                    </p>
                    <p>
                        <strong>문의 내용:</strong>
                    </p>
                    <div className="content-box">{inquiry.content}</div>
                </div>
            </div>

            <div className="section">
                <h3>2. AI 답변 초안</h3>

                {!aiDraft ? (
                    <div className="empty-box">
                        <p>아직 생성된 AI 답변 초안이 없습니다.</p>
                        <button onClick={createAiDraft} disabled={isCompleted || loading}>
                            AI 초안 생성
                        </button>
                    </div>
                ) : (
                    <div className="info-box">
                        <p>
                            <strong>AI 분류:</strong> {aiDraft.category}
                        </p>
                        <p>
                            <strong>신뢰도:</strong> {aiDraft.confidence}
                        </p>
                        <p>
                            <strong>근거 요약:</strong>
                        </p>
                        <div className="content-box">{aiDraft.sourceSummary}</div>
                        <p>
                            <strong>AI 초안:</strong>
                        </p>
                        <div className="content-box">{aiDraft.draftAnswer}</div>
                    </div>
                )}
            </div>

            <div className="section">
                <h3>3. 교직원 최종 답변 승인</h3>

                {isCompleted && (
                    <div className="notice-box">
                        이 문의는 이미 최종 답변이 승인되었습니다.
                    </div>
                )}

                <label>검토자 이름</label>
                <input
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    disabled={isCompleted}
                />

                <label>최종 답변 내용</label>
                <textarea
                    value={finalAnswer}
                    onChange={(e) => setFinalAnswer(e.target.value)}
                    disabled={isCompleted}
                    placeholder="AI 초안을 검토한 뒤 최종 답변을 작성하세요."
                />

                <button
                    className="approve-button"
                    onClick={approveAnswer}
                    disabled={isCompleted || !aiDraft || loading}
                >
                    {isCompleted ? "이미 승인 완료" : "최종 답변 승인"}
                </button>
            </div>
        </div>
    );
}

export default AdminInquiryDetail;
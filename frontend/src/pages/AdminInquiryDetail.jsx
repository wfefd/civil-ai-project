import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

function AdminInquiryDetail({ onUpdated }) {
    const { id } = useParams();
    const inquiryId = id;

    const [inquiry, setInquiry] = useState(null);
    const [aiDraft, setAiDraft] = useState(null);
    const [finalAnswer, setFinalAnswer] = useState("");
    const [reviewerName, setReviewerName] = useState("교직원A");
    const [reusableAnswers, setReusableAnswers] = useState([]);
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
            setFinalAnswer(response.data.draftAnswer || "");
        } catch (error) {
            setAiDraft(null);
            setFinalAnswer("");
        }
    };

    const fetchReusableAnswers = async () => {
        try {
            const response = await api.get("/api/admin/reusable-answers/top");
            setReusableAnswers(response.data);
        } catch (error) {
            console.error(error);
            setReusableAnswers([]);
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            await fetchInquiry();
            await fetchAiDraft();
            await fetchReusableAnswers();
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
            setFinalAnswer(response.data.draftAnswer || "");

            await fetchInquiry();

            if (onUpdated) {
                onUpdated();
            }

            alert("AI 답변 초안이 생성되었습니다.");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "AI 초안 생성에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const approveAnswer = async () => {

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
            await fetchReusableAnswers();

            if (onUpdated) {
                onUpdated();
            }

            alert("최종 답변이 승인되었습니다.");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "최종 답변 승인에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const useReusableAnswer = (answer) => {
        setFinalAnswer(answer || "");
    };

    const copyText = async (text) => {
        try {
            await navigator.clipboard.writeText(text || "");
            alert("복사되었습니다.");
        } catch (error) {
            alert("복사에 실패했습니다.");
        }
    };

    useEffect(() => {
        if (inquiryId) {
            loadData();
        }
    }, [inquiryId]);

    if (loading && !inquiry) {
        return (
            <div className="chat-detail-loading">
                <div className="sidebar-skeleton wide" />
                <div className="sidebar-skeleton wide" />
                <div className="sidebar-skeleton wide" />
            </div>
        );
    }

    if (!inquiry) {
        return (
            <div className="chat-empty">
                <h2>문의 정보를 찾을 수 없습니다.</h2>
            </div>
        );
    }

    const isCompleted = inquiry.status === "COMPLETED";

    return (
        <div className="admin-chat-detail">
            <div className="chat-detail-header">
                <div>
                    <h2>문의 #{inquiry.id}</h2>
                    <p>
                        {inquiry.studentName} · {inquiry.studentNumber} ·{" "}
                        {inquiry.category || "미분류"}
                    </p>
                </div>

                <span className={`status status-${inquiry.status}`}>
                    {inquiry.status}
                </span>
            </div>

            <div className="admin-detail-grid">
                <section className="chat-conversation">
                    <div className="message-row user-message">
                        <div className="message-avatar">학</div>
                        <div className="message-content">
                            <div className="message-name">학생 질문</div>
                            <div className="message-bubble">{inquiry.content}</div>

                            {!aiDraft && !isCompleted && (
                                <button
                                    className="inline-ai-button"
                                    onClick={createAiDraft}
                                    disabled={loading}
                                >
                                    {loading ? "직접 답변을 작성하거나, AI 초안 또는 반복 민원 답변을 참고하세요." : "AI 답변 초안 생성"}
                                </button>
                            )}
                        </div>
                    </div>

                    {aiDraft && (
                        <div className="message-row ai-message">
                            <div className="message-avatar">AI</div>
                            <div className="message-content">
                                <div className="message-name">
                                    AI 답변 초안
                                    <button
                                        className="copy-button"
                                        onClick={() => copyText(aiDraft.draftAnswer)}
                                    >
                                        복사
                                    </button>
                                </div>

                                <div className="message-bubble">{aiDraft.draftAnswer}</div>

                                <div className="reference-box">
                                    <div>
                                        <strong>AI 분류</strong>
                                        <span>{aiDraft.category}</span>
                                    </div>
                                    <div>
                                        <strong>신뢰도</strong>
                                        <span>{aiDraft.confidence}</span>
                                    </div>
                                    <div>
                                        <strong>근거 요약</strong>
                                        <pre>{aiDraft.sourceSummary}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="message-row admin-message">
                        <div className="message-avatar">관</div>
                        <div className="message-content">
                            <div className="message-name">교직원 최종 답변</div>

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
                                placeholder="AI 초안 또는 반복 민원 답변을 참고하여 최종 답변을 작성하세요."
                            />

                            <div className="answer-actions">
                                <button
                                    className="copy-button"
                                    onClick={() => copyText(finalAnswer)}
                                    disabled={!finalAnswer}
                                >
                                    최종 답변 복사
                                </button>

                                <button
                                    className="approve-button"
                                    onClick={approveAnswer}
                                    disabled={isCompleted || loading || !finalAnswer.trim()}
                                >
                                    {isCompleted ? "이미 승인 완료" : "최종 답변 승인"}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <aside className="reusable-panel">
                    <div className="reusable-panel-header">
                        <div>
                            <h3>반복 민원 답변 TOP 10</h3>
                            <p>교직원 승인 답변을 재사용할 수 있습니다.</p>
                        </div>
                        <button onClick={fetchReusableAnswers}>새로고침</button>
                    </div>

                    {reusableAnswers.length === 0 && (
                        <div className="reusable-empty">
                            아직 재사용 가능한 답변이 없습니다.
                        </div>
                    )}

                    <div className="reusable-list">
                        {reusableAnswers.map((item, index) => (
                            <div key={item.id} className="reusable-card">
                                <div className="reusable-rank">TOP {index + 1}</div>

                                <div className="reusable-category">
                                    {item.category || "일반"} · {item.usedCount}회
                                </div>

                                <div className="reusable-question">
                                    <strong>질문</strong>
                                    <p>{item.question}</p>
                                </div>

                                <div className="reusable-answer">
                                    <strong>답변</strong>
                                    <p>{item.answer}</p>
                                </div>

                                <div className="reusable-actions">
                                    <button onClick={() => useReusableAnswer(item.answer)}>
                                        답변 사용
                                    </button>
                                    <button onClick={() => copyText(item.answer)}>
                                        복사
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default AdminInquiryDetail;
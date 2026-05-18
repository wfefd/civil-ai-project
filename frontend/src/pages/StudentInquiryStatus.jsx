import { useEffect, useState } from "react";
import api from "../api/api";

function StudentInquiryStatus({ inquiryId }) {
    const [inquiry, setInquiry] = useState(null);
    const [answer, setAnswer] = useState(null);

    const fetchStatus = async () => {
        if (!inquiryId) return;

        try {
            const inquiryResponse = await api.get(`/api/inquiries/${inquiryId}`);
            setInquiry(inquiryResponse.data);

            if (inquiryResponse.data.status === "COMPLETED") {
                const answerResponse = await api.get(`/api/inquiries/${inquiryId}/answers`);
                setAnswer(answerResponse.data);
            } else {
                setAnswer(null);
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "문의 상태 조회에 실패했습니다.");
        }
    };

    useEffect(() => {
        fetchStatus();
    }, [inquiryId]);

    if (!inquiryId) {
        return (
            <div className="card empty-box">
                <h2>문의 상태 확인</h2>
                <p>문의를 등록하면 이곳에서 처리 상태를 확인할 수 있습니다.</p>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">
                <h2>문의 상태 확인</h2>
                <button onClick={fetchStatus}>새로고침</button>
            </div>

            {inquiry && (
                <div className="info-box">
                    <p>
                        <strong>문의 ID:</strong> {inquiry.id}
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
            )}

            {inquiry?.status !== "COMPLETED" && (
                <div className="notice-box">
                    아직 최종 답변이 등록되지 않았습니다. 교직원 검토 후 답변이 제공됩니다.
                </div>
            )}

            {answer && (
                <div className="section">
                    <h3>최종 답변</h3>
                    <div className="content-box">{answer.finalAnswer}</div>
                    <p className="muted">검토자: {answer.reviewerName}</p>
                </div>
            )}
        </div>
    );
}

export default StudentInquiryStatus;
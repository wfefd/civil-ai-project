package com.kumoh.civilai.domain.answer;

import com.kumoh.civilai.domain.inquiry.Inquiry;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AnswerHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 어떤 문의에 대한 최종 답변인지 연결
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inquiry_id", nullable = false)
    private Inquiry inquiry;

    /**
     * 최종 답변 당시 사용자 질문
     * 추후 AI 서버에 HISTORY 데이터로 전달하기 위해 저장
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    /**
     * 교직원이 검토 및 승인한 최종 답변
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String finalAnswer;

    /**
     * 문의 카테고리
     * 예: 등록금, 장학, 휴복학, 수강신청 등
     */
    private String category;

    /**
     * 검토자 이름
     */
    private String reviewerName;

    /**
     * AI 서버의 ChromaDB에 HISTORY 데이터로 적재되었는지 여부
     */
    private Boolean indexed;

    private LocalDateTime createdAt;

    public AnswerHistory(
            Inquiry inquiry,
            String question,
            String finalAnswer,
            String category,
            String reviewerName
    ) {
        this.inquiry = inquiry;
        this.question = question;
        this.finalAnswer = finalAnswer;
        this.category = category;
        this.reviewerName = reviewerName;
        this.indexed = false;
        this.createdAt = LocalDateTime.now();
    }

    public void markIndexed() {
        this.indexed = true;
    }
}
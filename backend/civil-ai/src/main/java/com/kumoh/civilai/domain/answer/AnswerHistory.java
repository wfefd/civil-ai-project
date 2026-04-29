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

    @Column(nullable = false, length = 3000)
    private String finalAnswer;

    private String reviewerName;

    private LocalDateTime createdAt;

    public AnswerHistory(Inquiry inquiry, String finalAnswer, String reviewerName) {
        this.inquiry = inquiry;
        this.finalAnswer = finalAnswer;
        this.reviewerName = reviewerName;
        this.createdAt = LocalDateTime.now();
    }
}
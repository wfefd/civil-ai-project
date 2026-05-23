package com.kumoh.civilai.service;

import com.kumoh.civilai.domain.answer.AnswerHistory;
import com.kumoh.civilai.domain.answer.AnswerHistoryRepository;
import com.kumoh.civilai.domain.inquiry.Inquiry;
import com.kumoh.civilai.domain.inquiry.InquiryRepository;
import com.kumoh.civilai.domain.inquiry.InquiryStatus;
import com.kumoh.civilai.dto.ai.AiHistoryIndexRequest;
import com.kumoh.civilai.dto.ai.AiHistoryIndexResponse;
import com.kumoh.civilai.dto.answer.AnswerApproveRequest;
import com.kumoh.civilai.dto.answer.AnswerHistoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnswerService {

    private final InquiryRepository inquiryRepository;
    private final AnswerHistoryRepository answerHistoryRepository;
    private final AiServerClient aiServerClient;

    @Transactional
    public AnswerHistoryResponse approveAnswer(Long inquiryId, AnswerApproveRequest request) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다. id=" + inquiryId));

        if (inquiry.getStatus() == InquiryStatus.COMPLETED) {
            throw new IllegalStateException("이미 최종 답변이 승인된 문의입니다.");
        }

        if (answerHistoryRepository.findByInquiryId(inquiryId).isPresent()) {
            throw new IllegalStateException("이미 최종 답변이 존재합니다.");
        }

        if (inquiry.getStatus() != InquiryStatus.AI_DRAFTED) {
            throw new IllegalStateException("AI 답변 초안이 생성된 문의만 최종 승인할 수 있습니다.");
        }

        AnswerHistory answerHistory = new AnswerHistory(
                inquiry,
                inquiry.getContent(),
                request.getFinalAnswer(),
                inquiry.getCategory(),
                request.getReviewerName()
        );

        AnswerHistory savedAnswer = answerHistoryRepository.save(answerHistory);

        inquiry.updateStatus(InquiryStatus.COMPLETED);

        indexAnswerHistory(savedAnswer);

        return new AnswerHistoryResponse(savedAnswer);
    }

    public AnswerHistoryResponse getAnswerByInquiryId(Long inquiryId) {
        AnswerHistory answerHistory = answerHistoryRepository.findByInquiryId(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("최종 답변을 찾을 수 없습니다. inquiryId=" + inquiryId));

        return new AnswerHistoryResponse(answerHistory);
    }

    private void indexAnswerHistory(AnswerHistory answerHistory) {
        String category = answerHistory.getCategory() != null
                ? answerHistory.getCategory()
                : "일반";

        String title = category + " 문의 최종 답변";

        String content = "질문: " + answerHistory.getQuestion()
                + "\n답변: " + answerHistory.getFinalAnswer();

        AiHistoryIndexRequest request = new AiHistoryIndexRequest(
                answerHistory.getId(),
                answerHistory.getInquiry().getId(),
                "HISTORY",
                title,
                content,
                category
        );

        AiHistoryIndexResponse response = aiServerClient.indexHistory(request);

        if (Boolean.TRUE.equals(response.getIndexed())) {
            answerHistory.markIndexed();
        }
    }
}
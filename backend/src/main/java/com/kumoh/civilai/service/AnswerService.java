package com.kumoh.civilai.service;

import com.kumoh.civilai.domain.answer.AnswerHistory;
import com.kumoh.civilai.domain.answer.AnswerHistoryRepository;
import com.kumoh.civilai.domain.inquiry.Inquiry;
import com.kumoh.civilai.domain.inquiry.InquiryRepository;
import com.kumoh.civilai.domain.inquiry.InquiryStatus;
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

    @Transactional
    public AnswerHistoryResponse approveAnswer(Long inquiryId, AnswerApproveRequest request) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다. id=" + inquiryId));

        AnswerHistory answerHistory = new AnswerHistory(
                inquiry,
                request.getFinalAnswer(),
                request.getReviewerName()
        );

        AnswerHistory savedAnswer = answerHistoryRepository.save(answerHistory);

        inquiry.updateStatus(InquiryStatus.COMPLETED);

        return new AnswerHistoryResponse(savedAnswer);
    }

    public AnswerHistoryResponse getAnswerByInquiryId(Long inquiryId) {
        AnswerHistory answerHistory = answerHistoryRepository.findByInquiryId(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("최종 답변을 찾을 수 없습니다. inquiryId=" + inquiryId));

        return new AnswerHistoryResponse(answerHistory);
    }
}
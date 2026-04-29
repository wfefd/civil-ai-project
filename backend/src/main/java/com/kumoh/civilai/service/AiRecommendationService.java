package com.kumoh.civilai.service;

import com.kumoh.civilai.domain.ai.AiRecommendation;
import com.kumoh.civilai.domain.ai.AiRecommendationRepository;
import com.kumoh.civilai.domain.inquiry.Inquiry;
import com.kumoh.civilai.domain.inquiry.InquiryRepository;
import com.kumoh.civilai.domain.inquiry.InquiryStatus;
import com.kumoh.civilai.dto.ai.AiDraftResponse;
import com.kumoh.civilai.dto.ai.AiRecommendationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AiRecommendationService {

    private final InquiryRepository inquiryRepository;
    private final AiRecommendationRepository aiRecommendationRepository;
    private final AiServerClient aiServerClient;

    @Transactional
    public AiRecommendationResponse createRecommendation(Long inquiryId) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다. id=" + inquiryId));

        AiDraftResponse aiResponse = aiServerClient.requestDraft(
                inquiry.getId(),
                inquiry.getContent()
        );

        AiRecommendation recommendation = new AiRecommendation(
                inquiry,
                aiResponse.getDraftAnswer(),
                aiResponse.getCategory(),
                aiResponse.getConfidence(),
                aiResponse.getSourceSummary()
        );

        AiRecommendation savedRecommendation = aiRecommendationRepository.save(recommendation);

        inquiry.updateStatus(InquiryStatus.AI_DRAFTED);
        inquiry.updateCategory(aiResponse.getCategory());

        return new AiRecommendationResponse(savedRecommendation);
    }

    public AiRecommendationResponse getRecommendationByInquiryId(Long inquiryId) {
        AiRecommendation recommendation = aiRecommendationRepository.findByInquiryId(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("AI 추천 답변을 찾을 수 없습니다. inquiryId=" + inquiryId));

        return new AiRecommendationResponse(recommendation);
    }
}
package com.kumoh.civilai.service;

import com.kumoh.civilai.domain.inquiry.Inquiry;
import com.kumoh.civilai.domain.inquiry.InquiryRepository;
import com.kumoh.civilai.domain.inquiry.InquiryStatus;
import com.kumoh.civilai.dto.inquiry.InquiryCreateRequest;
import com.kumoh.civilai.dto.inquiry.InquiryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InquiryService {

    private final InquiryRepository inquiryRepository;

    @Transactional
    public InquiryResponse createInquiry(InquiryCreateRequest request) {
        Inquiry inquiry = new Inquiry(
                request.getStudentName(),
                request.getStudentNumber(),
                request.getContent()
        );

        Inquiry savedInquiry = inquiryRepository.save(inquiry);
        return new InquiryResponse(savedInquiry);
    }

    public List<InquiryResponse> getAllInquiries() {
        return inquiryRepository.findAll()
                .stream()
                .map(InquiryResponse::new)
                .toList();
    }

    public InquiryResponse getInquiry(Long inquiryId) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다. id=" + inquiryId));

        return new InquiryResponse(inquiry);
    }

    @Transactional
    public InquiryResponse updateStatus(Long inquiryId, InquiryStatus status) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다. id=" + inquiryId));

        inquiry.updateStatus(status);
        return new InquiryResponse(inquiry);
    }
}
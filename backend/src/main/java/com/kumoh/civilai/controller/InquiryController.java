package com.kumoh.civilai.controller;

import com.kumoh.civilai.dto.inquiry.InquiryCreateRequest;
import com.kumoh.civilai.dto.inquiry.InquiryResponse;
import com.kumoh.civilai.dto.inquiry.InquiryStatusUpdateRequest;
import com.kumoh.civilai.service.InquiryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    @PostMapping
    public InquiryResponse createInquiry(@Valid @RequestBody InquiryCreateRequest request) {
        return inquiryService.createInquiry(request);
    }

    @GetMapping
    public List<InquiryResponse> getAllInquiries() {
        return inquiryService.getAllInquiries();
    }

    @GetMapping("/{inquiryId}")
    public InquiryResponse getInquiry(@PathVariable Long inquiryId) {
        return inquiryService.getInquiry(inquiryId);
    }

    @PatchMapping("/{inquiryId}/status")
    public InquiryResponse updateStatus(
            @PathVariable Long inquiryId,
            @Valid @RequestBody InquiryStatusUpdateRequest request
    ) {
        return inquiryService.updateStatus(inquiryId, request.getStatus());
    }
}
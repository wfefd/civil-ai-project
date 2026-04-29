package com.kumoh.civilai.dto.inquiry;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class InquiryCreateRequest {

    private String studentName;

    private String studentNumber;

    @NotBlank(message = "문의 내용은 필수입니다.")
    private String content;
}
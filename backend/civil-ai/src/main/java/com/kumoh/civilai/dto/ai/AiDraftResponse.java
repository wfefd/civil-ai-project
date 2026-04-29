package com.kumoh.civilai.dto.ai;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AiDraftResponse {

    private String draftAnswer;
    private String category;
    private Double confidence;
    private String sourceSummary;
}
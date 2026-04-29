package com.kumoh.civilai.service;

import com.kumoh.civilai.dto.ai.AiDraftRequest;
import com.kumoh.civilai.dto.ai.AiDraftResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
@RequiredArgsConstructor
public class AiServerClient {

    private final RestClient.Builder restClientBuilder;

    @Value("${ai.server.url}")
    private String aiServerUrl;

    public AiDraftResponse requestDraft(Long inquiryId, String question) {
        RestClient restClient = restClientBuilder
                .baseUrl(aiServerUrl)
                .build();

        AiDraftRequest request = new AiDraftRequest(inquiryId, question);

        return restClient.post()
                .uri("/api/ai/draft")
                .body(request)
                .retrieve()
                .body(AiDraftResponse.class);
    }
}
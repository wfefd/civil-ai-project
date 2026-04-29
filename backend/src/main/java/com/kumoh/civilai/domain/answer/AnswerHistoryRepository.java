package com.kumoh.civilai.domain.answer;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AnswerHistoryRepository extends JpaRepository<AnswerHistory, Long> {

    Optional<AnswerHistory> findByInquiryId(Long inquiryId);
}
package com.kumoh.civilai.domain.inquiry;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    List<Inquiry> findByStatus(InquiryStatus status);
}
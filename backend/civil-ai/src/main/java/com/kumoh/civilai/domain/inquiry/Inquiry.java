package com.kumoh.civilai.domain.inquiry;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Inquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;

    private String studentNumber;

    @Column(nullable = false, length = 1000)
    private String content;

    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InquiryStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Inquiry(String studentName, String studentNumber, String content) {
        this.studentName = studentName;
        this.studentNumber = studentNumber;
        this.content = content;
        this.status = InquiryStatus.RECEIVED;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void updateStatus(InquiryStatus status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateCategory(String category) {
        this.category = category;
        this.updatedAt = LocalDateTime.now();
    }
}
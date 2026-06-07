package com.kumoh.civilai.dto.admin;

import com.kumoh.civilai.domain.inquiry.Inquiry;
import com.kumoh.civilai.domain.inquiry.InquiryStatus;
import lombok.Getter;

import java.util.List;

@Getter
public class AdminDashboardResponse {

    private final long totalInquiryCount;
    private final long receivedCount;
    private final long aiDraftedCount;
    private final long completedCount;
    private final List<TopCategoryItem> topCategories;
    private final List<RecentInquiryItem> recentInquiries;

    public AdminDashboardResponse(
            long totalInquiryCount,
            long receivedCount,
            long aiDraftedCount,
            long completedCount,
            List<TopCategoryItem> topCategories,
            List<RecentInquiryItem> recentInquiries
    ) {
        this.totalInquiryCount = totalInquiryCount;
        this.receivedCount = receivedCount;
        this.aiDraftedCount = aiDraftedCount;
        this.completedCount = completedCount;
        this.topCategories = topCategories;
        this.recentInquiries = recentInquiries;
    }

    @Getter
    public static class TopCategoryItem {
        private final String category;
        private final long count;

        public TopCategoryItem(String category, long count) {
            this.category = category;
            this.count = count;
        }
    }

    @Getter
    public static class RecentInquiryItem {
        private final Long id;
        private final String studentName;
        private final String studentNumber;
        private final String content;
        private final String category;
        private final InquiryStatus status;

        public RecentInquiryItem(Inquiry inquiry) {
            this.id = inquiry.getId();
            this.studentName = inquiry.getStudentName();
            this.studentNumber = inquiry.getStudentNumber();
            this.content = inquiry.getContent();
            this.category = inquiry.getCategory();
            this.status = inquiry.getStatus();
        }
    }
}
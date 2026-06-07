package com.kumoh.civilai.service;

import com.kumoh.civilai.domain.inquiry.Inquiry;
import com.kumoh.civilai.domain.inquiry.InquiryRepository;
import com.kumoh.civilai.domain.inquiry.InquiryStatus;
import com.kumoh.civilai.dto.admin.AdminDashboardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminDashboardService {

    private final InquiryRepository inquiryRepository;

    public AdminDashboardResponse getDashboard() {
        long totalCount = inquiryRepository.count();
        long receivedCount = inquiryRepository.countByStatus(InquiryStatus.RECEIVED);
        long aiDraftedCount = inquiryRepository.countByStatus(InquiryStatus.AI_DRAFTED);
        long completedCount = inquiryRepository.countByStatus(InquiryStatus.COMPLETED);

        List<AdminDashboardResponse.TopCategoryItem> topCategories =
                inquiryRepository.findTopCategories(PageRequest.of(0, 10))
                        .stream()
                        .map(row -> new AdminDashboardResponse.TopCategoryItem(
                                String.valueOf(row[0]),
                                (Long) row[1]
                        ))
                        .toList();

        List<AdminDashboardResponse.RecentInquiryItem> recentInquiries =
                inquiryRepository.findTop5ByOrderByCreatedAtDesc()
                        .stream()
                        .map(AdminDashboardResponse.RecentInquiryItem::new)
                        .toList();

        return new AdminDashboardResponse(
                totalCount,
                receivedCount,
                aiDraftedCount,
                completedCount,
                topCategories,
                recentInquiries
        );
    }
}
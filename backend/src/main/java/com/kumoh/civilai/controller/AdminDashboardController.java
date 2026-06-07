package com.kumoh.civilai.controller;

import com.kumoh.civilai.dto.admin.AdminDashboardResponse;
import com.kumoh.civilai.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping("/api/admin/dashboard")
    public AdminDashboardResponse getDashboard() {
        return adminDashboardService.getDashboard();
    }
}
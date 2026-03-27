package com.payroll.controller;

import com.payroll.dto.SalaryResponse;
import com.payroll.service.SalaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salaries")
@RequiredArgsConstructor
public class SalaryController {

    private final SalaryService salaryService;

    @PostMapping("/generate/{employeeId}")
    public ResponseEntity<SalaryResponse> generateSalary(
            @PathVariable Long employeeId,
            @RequestParam(required = false, defaultValue = "0") Double bonus,
            @RequestParam(required = false, defaultValue = "0") Double deductions) {
        return ResponseEntity.ok(salaryService.generateSalary(employeeId, bonus, deductions));
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<List<SalaryResponse>> getSalaryHistory(@PathVariable Long employeeId) {
        return ResponseEntity.ok(salaryService.getSalaryHistory(employeeId));
    }

    @GetMapping("/slip/{salaryId}")
    public ResponseEntity<SalaryResponse> getSalarySlip(@PathVariable Long salaryId) {
        return ResponseEntity.ok(salaryService.getSalarySlip(salaryId));
    }
}


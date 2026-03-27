package com.payroll.controller;

import com.payroll.service.DepartmentService;
import com.payroll.service.EmployeeService;
import com.payroll.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final EmployeeService employeeService;
    private final DepartmentService departmentService;
    private final LeaveService leaveService;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(Map.of(
                "totalEmployees", employeeService.getAll().size(),
                "activeEmployees", employeeService.countActive(),
                "totalDepartments", departmentService.getAll().size(),
                "pendingLeaves", leaveService.countPending()
        ));
    }
}


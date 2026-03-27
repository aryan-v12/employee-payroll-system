package com.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private Double basicSalary;
    private Double hra;
    private Double da;
    private Double bonus;
    private Double tax;
    private Double deductions;
    private Double netSalary;
    private Integer month;
    private Integer year;
    private LocalDateTime generatedAt;
}


package com.payroll.service;

import com.payroll.dto.SalaryResponse;
import com.payroll.model.Employee;
import com.payroll.model.Salary;
import com.payroll.repository.SalaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaryService {

    private final SalaryRepository salaryRepository;
    private final EmployeeService employeeService;

    public SalaryResponse generateSalary(Long employeeId, Double bonus, Double deductions) {
        Employee employee = employeeService.getById(employeeId);
        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        if (salaryRepository.existsByEmployeeIdAndMonthAndYear(employeeId, month, year)) {
            throw new RuntimeException("Salary already generated for this employee for " + month + "/" + year);
        }

        double basic = employee.getBasicSalary();
        double hra = basic * 0.20;
        double da = basic * 0.10;
        double tax = basic * 0.05;
        double bonusAmt = bonus != null ? bonus : 0.0;
        double deductionsAmt = deductions != null ? deductions : 0.0;
        double netSalary = basic + hra + da + bonusAmt - tax - deductionsAmt;

        Salary salary = Salary.builder()
                .employee(employee)
                .basicSalary(basic)
                .hra(hra)
                .da(da)
                .bonus(bonusAmt)
                .tax(tax)
                .deductions(deductionsAmt)
                .netSalary(netSalary)
                .month(month)
                .year(year)
                .build();

        salary = salaryRepository.save(salary);
        return mapToResponse(salary);
    }

    public List<SalaryResponse> getSalaryHistory(Long employeeId) {
        return salaryRepository.findByEmployeeIdOrderByYearDescMonthDesc(employeeId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public SalaryResponse getSalarySlip(Long salaryId) {
        Salary salary = salaryRepository.findById(salaryId)
                .orElseThrow(() -> new RuntimeException("Salary record not found with id: " + salaryId));
        return mapToResponse(salary);
    }

    private SalaryResponse mapToResponse(Salary salary) {
        return SalaryResponse.builder()
                .id(salary.getId())
                .employeeId(salary.getEmployee().getId())
                .employeeName(salary.getEmployee().getName())
                .basicSalary(salary.getBasicSalary())
                .hra(salary.getHra())
                .da(salary.getDa())
                .bonus(salary.getBonus())
                .tax(salary.getTax())
                .deductions(salary.getDeductions())
                .netSalary(salary.getNetSalary())
                .month(salary.getMonth())
                .year(salary.getYear())
                .generatedAt(salary.getGeneratedAt())
                .build();
    }
}


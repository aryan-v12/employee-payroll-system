package com.payroll.repository;

import com.payroll.model.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SalaryRepository extends JpaRepository<Salary, Long> {
    List<Salary> findByEmployeeIdOrderByYearDescMonthDesc(Long employeeId);
    boolean existsByEmployeeIdAndMonthAndYear(Long employeeId, Integer month, Integer year);
}


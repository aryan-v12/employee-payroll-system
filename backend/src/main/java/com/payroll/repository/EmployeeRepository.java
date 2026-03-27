package com.payroll.repository;

import com.payroll.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByDepartmentId(Long departmentId);
    long countByStatus(Employee.Status status);
    long countByDepartmentId(Long departmentId);
}


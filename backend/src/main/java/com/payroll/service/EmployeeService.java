package com.payroll.service;

import com.payroll.model.Department;
import com.payroll.model.Employee;
import com.payroll.repository.DepartmentRepository;
import com.payroll.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    public Employee create(Employee employee) {
        if (employee.getDepartment() != null && employee.getDepartment().getId() != null) {
            Department dept = departmentRepository.findById(employee.getDepartment().getId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            employee.setDepartment(dept);
        }
        return employeeRepository.save(employee);
    }

    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    public Employee getById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    }

    public Employee update(Long id, Employee updated) {
        Employee emp = getById(id);
        emp.setName(updated.getName());
        emp.setEmail(updated.getEmail());
        emp.setPhone(updated.getPhone());
        emp.setPosition(updated.getPosition());
        emp.setJoiningDate(updated.getJoiningDate());
        emp.setBasicSalary(updated.getBasicSalary());
        emp.setStatus(updated.getStatus());
        if (updated.getDepartment() != null && updated.getDepartment().getId() != null) {
            Department dept = departmentRepository.findById(updated.getDepartment().getId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            emp.setDepartment(dept);
        }
        return employeeRepository.save(emp);
    }

    public void delete(Long id) {
        employeeRepository.deleteById(id);
    }

    public long countActive() {
        return employeeRepository.countByStatus(Employee.Status.ACTIVE);
    }
}


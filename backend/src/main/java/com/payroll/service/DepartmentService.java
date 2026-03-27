package com.payroll.service;

import com.payroll.dto.DepartmentDTO;
import com.payroll.model.Department;
import com.payroll.model.Employee;
import com.payroll.repository.DepartmentRepository;
import com.payroll.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    public Department create(Department department) {
        return departmentRepository.save(department);
    }

    public List<Department> getAll() {
        return departmentRepository.findAll();
    }

    public List<DepartmentDTO> getAllWithCounts() {
        return departmentRepository.findAll().stream().map(dept -> {
            long count = employeeRepository.countByDepartmentId(dept.getId());
            return DepartmentDTO.builder()
                    .id(dept.getId())
                    .name(dept.getName())
                    .description(dept.getDescription())
                    .employeeCount(count)
                    .build();
        }).collect(Collectors.toList());
    }

    public DepartmentDTO getByIdWithEmployees(Long id) {
        Department dept = getById(id);
        List<Employee> employees = employeeRepository.findByDepartmentId(id);
        List<DepartmentDTO.EmployeeSummary> summaries = employees.stream()
                .map(emp -> DepartmentDTO.EmployeeSummary.builder()
                        .id(emp.getId())
                        .name(emp.getName())
                        .position(emp.getPosition())
                        .status(emp.getStatus() != null ? emp.getStatus().name() : null)
                        .build())
                .collect(Collectors.toList());
        return DepartmentDTO.builder()
                .id(dept.getId())
                .name(dept.getName())
                .description(dept.getDescription())
                .employeeCount((long) employees.size())
                .employees(summaries)
                .build();
    }

    public Department getById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
    }

    public Department update(Long id, Department updated) {
        Department dept = getById(id);
        dept.setName(updated.getName());
        dept.setDescription(updated.getDescription());
        return departmentRepository.save(dept);
    }

    public void delete(Long id) {
        departmentRepository.deleteById(id);
    }
}


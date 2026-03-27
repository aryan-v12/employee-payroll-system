package com.payroll.service;

import com.payroll.model.Employee;
import com.payroll.model.Leave;
import com.payroll.repository.LeaveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final EmployeeService employeeService;

    public Leave apply(Leave leave) {
        Employee employee = employeeService.getById(leave.getEmployee().getId());
        leave.setEmployee(employee);
        leave.setStatus(Leave.LeaveStatus.PENDING);
        return leaveRepository.save(leave);
    }

    public List<Leave> getByEmployee(Long employeeId) {
        return leaveRepository.findByEmployeeId(employeeId);
    }

    public List<Leave> getAll() {
        return leaveRepository.findAll();
    }

    public Leave approve(Long leaveId) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave not found with id: " + leaveId));
        leave.setStatus(Leave.LeaveStatus.APPROVED);
        return leaveRepository.save(leave);
    }

    public Leave reject(Long leaveId) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave not found with id: " + leaveId));
        leave.setStatus(Leave.LeaveStatus.REJECTED);
        return leaveRepository.save(leave);
    }

    public long countPending() {
        return leaveRepository.countByStatus(Leave.LeaveStatus.PENDING);
    }
}


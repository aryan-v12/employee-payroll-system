package com.payroll.repository;

import com.payroll.model.Leave;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeaveRepository extends JpaRepository<Leave, Long> {
    List<Leave> findByEmployeeId(Long employeeId);
    long countByStatus(Leave.LeaveStatus status);
}


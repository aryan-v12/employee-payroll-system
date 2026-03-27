package com.payroll.controller;

import com.payroll.model.Leave;
import com.payroll.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping("/apply")
    public ResponseEntity<Leave> apply(@Valid @RequestBody Leave leave) {
        return ResponseEntity.ok(leaveService.apply(leave));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Leave>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getByEmployee(employeeId));
    }

    @GetMapping
    public ResponseEntity<List<Leave>> getAll() {
        return ResponseEntity.ok(leaveService.getAll());
    }

    @PutMapping("/approve/{leaveId}")
    public ResponseEntity<Leave> approve(@PathVariable Long leaveId) {
        return ResponseEntity.ok(leaveService.approve(leaveId));
    }

    @PutMapping("/reject/{leaveId}")
    public ResponseEntity<Leave> reject(@PathVariable Long leaveId) {
        return ResponseEntity.ok(leaveService.reject(leaveId));
    }
}


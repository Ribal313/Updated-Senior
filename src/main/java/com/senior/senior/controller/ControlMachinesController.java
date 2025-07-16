package com.senior.senior.controller;


import com.senior.senior.entity.ControlMachines;
import com.senior.senior.service.ControlMachinesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/machine")
public class ControlMachinesController {

    @Autowired
    private ControlMachinesService controlService;

    @PostMapping("/{name}/{action}")
    public ResponseEntity<String> control(@PathVariable String name, @PathVariable String action) {
        controlService.controlMachine(name, action);
        return ResponseEntity.ok("Command sent");
    }

    @PostMapping("/control")
    public ResponseEntity<String> controlMachines(@RequestParam String status, @RequestParam double quantity) {
        if (!status.equalsIgnoreCase("ON") && !status.equalsIgnoreCase("OFF")) {
            return ResponseEntity.badRequest().body("Invalid status. Use ON or OFF.");
        }
        controlService.scheduleMachine(status.toUpperCase(), quantity);
        return ResponseEntity.ok("schedule");
    }
    @GetMapping("/latest-name")
    public ResponseEntity<ControlMachines> getLastControlByMachineName(@RequestParam String name) {
        Optional<ControlMachines> optionalMachine = controlService.getLastControlMachinesByName(name);

        return optionalMachine
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}


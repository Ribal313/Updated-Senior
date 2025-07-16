package com.senior.senior.controller;

import com.senior.senior.dto.MachinesDTO;
import com.senior.senior.entity.Machines;
import com.senior.senior.mapper.MachinesMapper;
import com.senior.senior.service.MachinesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/machines")
public class MachinesController {
    private final MachinesMapper machinesMapper = MachinesMapper.INSTANCE;
    @Autowired
    private MachinesService machinesService;

    @GetMapping("/latest-machine")
    public ResponseEntity<List<MachinesDTO>> getLatestForEachMachine() {
        List<MachinesDTO> allMachines = machinesMapper.toDtoList(machinesService.getLatestDataForAllMachines());
        List<MachinesDTO> latestPerMachine = allMachines.stream()
                .collect(Collectors.groupingBy(MachinesDTO::getMachineName))
                .values().stream()
                .map(list -> list.stream()
                        .max(Comparator.comparing(MachinesDTO::getId)) // or getCreatedAt()
                        .orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return ResponseEntity.ok(latestPerMachine);
    }

    @GetMapping("/machineName")
    public ResponseEntity<Machines> getLastMachine(@RequestParam String machineName) {
        Optional<Machines> machineOpt = machinesService.getLastMachineByName(machineName);
        if (machineOpt.isPresent()) {
            return ResponseEntity.ok(machineOpt.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/energy-by-date")
    public ResponseEntity<List<MachinesDTO>> getEnergyByDate(@RequestParam LocalDate date) {
        return ResponseEntity.ok(machinesService.getEnergyByDate(date));
    }
}

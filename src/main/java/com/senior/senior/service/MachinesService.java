package com.senior.senior.service;

import com.senior.senior.dto.MachinesDTO;
import com.senior.senior.entity.Machines;
import com.senior.senior.entity.MonitorMachines;
import com.senior.senior.entity.Users;
import com.senior.senior.mapper.MachinesMapper;
import com.senior.senior.repository.MachinesRepository;
import com.senior.senior.repository.MonitorMachinesRepository;
import com.senior.senior.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MachinesService {

    @Autowired
    private MachinesRepository machinesRepository;
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private MonitorMachinesRepository monitorMachinesRepository;

    private final MachinesMapper machinesMapper = MachinesMapper.INSTANCE;

    public List<MachinesDTO> getLatestDataForAllMachines() {
        return machinesRepository.findLatestDataForAllMachines().stream()
                .map(machinesMapper::toDto)
                .collect(Collectors.toList());
    }

    public Optional<Machines> getLastMachineByName(String machineName) {
        return machinesRepository.findLastMachineByNameNative(machineName);
    }

    public List<MachinesDTO> getEnergyByDate(LocalDate targetDate) {
        List<Machines> machines = machinesRepository.findAllByControlDate(targetDate);
        Users user = usersRepository.findById(1L).orElse(null);

        if (user != null) {
            List<MonitorMachines> monitors = new ArrayList<>();

            for (Machines machine : machines) {
                MonitorMachines monitor = new MonitorMachines();
                monitor.setUser(user);
                monitor.setMachines(machine);
                monitors.add(monitor);
            }

            monitorMachinesRepository.saveAll(monitors);
        }

        return machines.stream()
                .map(machinesMapper::toDto)
                .collect(Collectors.toList());
    }

}
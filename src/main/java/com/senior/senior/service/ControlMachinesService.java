package com.senior.senior.service;


import com.senior.senior.entity.ControlMachines;
import com.senior.senior.entity.Machines;
import com.senior.senior.entity.Users;
import com.senior.senior.repository.ControlMachinesRepository;
import com.senior.senior.repository.UsersRepository;
import com.senior.senior.repository.MachinesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;


import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@Service
public class ControlMachinesService {

    @Autowired
    private ControlMachinesRepository controlMachinesRepository;
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private MachinesRepository machinesRepository;

    @Autowired
    private RestTemplate restTemplate;



    public void controlMachine(String machineName, String action) {
        // Send control request to Raspberry Pi
        String url = "http://raspberrypi.local:8001/control";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("machineName", machineName);
        body.put("action", action.toLowerCase());
        restTemplate.postForObject(url, new HttpEntity<>(body, headers), String.class);


        Users user = usersRepository.findById(1L).orElse(null);
        Machines machine = machinesRepository.findLastMachineByNameNative(machineName).orElse(null);


        ControlMachines control = new ControlMachines();
        control.setName(machineName);
        control.setAction(action);
        control.setControlTime(LocalDateTime.now());
        control.setUser(user);
        control.setMachines(machine);

        controlMachinesRepository.save(control);
    }
    public void scheduleMachine(String status, double quantity) {
        String url = "http://raspberrypi.local:8000/control";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> payload = new HashMap<>();
        payload.put("status", status);
        payload.put("quantity", quantity);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        restTemplate.postForObject(url, request, String.class);


    }

    public Optional<ControlMachines> getLastControlMachinesByName(String name) {
        return controlMachinesRepository.findLastControlMachinesByCName(name);
    }
}


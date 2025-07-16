package com.senior.senior.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="machines")
public class Machines {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String machineName;
    private double energyQuantity;
    private double energyConsumption;
    private String status;
    @Column(name = "control_time")
    private LocalDateTime controlTime;

    @OneToMany(mappedBy = "machines")
    @JsonIgnore
    private List<ControlMachines> controlMachines;
    @OneToMany(mappedBy = "machines")
    @JsonIgnore
    private List<MonitorMachines> monitorMachines;
}

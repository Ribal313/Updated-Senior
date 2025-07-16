package com.senior.senior.dto;


import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MachinesDTO {
    private Long id;
    private String machineName;
    private String energyQuantity;
    private String energyConsumption;
    private String status;
    private LocalDateTime controlTime;
}

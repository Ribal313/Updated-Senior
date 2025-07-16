package com.senior.senior.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ControlMachinesDTO {
    private Long id;
    private String name;
    private String action;
    private String source;
    private LocalDateTime controlTime;
}

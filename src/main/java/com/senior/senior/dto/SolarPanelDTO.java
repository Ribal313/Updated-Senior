package com.senior.senior.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SolarPanelDTO {
    private Long id;
    private String location;
    private double energyProduce;
    private String info;
    private LocalDateTime datetime;
}

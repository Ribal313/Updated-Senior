package com.senior.senior.controller;

import com.senior.senior.dto.SolarPanelDTO;
import com.senior.senior.entity.SolarPanel;
import com.senior.senior.mapper.SolarPanelMapper;
import com.senior.senior.service.SolarPanelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/solarPanel")
public class SolarPanelController {

    @Autowired
    private SolarPanelService solarPanelService;

    private final SolarPanelMapper solarPanelMapper = SolarPanelMapper.INSTANCE;

    @GetMapping("/")
    public ResponseEntity<SolarPanelDTO> getLastInserted() {
        Optional<SolarPanel> panel = solarPanelService.getLastInserted();
        return panel.map(value -> ResponseEntity.ok(solarPanelMapper.toDto(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/Usage_count")
    public double getSolarPanelDailyWorkingHours(
            @RequestParam String info,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return solarPanelService.getDailyWorkingHours(info, date);
    }
}

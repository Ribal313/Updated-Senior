package com.senior.senior.service;

import com.senior.senior.dto.SolarPanelDTO;
import com.senior.senior.entity.SolarPanel;
import com.senior.senior.mapper.SolarPanelMapper;
import com.senior.senior.repository.SolarPanelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;

@Service
public class SolarPanelService {

    @Autowired
    private SolarPanelRepository solarPanelRepository;

    private final SolarPanelMapper solarPanelMapper = SolarPanelMapper.INSTANCE;

    public Optional<SolarPanel> getLastInserted() {
        return solarPanelRepository.findTopByOrderByIdDesc();
    }
    public double getDailyWorkingHours(String info, LocalDate date) {
        String dateStr = date.toString();
        long count;

        if ("Generator".equalsIgnoreCase(info)) {
            count = solarPanelRepository.countGeneratorActiveLogs(dateStr);
        } else if ("Solar".equalsIgnoreCase(info)) {
            count = solarPanelRepository.countSolarActiveLogs(dateStr);
        } else {
            return 0;
        }
        double hours = (count * 6.0) / 3600.0;
        return Math.round(hours * 100.0) / 100.0;
    }


}

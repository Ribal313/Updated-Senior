package com.senior.senior.mapper;

import com.senior.senior.dto.SolarPanelDTO;
import com.senior.senior.entity.SolarPanel;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface SolarPanelMapper {
    SolarPanelMapper INSTANCE = Mappers.getMapper(SolarPanelMapper.class);

    SolarPanel toEntity(SolarPanelDTO solarPanelDTO);
    SolarPanelDTO toDto(SolarPanel solarPanel);
}

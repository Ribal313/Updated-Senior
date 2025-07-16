package com.senior.senior.mapper;

import com.senior.senior.dto.MachinesDTO;
import com.senior.senior.entity.Machines;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface MachinesMapper {
    MachinesMapper INSTANCE = Mappers.getMapper(MachinesMapper.class);

    MachinesDTO toDto(Machines machines);
    List<MachinesDTO> toDtoList(List<MachinesDTO> machines);
    Machines toEntity(MachinesDTO machinesDTO);
    List<MachinesDTO> toDtoList1(List<Machines> filtered);
}

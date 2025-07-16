package com.senior.senior.mapper;


import com.senior.senior.dto.LoginRequest;
import com.senior.senior.dto.UsersDTO;
import com.senior.senior.entity.Users;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface UsersMapper {
    UsersMapper INSTANCE = Mappers.getMapper(UsersMapper.class);
    @Mapping(source = "solarId", target = "solarPanel.id")
    Users toEntity(UsersDTO usersDTO);
    @Mapping(source = "solarPanel.id", target = "solarId")
    UsersDTO toDto(Users users);
    List<UsersDTO> toDTOList(List<Users> users);
    Users loginRequestToEntity(LoginRequest loginRequest);
}
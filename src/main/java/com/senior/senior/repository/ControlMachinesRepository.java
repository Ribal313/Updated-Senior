package com.senior.senior.repository;


import com.senior.senior.entity.ControlMachines;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ControlMachinesRepository extends JpaRepository<ControlMachines, Long> {

    @Query(value = "SELECT * FROM controlmachines WHERE name = :name ORDER BY id DESC LIMIT 1", nativeQuery = true)
    Optional<ControlMachines> findLastControlMachinesByCName(@Param("name") String name);

}

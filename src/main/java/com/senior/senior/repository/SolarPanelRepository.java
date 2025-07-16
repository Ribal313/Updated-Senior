package com.senior.senior.repository;

import com.senior.senior.entity.SolarPanel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SolarPanelRepository extends JpaRepository<SolarPanel, Long> {

    @Query(value = "SELECT COUNT(*) FROM solarpanel WHERE info = 'Generator' AND DATE(datetime) = :date AND energy_produce > -1.0", nativeQuery = true)
    long countGeneratorActiveLogs(@Param("date") String date);

    @Query(value = "SELECT COUNT(*) FROM solarpanel WHERE info = 'Solar' AND DATE(datetime) = :date AND energy_produce BETWEEN 2.0 AND 4.5", nativeQuery = true)
    long countSolarActiveLogs(@Param("date") String date);
    Optional<SolarPanel> findTopByOrderByIdDesc();

}

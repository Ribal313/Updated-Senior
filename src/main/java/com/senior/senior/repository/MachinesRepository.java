package com.senior.senior.repository;

import com.senior.senior.entity.Machines;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MachinesRepository extends JpaRepository<Machines, Long> {
    @Query(value = "SELECT * FROM machines WHERE machine_name = :machineName ORDER BY id DESC LIMIT 1", nativeQuery = true)
    Optional<Machines> findLastMachineByNameNative(@Param("machineName") String machineName);
    @Query(value = """
    SELECT * FROM machines m1
    WHERE m1.id IN (
        SELECT MAX(m2.id) FROM machines m2 GROUP BY m2.machine_name
    )
""", nativeQuery = true)
    List<Machines> findLatestDataForAllMachines();

    @Query("SELECT m FROM Machines m WHERE FUNCTION('DATE', m.controlTime) = :targetDate")
    List<Machines> findAllByControlDate(@Param("targetDate") LocalDate targetDate);

}

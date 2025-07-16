package com.senior.senior.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="users")
public class Users {
    @Id

    private Long id;
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;
    @Email
    private String email;
    private boolean emailVerified = false;
    private String city;
    @Column(name = "user_pass")
    private String userPass;
    private String role;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solar_id", nullable =false)
    private SolarPanel solarPanel;
    @OneToMany(mappedBy = "user")
    private List<ControlMachines> controlMachines;
    @OneToMany(mappedBy = "user")
    private List<MonitorMachines> monitorMachines;
}

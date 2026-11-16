package ITDA_backend.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "region")
@Getter
@NoArgsConstructor
public class Region {
    @Id
    private Integer regionId;
    private String regionShortName;
    private String ldongRegnCd;
}
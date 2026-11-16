package ITDA_backend.repository;

import ITDA_backend.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegionRepository extends JpaRepository<Region, Integer> {
    List<Region> findAllByOrderByRegionIdAsc();
}
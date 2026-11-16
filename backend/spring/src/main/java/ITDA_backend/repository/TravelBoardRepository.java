package ITDA_backend.repository;

import ITDA_backend.entity.TravelBoard;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TravelBoardRepository extends JpaRepository<TravelBoard, Integer> {
    @EntityGraph(attributePaths = "course")
    List<TravelBoard> findByUserIdOrderByVisitedAtDesc(Integer userId);
}
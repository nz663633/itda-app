package ITDA_backend.repository;

import ITDA_backend.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface DestinationRepository extends JpaRepository<Destination, Integer> {
    @Query(value = """
            SELECT d.* FROM destination d
            JOIN course_destination cd ON d.destination_id = cd.destination_id
            WHERE cd.course_id = :courseId
            ORDER BY cd.visit_order
            """, nativeQuery = true)
    List<Destination> findByCourseId(@Param("courseId") Integer courseId);
}
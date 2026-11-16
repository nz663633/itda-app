package ITDA_backend.repository;

import ITDA_backend.entity.CourseDestination;
import ITDA_backend.entity.CourseDestinationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseDestinationRepository extends JpaRepository<CourseDestination, CourseDestinationId> {

    List<CourseDestination> findByCourseIdOrderByVisitOrderAsc(Integer courseId);

    Optional<CourseDestination> findByCourseIdAndDestinationId(Integer courseId, Integer destinationId);

    boolean existsByCourseIdAndDestinationId(Integer courseId, Integer destinationId);

    long countByCourseId(Integer courseId);

    // 마지막 순서 번호 (여행지가 없으면 0)
    @Query("SELECT COALESCE(MAX(cd.visitOrder), 0) FROM CourseDestination cd WHERE cd.courseId = :courseId")
    Integer findMaxVisitOrder(@Param("courseId") Integer courseId);

    // 제거된 순서보다 뒤에 있는 것들을 한 칸씩 앞으로
    @Modifying
    @Query("UPDATE CourseDestination cd SET cd.visitOrder = cd.visitOrder - 1 " +
            "WHERE cd.courseId = :courseId AND cd.visitOrder > :removedOrder")
    void pullForward(@Param("courseId") Integer courseId, @Param("removedOrder") Integer removedOrder);
}
package ITDA_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "course_destination")
@IdClass(CourseDestinationId.class)
@Getter
@NoArgsConstructor
public class CourseDestination {

    @Id
    private Integer courseId;

    @Id
    private Integer destinationId;

    private Integer visitOrder;

    public CourseDestination(Integer courseId, Integer destinationId, Integer visitOrder) {
        this.courseId = courseId;
        this.destinationId = destinationId;
        this.visitOrder = visitOrder;
    }

    public void changeVisitOrder(Integer visitOrder) {
        this.visitOrder = visitOrder;
    }
}
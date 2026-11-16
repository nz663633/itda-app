package ITDA_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "course")
@Getter
@NoArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer courseId;
    private Integer userId;
    private String courseTitle;

    @Column(insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Course(Integer userId, String courseTitle) {
        this.userId = userId;
        this.courseTitle = courseTitle;
    }

    public void changeTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }
}
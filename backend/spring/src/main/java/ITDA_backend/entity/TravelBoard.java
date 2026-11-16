package ITDA_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "travel_board")
@Getter
@NoArgsConstructor
public class TravelBoard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer boardId;

    private Integer userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course; // 코스가 삭제되면 보드도 같이 삭제됨 (DB CASCADE). 예전 데이터는 null일 수 있음

    private String boardTitle;
    private String boardContext;
    private LocalDate visitedAt;

    @Column(insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public TravelBoard(Integer userId, Course course, String boardTitle,
                       String boardContext, LocalDate visitedAt) {
        this.userId = userId;
        this.course = course;
        this.boardTitle = boardTitle;
        this.boardContext = boardContext;
        this.visitedAt = visitedAt;
    }

    public void update(String boardTitle, String boardContext, LocalDate visitedAt) {
        if (boardTitle != null) this.boardTitle = boardTitle;
        if (boardContext != null) this.boardContext = boardContext;
        if (visitedAt != null) this.visitedAt = visitedAt;
    }
}
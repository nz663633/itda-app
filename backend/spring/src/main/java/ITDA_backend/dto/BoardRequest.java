package ITDA_backend.dto;

import java.time.LocalDate;

public class BoardRequest {
    public record Create(Integer courseId, String boardTitle,
                         String boardContext, LocalDate visitedAt) {}

    public record Update(String boardTitle, String boardContext, LocalDate visitedAt) {}
}
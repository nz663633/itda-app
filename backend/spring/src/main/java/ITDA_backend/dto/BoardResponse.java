package ITDA_backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class BoardResponse {
    // 마커 하나 = 장소 하나
    public record Place(Integer destinationId, String destinationName,
                        Double latitude, Double longitude) {}

    public record Create(Integer boardId, String boardTitle, LocalDate visitedAt) {}

    public record ListItem(Integer boardId, String boardTitle, Integer courseId,
                           String courseTitle, List<Place> places, LocalDate visitedAt) {}

    public record ListResponse(List<ListItem> boards) {}

    public record Detail(Integer boardId, String boardTitle, String boardContext,
                         Integer courseId, String courseTitle, List<Place> places,
                         List<Object> photos, List<Object> expenses,
                         LocalDate visitedAt, LocalDateTime createdAt, LocalDateTime updatedAt) {}

    public record Update(Integer boardId, String boardTitle, String boardContext, LocalDate visitedAt) {}
}
package ITDA_backend.dto;

import java.util.List;

public class CourseRequest {
    public record Create(String courseTitle) {}

    public record Update(String courseTitle) {}

    public record AddDestination(Integer destinationId) {}

    public record Reorder(List<Integer> destinationIds) {}
}
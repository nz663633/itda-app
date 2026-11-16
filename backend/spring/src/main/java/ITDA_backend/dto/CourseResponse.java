package ITDA_backend.dto;

import ITDA_backend.entity.Course;

import java.util.List;

public class CourseResponse {

    public record Create(Integer courseId, String courseTitle) {
        public static Create from(Course course) {
            return new Create(course.getCourseId(), course.getCourseTitle());
        }
    }

    public record ListItem(Integer courseId, String courseTitle, Long destinationCount) {}

    public record ListResponse(List<ListItem> courses) {}

    public record DestinationItem(Integer destinationId, String destinationName, Integer visitOrder) {}

    public record Detail(Integer courseId, String courseTitle, List<DestinationItem> destinations) {}

    public record Update(Integer courseId, String courseTitle) {}

    public record AddDestination(Integer courseId, Integer destinationId, Integer visitOrder) {}
}
package ITDA_backend.controller;

import ITDA_backend.dto.CourseRequest;
import ITDA_backend.dto.CourseResponse;
import ITDA_backend.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CourseResponse.Create create(@RequestAttribute("userId") Integer userId,
                                        @RequestBody CourseRequest.Create request) {
        return courseService.create(userId, request);
    }

    @GetMapping
    public CourseResponse.ListResponse getMyCourses(@RequestAttribute("userId") Integer userId) {
        return courseService.getMyCourses(userId);
    }

    @GetMapping("/{courseId}")
    public CourseResponse.Detail getCourse(@RequestAttribute("userId") Integer userId,
                                           @PathVariable Integer courseId) {
        return courseService.getCourse(userId, courseId);
    }

    @PatchMapping("/{courseId}")
    public CourseResponse.Update updateTitle(@RequestAttribute("userId") Integer userId,
                                             @PathVariable Integer courseId,
                                             @RequestBody CourseRequest.Update request) {
        return courseService.updateTitle(userId, courseId, request);
    }

    @PostMapping("/{courseId}/destinations")
    @ResponseStatus(HttpStatus.CREATED)
    public CourseResponse.AddDestination addDestination(@RequestAttribute("userId") Integer userId,
                                                        @PathVariable Integer courseId,
                                                        @RequestBody CourseRequest.AddDestination request) {
        return courseService.addDestination(userId, courseId, request);
    }

    @PatchMapping("/{courseId}/destinations/order")
    public Map<String, Boolean> reorder(@RequestAttribute("userId") Integer userId,
                                        @PathVariable Integer courseId,
                                        @RequestBody CourseRequest.Reorder request) {
        courseService.reorder(userId, courseId, request);
        return Map.of("success", true);
    }

    @DeleteMapping("/{courseId}/destinations/{destinationId}")
    public Map<String, Boolean> removeDestination(@RequestAttribute("userId") Integer userId,
                                                  @PathVariable Integer courseId,
                                                  @PathVariable Integer destinationId) {
        courseService.removeDestination(userId, courseId, destinationId);
        return Map.of("success", true);
    }

    @DeleteMapping("/{courseId}")
    public Map<String, Boolean> delete(@RequestAttribute("userId") Integer userId,
                                       @PathVariable Integer courseId) {
        courseService.delete(userId, courseId);
        return Map.of("success", true);
    }
}
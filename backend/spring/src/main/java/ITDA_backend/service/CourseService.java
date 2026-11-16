package ITDA_backend.service;

import ITDA_backend.dto.CourseRequest;
import ITDA_backend.dto.CourseResponse;
import ITDA_backend.entity.Course;
import ITDA_backend.entity.CourseDestination;
import ITDA_backend.entity.Destination;
import ITDA_backend.repository.CourseDestinationRepository;
import ITDA_backend.repository.CourseRepository;
import ITDA_backend.repository.DestinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseDestinationRepository courseDestinationRepository;
    private final DestinationRepository destinationRepository;

    // 코스 생성
    @Transactional
    public CourseResponse.Create create(Integer userId, CourseRequest.Create request) {
        Course saved = courseRepository.save(new Course(userId, validTitle(request.courseTitle())));
        return CourseResponse.Create.from(saved);
    }

    // 내 코스 목록
    @Transactional(readOnly = true)
    public CourseResponse.ListResponse getMyCourses(Integer userId) {
        List<CourseResponse.ListItem> items = courseRepository.findByUserIdOrderByCourseIdDesc(userId)
                .stream()
                .map(course -> new CourseResponse.ListItem(
                        course.getCourseId(),
                        course.getCourseTitle(),
                        courseDestinationRepository.countByCourseId(course.getCourseId())))
                .toList();
        return new CourseResponse.ListResponse(items);
    }

    // 코스 상세
    @Transactional(readOnly = true)
    public CourseResponse.Detail getCourse(Integer userId, Integer courseId) {
        Course course = findMyCourse(userId, courseId);
        List<CourseDestination> courseDestinations =
                courseDestinationRepository.findByCourseIdOrderByVisitOrderAsc(courseId);

        // 여행지 이름을 한 번에 가져와서 id → Destination 으로 정리
        List<Integer> destinationIds = courseDestinations.stream()
                .map(CourseDestination::getDestinationId)
                .toList();
        Map<Integer, Destination> destinationMap = destinationRepository.findAllById(destinationIds)
                .stream()
                .collect(Collectors.toMap(Destination::getDestinationId, d -> d));

        List<CourseResponse.DestinationItem> items = courseDestinations.stream()
                .map(cd -> new CourseResponse.DestinationItem(
                        cd.getDestinationId(),
                        destinationMap.get(cd.getDestinationId()).getDestinationName(),
                        cd.getVisitOrder()))
                .toList();

        return new CourseResponse.Detail(course.getCourseId(), course.getCourseTitle(), items);
    }

    // 코스 제목 수정
    @Transactional
    public CourseResponse.Update updateTitle(Integer userId, Integer courseId, CourseRequest.Update request) {
        Course course = findMyCourse(userId, courseId);
        course.changeTitle(validTitle(request.courseTitle()));
        return new CourseResponse.Update(course.getCourseId(), course.getCourseTitle());
    }

    // 코스에 여행지 추가 (맨 뒤 순서)
    @Transactional
    public CourseResponse.AddDestination addDestination(Integer userId, Integer courseId,
                                                        CourseRequest.AddDestination request) {
        findMyCourse(userId, courseId);

        Integer destinationId = request.destinationId();
        if (destinationId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "여행지를 선택해주세요");
        }
        if (!destinationRepository.existsById(destinationId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "여행지를 찾을 수 없습니다");
        }
        if (courseDestinationRepository.existsByCourseIdAndDestinationId(courseId, destinationId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 코스에 있는 여행지입니다");
        }

        int nextOrder = courseDestinationRepository.findMaxVisitOrder(courseId) + 1;
        courseDestinationRepository.save(new CourseDestination(courseId, destinationId, nextOrder));
        return new CourseResponse.AddDestination(courseId, destinationId, nextOrder);
    }

    // 코스 내 순서 변경
    @Transactional
    public void reorder(Integer userId, Integer courseId, CourseRequest.Reorder request) {
        findMyCourse(userId, courseId);

        List<Integer> newOrder = request.destinationIds();
        List<CourseDestination> current = courseDestinationRepository.findByCourseIdOrderByVisitOrderAsc(courseId);
        Set<Integer> currentIds = current.stream()
                .map(CourseDestination::getDestinationId)
                .collect(Collectors.toSet());

        // 개수가 같고, 들어있는 여행지가 똑같아야 함 (빠짐·추가·중복 X)
        if (newOrder == null || newOrder.size() != current.size()
                || !currentIds.equals(new HashSet<>(newOrder))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "코스의 여행지 목록과 일치하지 않습니다");
        }

        Map<Integer, CourseDestination> byId = current.stream()
                .collect(Collectors.toMap(CourseDestination::getDestinationId, cd -> cd));
        for (int i = 0; i < newOrder.size(); i++) {
            byId.get(newOrder.get(i)).changeVisitOrder(i + 1);
        }
    }

    // 코스에서 여행지 제거
    @Transactional
    public void removeDestination(Integer userId, Integer courseId, Integer destinationId) {
        findMyCourse(userId, courseId);

        CourseDestination target = courseDestinationRepository
                .findByCourseIdAndDestinationId(courseId, destinationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "코스에 없는 여행지입니다"));

        int removedOrder = target.getVisitOrder();
        courseDestinationRepository.delete(target);
        courseDestinationRepository.pullForward(courseId, removedOrder);
    }

    // 코스 삭제
    @Transactional
    public void delete(Integer userId, Integer courseId) {
        courseRepository.delete(findMyCourse(userId, courseId));
    }

    // ---- 공통 ----

    private Course findMyCourse(Integer userId, Integer courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "코스를 찾을 수 없습니다"));
        if (!course.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "내 코스만 사용할 수 있습니다");
        }
        return course;
    }

    private String validTitle(String title) {
        if (title == null || title.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "코스 제목을 입력해주세요");
        }
        return title.trim();
    }
}
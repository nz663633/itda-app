package ITDA_backend.service;

import ITDA_backend.dto.BoardRequest;
import ITDA_backend.dto.BoardResponse;
import ITDA_backend.entity.Course;
import ITDA_backend.entity.TravelBoard;
import ITDA_backend.repository.CourseRepository;
import ITDA_backend.repository.DestinationRepository;
import ITDA_backend.repository.TravelBoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TravelBoardService {
    private final TravelBoardRepository travelBoardRepository;
    private final CourseRepository courseRepository;
    private final DestinationRepository destinationRepository;

    // 생성
    @Transactional
    public BoardResponse.Create create(Integer userId, BoardRequest.Create req) {
        if (req.courseId() == null || req.visitedAt() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "course_id, visited_at은 필수입니다");
        }
        String title = requireText(req.boardTitle(), "제목을 입력해주세요");
        String context = requireText(req.boardContext(), "내용을 입력해주세요");

        Course course = courseRepository.findById(req.courseId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "코스를 찾을 수 없습니다"));
        if (!course.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "내 코스가 아닙니다");
        }

        TravelBoard board = travelBoardRepository.save(
                new TravelBoard(userId, course, title, context, req.visitedAt()));
        return new BoardResponse.Create(board.getBoardId(), board.getBoardTitle(), board.getVisitedAt());
    }

    // 목록
    @Transactional(readOnly = true)
    public BoardResponse.ListResponse getMyBoards(Integer userId) {
        List<BoardResponse.ListItem> items = travelBoardRepository.findByUserIdOrderByVisitedAtDesc(userId)
                .stream()
                .map(b -> new BoardResponse.ListItem(
                        b.getBoardId(),
                        b.getBoardTitle(),
                        courseIdOf(b),
                        courseTitleOf(b),
                        placesOf(b),
                        b.getVisitedAt()))
                .toList();
        return new BoardResponse.ListResponse(items);
    }

    // 상세
    @Transactional(readOnly = true)
    public BoardResponse.Detail getBoard(Integer userId, Integer boardId) {
        TravelBoard b = findMyBoard(userId, boardId);
        return new BoardResponse.Detail(
                b.getBoardId(), b.getBoardTitle(), b.getBoardContext(),
                courseIdOf(b), courseTitleOf(b), placesOf(b),
                List.of(), List.of(), // 사진, 지출은 2차
                b.getVisitedAt(), b.getCreatedAt(), b.getUpdatedAt());
    }

    // 수정
    @Transactional
    public BoardResponse.Update update(Integer userId, Integer boardId, BoardRequest.Update req) {
        TravelBoard b = findMyBoard(userId, boardId);

        // 보낸 값만 검사 (null이면 안 바꾸는 거니까 통과)
        String title = (req.boardTitle() != null) ? requireText(req.boardTitle(), "제목을 입력해주세요") : null;
        String context = (req.boardContext() != null) ? requireText(req.boardContext(), "내용을 입력해주세요") : null;

        b.update(title, context, req.visitedAt());
        return new BoardResponse.Update(b.getBoardId(), b.getBoardTitle(), b.getBoardContext(), b.getVisitedAt());
    }

    // 삭제
    @Transactional
    public void delete(Integer userId, Integer boardId) {
        travelBoardRepository.delete(findMyBoard(userId, boardId));
    }

    // 공통: 보드 찾고 내건지 확인 (없으면 404, 남의거면 403)

    private TravelBoard findMyBoard(Integer userId, Integer boardId) {
        TravelBoard b = travelBoardRepository.findById(boardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "보드를 찾을 수 없습니다"));
        if (!b.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "내 보드가 아닙니다");
        }
        return b;
    }

    private String requireText(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return value.trim();
    }

    // 코스가 삭제된 보드면 null
    private Integer courseIdOf(TravelBoard b) {
        return b.getCourse() != null ? b.getCourse().getCourseId() : null;
    }

    private String courseTitleOf(TravelBoard b) {
        return b.getCourse() != null ? b.getCourse().getCourseTitle() : null;
    }

    // 코스에 담긴 장소들 = 지도 마커. 코스가 없으면 빈 배열
    private List<BoardResponse.Place> placesOf(TravelBoard b) {
        if (b.getCourse() == null) return List.of();
        return destinationRepository.findByCourseId(b.getCourse().getCourseId()).stream()
                .map(d -> new BoardResponse.Place(
                        d.getDestinationId(), d.getDestinationName(),
                        d.getLatitude(), d.getLongitude()))
                .toList();
    }
}
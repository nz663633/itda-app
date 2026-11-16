package ITDA_backend.controller;

import ITDA_backend.dto.BoardRequest;
import ITDA_backend.dto.BoardResponse;
import ITDA_backend.service.TravelBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class TravelBoardController {
    private final TravelBoardService travelBoardService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BoardResponse.Create create(@RequestAttribute("userId") Integer userId,
                                       @RequestBody BoardRequest.Create request) {
        return travelBoardService.create(userId, request);
    }

    @GetMapping
    public BoardResponse.ListResponse list(@RequestAttribute("userId") Integer userId) {
        return travelBoardService.getMyBoards(userId);
    }

    @GetMapping("/{id}")
    public BoardResponse.Detail detail(@RequestAttribute("userId") Integer userId,
                                       @PathVariable Integer id) {
        return travelBoardService.getBoard(userId, id);
    }

    @PatchMapping("/{id}")
    public BoardResponse.Update update(@RequestAttribute("userId") Integer userId,
                                       @PathVariable Integer id,
                                       @RequestBody BoardRequest.Update request) {
        return travelBoardService.update(userId, id, request);
    }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> delete(@RequestAttribute("userId") Integer userId,
                                       @PathVariable Integer id) {
        travelBoardService.delete(userId, id);
        return Map.of("success", true);
    }
}
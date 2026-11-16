package ITDA_backend.controller;
import ITDA_backend.dto.UserResponse;
import ITDA_backend.dto.UserUpdateRequest;
import ITDA_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserResponse getMe(@RequestAttribute("userId") Integer userId) {
        return userService.getMe(userId);
    }

    @PatchMapping("/me")
    public UserResponse updateMe(@RequestAttribute("userId") Integer userId,
                                 @RequestBody UserUpdateRequest request) {
        return userService.updateMe(userId, request);
    }

    @DeleteMapping("/me")
    public Map<String, Boolean> deleteMe(@RequestAttribute("userId") Integer userId) {
        userService.deleteMe(userId);
        return Map.of("success", true);
    }
}
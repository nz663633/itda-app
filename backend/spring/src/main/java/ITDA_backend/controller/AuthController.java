package ITDA_backend.controller;

import ITDA_backend.dto.LoginRequest;
import ITDA_backend.dto.LoginResponse;
import ITDA_backend.dto.RefreshRequest;
import ITDA_backend.dto.TokenResponse;
import ITDA_backend.service.AuthService;
import ITDA_backend.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    private final RefreshTokenService refreshTokenService;

    @PostMapping("/refresh")
    public TokenResponse refresh(@RequestBody RefreshRequest request) {
        return refreshTokenService.refresh(request.refreshToken());
    }

    @PostMapping("/logout")
    public Map<String, Boolean> logout(@RequestBody RefreshRequest request) {
        refreshTokenService.logout(request.refreshToken());
        return Map.of("success", true);
    }
}
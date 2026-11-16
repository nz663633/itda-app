package ITDA_backend.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtInterceptor implements HandlerInterceptor {
    private final JwtProvider jwtProvider;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        String header = request.getHeader("Authorization");

        // 1. 밴드를 안 차고 왔으면 → 401
        if (header == null || !header.startsWith("Bearer ")) {
            sendError(response, "로그인이 필요합니다");
            return false;
        }

        // 2. 밴드가 가짜거나 만료됐으면 → 401
        try {
            String token = header.substring(7); // "Bearer " 7글자 떼고 토큰만
            Integer userId = jwtProvider.getUserId(token);
            request.setAttribute("userId", userId); // 3. 통과! 누군지 적어서 컨트롤러로 넘김
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            sendError(response, "유효하지 않거나 만료된 토큰입니다");
            return false;
        }
    }

    private void sendError(HttpServletResponse response, String message) throws IOException {
        response.setStatus(401);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }
}
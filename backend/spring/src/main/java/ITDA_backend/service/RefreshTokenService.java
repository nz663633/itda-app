package ITDA_backend.service;

import ITDA_backend.dto.TokenResponse;
import ITDA_backend.entity.RefreshToken;
import ITDA_backend.repository.RefreshTokenRepository;
import ITDA_backend.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.HexFormat;


@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProvider jwtProvider;

    @Value("${jwt.refresh-expiration-days}")
    private long refreshExpirationDays;

    // 로그인할 때: 새 refresh token 만들어서 DB에 저장
    @Transactional
    public String create(Integer userId) {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        String token = HexFormat.of().formatHex(bytes); // 정확히 64자

        OffsetDateTime expiresAt = OffsetDateTime.now().plusDays(refreshExpirationDays);
        refreshTokenRepository.save(new RefreshToken(userId, token, expiresAt));
        return token;
    }

    // 재발급: 옛날 거 지우고 둘 다 새로
    @Transactional
    public TokenResponse refresh(String oldToken) {
        RefreshToken saved = refreshTokenRepository.findByToken(oldToken)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "다시 로그인해주세요"));

        if (saved.isExpired()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "다시 로그인해주세요");
        }

        Integer userId = saved.getUserId();
        refreshTokenRepository.delete(saved);

        String newAccess = jwtProvider.createToken(userId);
        String newRefresh = create(userId);
        return new TokenResponse(newAccess, newRefresh);
    }

    // 로그아웃: DB에서 삭제 (없어도 그냥 성공 처리)
    @Transactional
    public void logout(String token) {
        refreshTokenRepository.deleteByToken(token);
    }
}
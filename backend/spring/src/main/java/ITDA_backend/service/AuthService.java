package ITDA_backend.service;

import ITDA_backend.dto.LoginRequest;
import ITDA_backend.dto.LoginResponse;
import ITDA_backend.dto.SocialUserInfo;
import ITDA_backend.entity.User;
import ITDA_backend.repository.UserRepository;
import ITDA_backend.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final KakaoOAuthClient kakaoOAuthClient;
    private final GoogleOAuthClient googleOAuthClient;
    private final NaverOAuthClient naverOAuthClient;
    private final JwtProvider jwtProvider;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        if (request.provider() == null || request.providerToken() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "provider와 provider_token은 필수입니다");
        }

        SocialUserInfo info = switch (request.provider()) {
            case "kakao" -> kakaoOAuthClient.getUserInfo(request.providerToken());
            case "google" -> googleOAuthClient.getUserInfo(request.providerToken());
            case "naver" -> naverOAuthClient.getUserInfo(request.providerToken());
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지원하지 않는 provider입니다");
        };

        // 1. db에서 같은 소셜 계정으로 가입한 사람이 있는지 찾기
        Optional<User> found = userRepository.findByProviderAndProviderId(request.provider(), info.providerId());

        // 2. 못 찾았으면 신규 회원
        boolean isNewUser = found.isEmpty();

        // 3. 있으면 그 사람, 없으면 새로 저장 (자동 가입)
        //    이메일은 저장 안 함: user_email이 UNIQUE라 다른 소셜로 같은 이메일 가입하면 충돌남
        User user = found.orElseGet(() ->
                userRepository.save(new User(info.name(), null, request.provider(), info.providerId())));

        // 4. 그 사람의 user_id로 JWT 발급
        String token = jwtProvider.createToken(user.getUserId());
        String refreshToken = refreshTokenService.create(user.getUserId());

        return new LoginResponse(token, refreshToken, isNewUser,
                new LoginResponse.UserInfo(user.getUserId(), user.getUserName(), null));
    }
}
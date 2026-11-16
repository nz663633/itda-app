package ITDA_backend.service;

import ITDA_backend.dto.SocialUserInfo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@Component
public class KakaoOAuthClient {
    private final RestClient restClient = RestClient.create();

    public SocialUserInfo getUserInfo(String accessToken) {
        try {
            Map body = restClient.get()
                    .uri("https://kapi.kakao.com/v2/user/me")
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .body(Map.class);

            Map properties = (Map) body.get("properties");
            return new SocialUserInfo(
                    String.valueOf(body.get("id")),
                    null,
                    (String) properties.get("nickname"));
        } catch (HttpClientErrorException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "소셜 인증 실패");
        }
    }
}
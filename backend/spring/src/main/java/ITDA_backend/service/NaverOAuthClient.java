package ITDA_backend.service;

import ITDA_backend.dto.SocialUserInfo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@Component
public class NaverOAuthClient {
    private final RestClient restClient = RestClient.create();

    public SocialUserInfo getUserInfo(String accessToken) {
        try {
            Map body = restClient.get()
                    .uri("https://openapi.naver.com/v1/nid/me")
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .body(Map.class);

            // 네이버는 사용자 정보가 "response" 안에 한 번 더 들어 있어
            Map response = (Map) body.get("response");

            String name = (String) response.get("nickname");
            if (name == null) {
                name = "네이버사용자"; // 별명 동의를 안 했을 때 대비 (user_name이 NOT NULL이라)
            }

            return new SocialUserInfo(
                    (String) response.get("id"),
                    (String) response.get("email"),
                    name);
        } catch (HttpClientErrorException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "소셜 인증 실패");
        }
    }
}
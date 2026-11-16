package ITDA_backend.service;

import ITDA_backend.dto.SocialUserInfo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@Component
public class GoogleOAuthClient {
    private final RestClient restClient = RestClient.create();

    public SocialUserInfo getUserInfo(String accessToken) {
        try {
            Map body = restClient.get()
                    .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .body(Map.class);

            return new SocialUserInfo(
                    (String) body.get("sub"),
                    (String) body.get("email"),
                    (String) body.get("name"));
        } catch (HttpClientErrorException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "소셜 인증 실패");
        }
    }
}

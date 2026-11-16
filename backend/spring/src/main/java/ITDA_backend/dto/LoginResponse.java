package ITDA_backend.dto;

public record LoginResponse(String token, String refreshToken, boolean isNewUser, UserInfo user) {
    public record UserInfo(Integer userId, String userName, String profileImageUrl) {}
}
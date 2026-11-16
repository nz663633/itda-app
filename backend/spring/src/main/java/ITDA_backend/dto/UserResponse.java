package ITDA_backend.dto;
import ITDA_backend.entity.User;

public record UserResponse(Integer userId, String userName, String profileImageUrl) {

    public static UserResponse from(User user) {
        return new UserResponse(user.getUserId(), user.getUserName(), null);
    }
}
package ITDA_backend.service;

import ITDA_backend.dto.UserResponse;
import ITDA_backend.dto.UserUpdateRequest;
import ITDA_backend.entity.User;
import ITDA_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserResponse getMe(Integer userId) {
        return UserResponse.from(findUser(userId));
    }

    @Transactional
    public UserResponse updateMe(Integer userId, UserUpdateRequest request) {
        User user = findUser(userId);

        if (request.userName() != null) {
            if (request.userName().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "닉네임을 입력해주세요");
            }
            user.changeName(request.userName().trim());
        }
        return UserResponse.from(user);
    }

    @Transactional
    public void deleteMe(Integer userId) {
        userRepository.delete(findUser(userId));
    }

    private User findUser(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "다시 로그인해주세요"));
    }
}
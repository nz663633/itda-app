package ITDA_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;
    private String userName;
    private String userEmail;
    private String provider;
    private String providerId;

    public User(String userName, String userEmail, String provider, String providerId) {
        this.userName = userName;
        this.userEmail = userEmail;
        this.provider = provider;
        this.providerId = providerId;
    }

    public void changeName(String userName) {
        this.userName = userName;
    }
}
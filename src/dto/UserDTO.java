package dto;

public class UserDTO {
    public String id;
    public String username;
    public String role;

    public UserDTO(String id, String username, String role) {
        this.id = id;
        this.username = username;
        this.role = role;
    }
}

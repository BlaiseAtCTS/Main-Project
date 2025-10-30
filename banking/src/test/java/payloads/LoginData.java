package payloads;

import com.fasterxml.jackson.databind.JsonNode;
import loaders.JSONLoader;

public class LoginData {
    private String userName;
    private String password;

    public LoginData() {
        JsonNode node = JSONLoader.loadJson("loginData");
        this.userName = node.get("userName").asText();
        this.password = node.get("password").asText();
    }

    public String getUserName() {
        return userName;
    }

    public String getPassword() {
        return password;
    }
}

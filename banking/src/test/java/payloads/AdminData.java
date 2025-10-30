package payloads;

import com.fasterxml.jackson.databind.JsonNode;
import loaders.JSONLoader;

public class AdminData {
    private String userName;
    private String password;
    private String action;

    public AdminData() {
        JsonNode node = JSONLoader.loadJson("adminData");
        this.userName = node.get("userName").asText();
        this.password = node.get("password").asText();
        this.action = node.get("action").asText();
    }

    public String getUserName() {
        return userName;
    }

    public String getPassword() {
        return password;
    }

    public String getAction() {
        return action;
    }
}

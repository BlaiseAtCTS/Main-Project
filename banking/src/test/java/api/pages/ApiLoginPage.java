package api.pages;

import api.payloads.LoginData;
import api.services.ApiServices;
import io.restassured.response.Response;

public class ApiLoginPage {
    public Response apiPostRequest() {
        return new ApiServices()
                .postRequest("/user/login", null, new LoginData());
    }
}

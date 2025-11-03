package api.pages;

import api.services.ApiServices;
import io.restassured.response.Response;
import api.payloads.RegistrationData;

public class ApiRegisterPage {
    public Response apiPostRequest() {
        return new ApiServices()
                .postRequest("/user/register", null, new RegistrationData());
    }
}

package api.pages;

import api.services.ApiServices;
import io.restassured.response.Response;
import api.payloads.account.AccountCreateData;

public class ApiAccountPage {
    public Response apiPostRequest() {
        return new ApiServices()
                .postRequest("/account/create", new ApiServices()
                        .getToken(), new AccountCreateData());
    }
}

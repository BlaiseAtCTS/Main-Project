package api.pages;

import api.payloads.account.AccountWithdrawData;
import api.services.ApiServices;
import io.restassured.response.Response;

public class ApiWithdrawPage {
    public Response apiPostRequest() {
        return new ApiServices()
                .postRequest("/account/withdraw", new ApiServices()
                        .getToken(), new AccountWithdrawData());
    }
}
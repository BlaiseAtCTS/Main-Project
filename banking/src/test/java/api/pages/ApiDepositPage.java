package api.pages;

import api.payloads.account.AccountCreateData;
import api.services.ApiServices;
import io.restassured.response.Response;
import pages.payloads.account.AccountDepositData;

public class ApiDepositPage {
    public Response apiPostRequest() {
        return new ApiServices()
                .postRequest("/account/deposit", new ApiServices()
                        .getToken(), new AccountCreateData());
    }
}

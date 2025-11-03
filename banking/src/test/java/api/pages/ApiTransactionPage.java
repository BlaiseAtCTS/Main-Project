package api.pages;

import api.services.ApiServices;
import io.restassured.response.Response;
import pages.payloads.account.AccountTransferData;

public class ApiTransactionPage {
    public Response apiPostRequest() {
        return new ApiServices()
                .postRequest("/transaction/transfer", new ApiServices()
                        .getToken(), new AccountTransferData());
    }
}

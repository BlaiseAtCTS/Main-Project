package steps;

import api.pages.*;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.response.Response;
import org.testng.Assert;

public class ApiSteps {
    private ApiRegisterPage apiRegisterPage = new ApiRegisterPage();
    private ApiLoginPage apiLoginPage = new ApiLoginPage();
    private ApiAccountPage apiAccountPage = new ApiAccountPage();
    private ApiDepositPage apiDepositPage = new ApiDepositPage();
    private ApiWithdrawPage apiWithdrawPage = new ApiWithdrawPage();
    private ApiTransactionPage apiTransactionPage = new ApiTransactionPage();
    private Response response;

    @When("User sends POST request to {string} page")
    public void userSendsPOSTRequestToPage(String arg0) {
        if(arg0.equalsIgnoreCase("register")) {
            response = apiRegisterPage.apiPostRequest();
        } else if(arg0.equalsIgnoreCase("login")) {
            response = apiLoginPage.apiPostRequest();
        }
    }

    @Then("User receives Status {int}")
    public void userReceivesStatus(int status) {
        Assert.assertEquals(response.statusCode(), status);
    }

    @When("User sends {string} request to Account Create page")
    public void userSendsRequestToAccountCreatePage(String arg0) {
        if(arg0.equalsIgnoreCase("post")) {
            response = apiAccountPage.apiPostRequest();
        }
    }

    @When("User sends {string} request to Account Deposit page")
    public void userSendsRequestToAccountDepositPage(String arg0) {
        if(arg0.equalsIgnoreCase("post")) {
            response = apiDepositPage.apiPostRequest();
        }
    }

    @When("User sends {string} request to Account Withdraw page")
    public void userSendsRequestToAccountWithdrawPage(String arg0) {
        if(arg0.equalsIgnoreCase("post")) {
            response = apiWithdrawPage.apiPostRequest();
        }
    }

    @When("User sends {string} request to Account Transfer page")
    public void userSendsRequestToAccountTransferPage(String arg0) {
        if(arg0.equalsIgnoreCase("post")) {
            response = apiTransactionPage.apiPostRequest();
        }
    }
}

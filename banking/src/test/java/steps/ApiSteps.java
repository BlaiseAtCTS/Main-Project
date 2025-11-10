package steps;

import api.loader.ApiJsonLoader;
import api.pages.*;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.response.Response;
import org.testng.Assert;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class ApiSteps {
    private ApiRegisterPage apiRegisterPage = new ApiRegisterPage();
    private ApiLoginPage apiLoginPage = new ApiLoginPage();
    private ApiAccountPage apiAccountPage = new ApiAccountPage();
    private ApiDepositPage apiDepositPage = new ApiDepositPage();
    private ApiWithdrawPage apiWithdrawPage = new ApiWithdrawPage();
    private ApiTransactionPage apiTransactionPage = new ApiTransactionPage();
    private ApiJsonLoader apiJsonLoader = new ApiJsonLoader();
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
            System.out.println("Response is: "+response.getBody().asString());
        }
    }

    @When("User sends {string} request to Account Transfer page")
    public void userSendsRequestToAccountTransferPage(String arg0) {
        if(arg0.equalsIgnoreCase("post")) {
            response = apiTransactionPage.apiPostRequest();
        }
    }

    @Then("User receives expected response for Account {string}")
    public void userReceivesExpectedResponseForAccount(String arg0) {
        if (arg0.equalsIgnoreCase("creation")) {
            Assert.assertEquals(response.getBody().asString(), apiJsonLoader.loadJson("api_account_create.json"), "Wrong response body");
        } else {
            Assert.fail("Incorrect Api Account Request");
        }
    }
}

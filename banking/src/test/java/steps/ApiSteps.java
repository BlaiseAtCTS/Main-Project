package steps;

import io.restassured.response.ResponseBody;
import io.restassured.response.ResponseBodyData;
import pages.*;
import payloads.LoginData;
import payloads.RegistrationData;
import api.services.ApiServices;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.response.Response;
import org.testng.Assert;

public class ApiSteps {
    private RegisterPage registerPage = new RegisterPage();
    private LoginPage loginPage = new LoginPage();
    private UserAccountPage userAccountPage = new UserAccountPage();
    private UserDepositPage userDepositPage = new UserDepositPage();
    private UserWithdrawPage userWithdrawPage = new UserWithdrawPage();
    private UserTransactionPage userTransactionPage = new UserTransactionPage();

    private Response response;

    @When("User sends POST request to {string} page")
    public void userSendsPOSTRequestToPage(String arg0) {
        if(arg0.equalsIgnoreCase("register")) {
            response = registerPage.apiPostRequest();
        } else if(arg0.equalsIgnoreCase("login")) {
            response = loginPage.apiPostRequest();
        }
    }

    @Then("User receives Status {int}")
    public void userReceivesStatus(int status) {
        Assert.assertEquals(response.statusCode(), status);
    }

    @When("User sends POST request to Account {string} page")
    public void userSendsPOSTRequestToAccountPage(String transactionType) {
        if(transactionType.equalsIgnoreCase("create")) {
            response = userAccountPage.apiPostRequest();
        } else if(transactionType.equalsIgnoreCase("deposit")) {
            response = userDepositPage.apiPostRequest();
        } else if(transactionType.equalsIgnoreCase("withdraw")) {
            response = userWithdrawPage.apiPostRequest();
        } else if(transactionType.equalsIgnoreCase("transfer")) {
            response = userTransactionPage.apiPostRequest();
        }
    }
}

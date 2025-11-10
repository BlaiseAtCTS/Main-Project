package api.payloads.account;

import com.fasterxml.jackson.databind.JsonNode;
import com.github.javafaker.Faker;
import loaders.JSONLoader;

public class AccountWithdrawData {
    private String accountNumber;
    private String amount;

    Faker faker;

    public AccountWithdrawData() {
        faker = new Faker();
        JsonNode node = JSONLoader.loadJson("accountData.json");
        this.accountNumber = node.get("accountNumber").asText();
        this.amount = String.valueOf(faker.number().numberBetween(1000, 2000));
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public String getAmount() {
        return amount;
    }
}

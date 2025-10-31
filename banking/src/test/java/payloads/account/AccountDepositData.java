package payloads.account;

import com.fasterxml.jackson.databind.JsonNode;
import com.github.javafaker.Faker;
import loaders.JSONLoader;

public class AccountDepositData {
    private String accountNumber;
    private String amount;

    Faker faker;

    public AccountDepositData() {
        faker = new Faker();
        JsonNode node = JSONLoader.loadJson("accountData");
        this.accountNumber = node.get("accountNumber").asText();
        this.amount = String.valueOf(faker.number().numberBetween(5000, 7000));
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public String getAmount() {
        return amount;
    }
}

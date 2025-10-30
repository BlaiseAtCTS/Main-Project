package payloads.account;

import com.fasterxml.jackson.databind.JsonNode;
import com.github.javafaker.Faker;
import loaders.JSONLoader;

public class AccountCreateData {
    private String type;
    private String initialBalance;

    Faker faker;

    public AccountCreateData() {
        faker = new Faker();
        JsonNode node = JSONLoader.loadJson("accountData");
        this.type = node.get("type").asText();
        this.initialBalance = String.valueOf(faker.number().numberBetween(10000, 12000));
    }

    public String getType() {
        return type;
    }

    public String getInitialBalance() {
        return initialBalance;
    }
}

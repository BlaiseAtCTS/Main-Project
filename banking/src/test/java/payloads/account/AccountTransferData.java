package payloads.account;

import com.fasterxml.jackson.databind.JsonNode;
import com.github.javafaker.Faker;
import loaders.JSONLoader;

public class AccountTransferData {
    private String sourceAccountNumber;
    private String destinationAccountNumber;
    private String amount;

    Faker faker;

    public AccountTransferData() {
        faker = new Faker();
        JsonNode node = JSONLoader.loadJson("accountData");
        this.sourceAccountNumber = node.get("accountNumber").asText();
        this.destinationAccountNumber = node.get("destinationAccountNumber").asText();;
        this.amount = String.valueOf(faker.number().numberBetween(500, 1000));
    }

    public String getSourceAccountNumber() {
        return sourceAccountNumber;
    }

    public String getDestinationAccountNumber() {
        return destinationAccountNumber;
    }

    public String getAmount() {
        return amount;
    }
}

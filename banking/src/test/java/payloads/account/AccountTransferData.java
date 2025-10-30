package payloads.account;

import com.fasterxml.jackson.databind.JsonNode;
import com.github.javafaker.Faker;
import loaders.JSONLoader;

public class AccountTransferData {
    private String type;
    private String destinationAccountNumber;
    private String transferAmount;

    Faker faker;

    public AccountTransferData() {
        faker = new Faker();
        JsonNode node = JSONLoader.loadJson("accountData");
        this.type = node.get("accountNumber").asText();
        this.destinationAccountNumber = node.get("destinationAccountNumber").asText();;
        this.transferAmount = String.valueOf(faker.number().numberBetween(500, 1000));
    }

    public String getType() {
        return type;
    }

    public String getDestinationAccountNumber() {
        return destinationAccountNumber;
    }

    public String getTransferAmount() {
        return transferAmount;
    }
}

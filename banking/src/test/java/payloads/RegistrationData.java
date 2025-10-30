package payloads;

import com.github.javafaker.Faker;

import java.text.SimpleDateFormat;
import java.util.Date;

public class RegistrationData {
    private String firstName;
    private String lastName;
    private String userName;
    private String email;
    private Long phoneNumber;
    private String dob;
    private String address;
    private String password;

    private Faker faker;

    public RegistrationData() {
        faker = new Faker();

        this.firstName = faker.name().firstName();
        this.lastName = faker.name().lastName();
        this.userName = faker.name().username();
        this.email = faker.internet().emailAddress();
        this.phoneNumber = Long.valueOf(faker.number().digits(10));
        Date date = faker.date().birthday();
        this.dob = new SimpleDateFormat("yyyy-MM-dd").format(date);
        this.address = faker.address().streetAddress();
        this.password = "Pass@1234";
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getUserName() {
        return userName;
    }

    public String getEmail() {
        return email;
    }

    public Long getPhoneNumber() {
        return phoneNumber;
    }

    public String getDob() {
        return dob;
    }

    public String getAddress() {
        return address;
    }

    public String getPassword() {
        return password;
    }
}

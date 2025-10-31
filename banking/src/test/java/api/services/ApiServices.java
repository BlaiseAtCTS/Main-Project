package api.services;

import core.config.Config;
import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import payloads.LoginData;

public class ApiServices {
    public static String token = null;

    private RequestSpecification buildRequest() {
        return new RequestSpecBuilder()
                .setBaseUri(Config.apiBaseUrl())
                .setContentType(ContentType.JSON)
                .build();
    }

    private RequestSpecification buildRequest(String token) {
        if(token == null || token.isEmpty()) return this.buildRequest();
        return new RequestSpecBuilder()
                .setBaseUri(Config.apiBaseUrl())
                .addHeader("Authorization", "Bearer " + token)
                .setContentType(ContentType.JSON)
                .build();
    }

    public Response postRequest(String endpoint, String token, Object object) {
        RequestSpecification requestSpecification;
        if(token == null || token.isEmpty()) {
            requestSpecification = this.buildRequest();
            System.out.println("token is null for "+endpoint);
        } else {
            requestSpecification = this.buildRequest(token);
            System.out.println("token is not null for "+endpoint);
        }
        return RestAssured
                .given(requestSpecification)
                .body(object)
                .when()
                .post(endpoint)
                .then()
                .extract()
                .response();
    }

    public String getToken() {
        if(token == null) {
            token = new ApiServices()
                    .postRequest("/user/login", null, new LoginData())
                    .jsonPath()
                    .getString("token");
        }
        return token;
    }
}

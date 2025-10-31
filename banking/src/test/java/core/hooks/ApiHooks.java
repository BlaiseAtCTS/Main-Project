package core.hooks;

import api.services.ApiServices;
import io.cucumber.java.Before;

public class ApiHooks {
    @Before
    public void tokenInit() {
        ApiServices apiServices = new ApiServices();
        apiServices.getToken();
    }
}

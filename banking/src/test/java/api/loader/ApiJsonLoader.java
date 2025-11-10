package api.loader;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;

public class ApiJsonLoader {
    public String loadJson(String fileName) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(mapper.readTree(new File("src/test/resources/json/response/"+fileName)));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

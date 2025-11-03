package loaders;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class JSONLoader {
    public static JsonNode loadJson(String fileName) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readTree(new File("src/test/resources/json/"+fileName));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

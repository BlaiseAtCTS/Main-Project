# Swagger API Documentation Guide

## What is Swagger?

Swagger (now known as OpenAPI) is a powerful framework for designing, building, and documenting RESTful APIs. It provides a standardized way to describe your API, making it easier for developers to understand and integrate with your services.

## Why Use Swagger?

1. **Interactive Documentation**: Provides a user-friendly web interface to test APIs
2. **Code Generation**: Can generate client SDKs and server stubs
3. **API Design**: Helps design APIs before implementation
4. **Testing**: Built-in testing capabilities
5. **Team Collaboration**: Improves communication between frontend and backend teams

## Our Banking Application Swagger Setup

### Dependencies Added

We've added the following dependency to our `pom.xml`:

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.2.0</version>
</dependency>
```

### Configuration

We created `OpenApiConfig.java` to configure our Swagger documentation:

```java
@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Banking Application API")
                .description("A comprehensive banking application API")
                .version("1.0.0"))
            .servers(List.of(
                new Server().url("http://localhost:8080").description("Development Server")
            ))
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
            .components(new Components()
                .addSecuritySchemes("bearerAuth", new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")));
    }
}
```

### API Documentation Annotations

#### Controller Level Annotations

```java
@RestController
@Tag(name = "User Management", description = "APIs for user registration and authentication")
public class UserController {
    
    @Operation(summary = "Register a new user", description = "Creates a new user account")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User registered successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        // Implementation
    }
}
```

#### Model Level Annotations

```java
@Entity
@Schema(description = "User entity representing a banking system user")
public class User {
    
    @Schema(description = "Unique identifier for the user", example = "1")
    private Long id;
    
    @Schema(description = "Username for login", example = "john_doe")
    private String userName;
}
```

## Accessing Swagger UI

Once your Spring Boot application is running:

1. **Swagger UI**: Navigate to `http://localhost:8080/swagger-ui.html`
2. **OpenAPI JSON**: Available at `http://localhost:8080/v3/api-docs`

## Key Features of Our Swagger Documentation

### 1. API Groups
- **User Management**: Registration and authentication
- **Account Management**: Account operations (create, deposit, withdraw, balance)
- **Transaction Management**: Money transfers

### 2. Security Documentation
- JWT Bearer token authentication
- Security requirements clearly defined
- Protected endpoints marked appropriately

### 3. Request/Response Examples
- Detailed request body schemas
- Response code documentation
- Example values for all fields

### 4. Interactive Testing
- Test APIs directly from the browser
- Authentication support
- Real-time response viewing

## How to Use Swagger UI

### 1. Authentication
1. Click "Authorize" button
2. Enter your JWT token in format: `Bearer your-jwt-token`
3. Click "Authorize"

### 2. Testing Endpoints
1. Expand any endpoint section
2. Click "Try it out"
3. Fill in required parameters
4. Click "Execute"
5. View response in real-time

### 3. Exploring API Structure
- Browse through different API groups
- View request/response schemas
- Understand data models and relationships

## Benefits for Development

### For Backend Developers
- Clear API contract documentation
- Easy to maintain and update
- Consistent API design patterns

### For Frontend Developers
- Understanding API structure
- Testing endpoints before implementation
- Generating TypeScript interfaces

### For QA/Testing
- Comprehensive test scenarios
- API validation testing
- Performance testing endpoints

## Best Practices

### 1. Keep Documentation Updated
- Update annotations when changing APIs
- Maintain consistent versioning
- Document all error scenarios

### 2. Provide Clear Descriptions
- Use meaningful summaries and descriptions
- Include examples for complex fields
- Document business rules and constraints

### 3. Security Documentation
- Clearly mark protected endpoints
- Document authentication requirements
- Provide security examples

## Troubleshooting

### Common Issues

1. **Swagger UI not loading**
   - Check if Spring Boot application is running
   - Verify the dependency is properly added
   - Check application logs for errors

2. **Authentication not working**
   - Ensure JWT token is properly formatted
   - Check if token is valid and not expired
   - Verify security configuration

3. **CORS issues**
   - Add CORS configuration for Swagger UI
   - Check browser console for errors

## Additional Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [SpringDoc OpenAPI](https://springdoc.org/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)

## Example API Usage

### Register User
```bash
POST /user/register
Content-Type: application/json

{
  "userName": "john_doe",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login User
```bash
POST /user/login
Content-Type: application/json

{
  "userName": "john_doe",
  "password": "password123"
}
```

### Create Account (with JWT token)
```bash
POST /account/create
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "accountNumber": "ACC123456789",
  "balance": 1000.00,
  "type": "SAVINGS"
}
```

This comprehensive Swagger setup provides excellent API documentation and testing capabilities for our banking application!

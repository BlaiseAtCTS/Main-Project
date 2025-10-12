package com.site.banking.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Standard API response format")
public class ApiResponseDto {
    @Schema(description = "Indicates if the request was successful", example = "true")
    private boolean success;
    
    @Schema(description = "Response message", example = "Operation completed successfully")
    private String message;
    
    @Schema(description = "Error type if applicable", example = "Validation Error")
    private String error;
    
    @Schema(description = "Field name that caused the error", example = "userName")
    private String field;
    
    @Schema(description = "Additional data like JWT token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;

    // Constructors
    public ApiResponseDto() {}

    public ApiResponseDto(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public ApiResponseDto(boolean success, String message, String error) {
        this.success = success;
        this.message = message;
        this.error = error;
    }

    public ApiResponseDto(boolean success, String message, String error, String field) {
        this.success = success;
        this.message = message;
        this.error = error;
        this.field = field;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}

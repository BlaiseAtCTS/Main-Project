package com.site.banking.controller;

import com.site.banking.dto.UserProfileResponseDto;
import com.site.banking.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/profile")
@Tag(name = "User Profile", description = "User profile management APIs")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    @GetMapping
    @Operation(
        summary = "Get user profile",
        description = "Retrieves the profile information of the authenticated user including their accounts",
        security = { @SecurityRequirement(name = "bearer-key") }
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved user profile"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - User not authenticated"),
        @ApiResponse(responseCode = "404", description = "User profile not found")
    })
    public ResponseEntity<UserProfileResponseDto> getUserProfile(Authentication authentication) {
        UserProfileResponseDto profile = userProfileService.getUserProfile(authentication.getName());
        return ResponseEntity.ok(profile);
    }
}
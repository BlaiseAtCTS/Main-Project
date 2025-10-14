# Admin System Implementation

This document describes the implementation of the admin system with user request approval workflow for the banking application.

## Overview

The system now implements a request-based user management system where:
- Users can request account registration (instead of direct registration)
- Users can request account deletion
- All requests require admin approval
- Admins have a dedicated dashboard to manage these requests

## Backend Changes

### 1. New Models

#### UserRequest Model
- **File**: `src/main/java/com/site/banking/model/UserRequest.java`
- **Purpose**: Stores user registration and deletion requests
- **Fields**:
  - `id`: Unique identifier
  - `userName`: Username for the request
  - `password`: Password (for registration requests)
  - `firstName`, `lastName`: User details
  - `requestType`: "REGISTER" or "DELETE"
  - `status`: "PENDING", "APPROVED", "DECLINED"
  - `requestDate`: When the request was made
  - `processedDate`: When the request was processed
  - `processedBy`: Admin who processed the request

### 2. New Repository

#### UserRequestRepository
- **File**: `src/main/java/com/site/banking/repository/UserRequestRepository.java`
- **Purpose**: Data access for user requests
- **Methods**:
  - `findByRequestTypeAndStatus()`: Get requests by type and status
  - `findByStatus()`: Get all requests by status
  - `findByUserName()`: Get requests by username

### 3. New Service

#### UserRequestService
- **File**: `src/main/java/com/site/banking/service/UserRequestService.java`
- **Purpose**: Business logic for managing user requests
- **Key Methods**:
  - `createUserRequest()`: Create a new request
  - `getPendingRequests()`: Get pending requests by type
  - `updateRequestStatus()`: Approve/decline requests
  - `createUserFromRequest()`: Create user when request is approved
  - `deleteUserFromRequest()`: Delete user when deletion is approved

### 4. Updated Controllers

#### UserController Updates
- **Registration**: Now creates a request instead of direct user creation
- **New Endpoint**: `/user/request-deletion` for deletion requests
- **Validation**: Checks if user exists before creating requests

#### AdminApprovalController Updates
- **New Endpoints**:
  - `GET /api/admin/user-requests/register`: Get registration requests
  - `GET /api/admin/user-requests/delete`: Get deletion requests
  - `GET /api/admin/user-requests`: Get all pending requests
  - `PUT /api/admin/user-requests/{id}/{status}`: Approve/decline requests

### 5. Security Updates

#### SecurityConfig
- **Admin Protection**: `/api/admin/**` endpoints now require ADMIN role
- **Access Control**: Only authenticated admins can access admin endpoints

## Frontend Changes

### 1. New Admin Dashboard Component

#### AdminDashboardComponent
- **Files**:
  - `src/app/components/admin-dashboard/admin-dashboard.component.ts`
  - `src/app/components/admin-dashboard/admin-dashboard.component.html`
  - `src/app/components/admin-dashboard/admin-dashboard.component.css`
- **Features**:
  - View all pending user requests
  - Approve/decline requests
  - View account requests
  - Real-time updates
  - Responsive design

### 2. Updated Routing

#### App Routes
- **New Route**: `/admin/dashboard` for the admin dashboard
- **Updated**: Admin login now redirects to dashboard instead of approvals page

### 3. Updated Navigation

#### NavComponent
- **Admin Link**: Updated to point to new dashboard
- **Role-based Access**: Only admins see admin dashboard link

### 4. Updated Login Flow

#### LoginComponent
- **Admin Redirect**: Admins now go to `/admin/dashboard`
- **User Redirect**: Regular users go to `/dashboard`

## Admin Test Account

The system includes a test admin account:
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `ADMIN`

## API Endpoints

### User Endpoints
- `POST /user/register` - Submit registration request
- `POST /user/request-deletion` - Submit deletion request
- `POST /user/login` - User login

### Admin Endpoints
- `GET /api/admin/user-requests` - Get all pending user requests
- `GET /api/admin/user-requests/register` - Get registration requests
- `GET /api/admin/user-requests/delete` - Get deletion requests
- `PUT /api/admin/user-requests/{id}/{status}` - Approve/decline user request
- `GET /api/admin/requests/create` - Get account creation requests
- `GET /api/admin/requests/delete` - Get account deletion requests
- `PUT /api/admin/requests/{id}/{status}` - Approve/decline account request

## Workflow

### User Registration Workflow
1. User submits registration request via `/user/register`
2. Request is stored with status "PENDING"
3. Admin reviews request in dashboard
4. Admin approves/declines request
5. If approved, user account is created automatically
6. User can then login with their credentials

### User Deletion Workflow
1. User submits deletion request via `/user/request-deletion`
2. Request is stored with status "PENDING"
3. Admin reviews request in dashboard
4. Admin approves/declines request
5. If approved, user account is deleted automatically

## Security Features

1. **Role-based Access**: Admin endpoints require ADMIN role
2. **JWT Authentication**: All requests use JWT tokens
3. **Request Validation**: Input validation for all requests
4. **Audit Trail**: All admin actions are logged with admin username and timestamp

## Database Schema

The system uses the following tables:
- `users` - Existing user table
- `user_requests` - New table for user requests
- `account_requests` - Existing table for account requests

## Testing the System

1. **Start the backend**: Run the Spring Boot application
2. **Start the frontend**: Run `ng serve` in the frontend directory
3. **Test Admin Login**: Use `admin`/`admin123` to login as admin
4. **Test User Registration**: Submit a registration request
5. **Approve Request**: Use admin dashboard to approve the request
6. **Test User Login**: Login with the newly created user

## Future Enhancements

1. **Email Notifications**: Notify users when requests are approved/declined
2. **Request History**: Show all processed requests
3. **Bulk Operations**: Allow bulk approval/decline of requests
4. **Advanced Filtering**: Filter requests by date, status, etc.
5. **Audit Logs**: Detailed audit trail for all admin actions

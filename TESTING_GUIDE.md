# Admin System Testing Guide

This guide will help you test the complete admin system workflow.

## Prerequisites

1. **Backend Running**: Start the Spring Boot application on port 8080
2. **Frontend Running**: Start Angular application on port 4200
3. **Database**: Ensure database is accessible and tables are created

## Test Scenarios

### 1. Test Admin Login

1. Navigate to `http://localhost:4200/login`
2. Use admin credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. **Expected**: Should redirect to `/admin/dashboard`
4. **Verify**: Admin dashboard should be visible with navigation

### 2. Test User Registration Request

1. Navigate to `http://localhost:4200/register`
2. Fill in registration form:
   - First Name: `John`
   - Last Name: `Doe`
   - Username: `johndoe`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Submit Request"
4. **Expected**: Success message about request submission
5. **Verify**: Should redirect to login page

### 3. Test Admin Dashboard - View Requests

1. Login as admin (from step 1)
2. Navigate to admin dashboard
3. **Expected**: Should see the user registration request in the table
4. **Verify**: Request should show:
   - Username: `johndoe`
   - Name: `John Doe`
   - Request Type: `REGISTER`
   - Status: `PENDING`

### 4. Test Admin Approval

1. In admin dashboard, find the user request
2. Click "Approve" button
3. **Expected**: Request status should change to "APPROVED"
4. **Verify**: User account should be created in the system

### 5. Test User Login After Approval

1. Navigate to `http://localhost:4200/login`
2. Use the approved user credentials:
   - **Username**: `johndoe`
   - **Password**: `password123`
3. **Expected**: Should login successfully
4. **Verify**: Should redirect to `/dashboard` (not admin dashboard)

### 6. Test Regular User Navigation

1. While logged in as regular user
2. **Expected**: Should NOT see "Admin Dashboard" link in navigation
3. **Verify**: Navigation should only show: Dashboard, Accounts, Transactions, Profile

### 7. Test Admin-Only Access

1. Try to navigate to `http://localhost:4200/admin/dashboard` while logged in as regular user
2. **Expected**: Should redirect to `/dashboard`
3. **Verify**: Should not be able to access admin dashboard

## Debugging Tips

### If Admin Dashboard Shows Empty Tables

1. **Check Browser Console**: Look for HTTP errors
2. **Check Network Tab**: Verify API calls are being made
3. **Check Backend Logs**: Look for authentication errors
4. **Verify JWT Token**: Check if token is being sent in headers

### If User Registration Still Creates Direct Accounts

1. **Check Backend Logs**: Verify the registration endpoint is being called
2. **Check Database**: Look for entries in `user_requests` table vs `users` table
3. **Verify Frontend**: Check if registration form is calling correct endpoint

### If Admin Dashboard is Visible to Regular Users

1. **Check localStorage**: Verify `role` is set correctly
2. **Check Navigation Logic**: Verify `isAdmin` logic in nav component
3. **Check Route Guards**: Verify admin guard is working

## Database Verification

### Check User Requests Table
```sql
SELECT * FROM user_requests;
```

### Check Users Table
```sql
SELECT * FROM users;
```

### Check Account Requests Table
```sql
SELECT * FROM account_requests;
```

## API Endpoints to Test

### User Registration Request
```bash
curl -X POST http://localhost:8080/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "testuser",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Admin Login
```bash
curl -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "admin",
    "password": "admin123"
  }'
```

### Get User Requests (Admin Only)
```bash
curl -X GET http://localhost:8080/api/admin/user-requests \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Expected Results

1. ✅ **User Registration**: Creates request, not direct account
2. ✅ **Admin Dashboard**: Only visible to admins
3. ✅ **Request Management**: Admin can approve/decline requests
4. ✅ **User Creation**: Approved requests create user accounts
5. ✅ **Access Control**: Regular users cannot access admin features
6. ✅ **Navigation**: Role-based navigation works correctly

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check backend CORS configuration
2. **Authentication Errors**: Verify JWT token is being sent
3. **Database Errors**: Check database connection and table creation
4. **Frontend Errors**: Check browser console for JavaScript errors

### Log Files to Check

1. **Backend**: Check Spring Boot application logs
2. **Frontend**: Check browser console
3. **Database**: Check database logs for connection issues

## Success Criteria

- [ ] Admin can login and access dashboard
- [ ] User registration creates requests, not accounts
- [ ] Admin can view and approve/decline requests
- [ ] Approved requests create user accounts
- [ ] Regular users cannot access admin features
- [ ] Navigation shows appropriate links based on role
- [ ] All API endpoints work with proper authentication

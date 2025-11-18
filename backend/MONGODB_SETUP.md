# MongoDB Atlas Connection Setup Guide

## Fixing Authentication Error

The error "bad auth : authentication failed" means your MongoDB Atlas credentials are incorrect.

### Step 1: Get Your Correct Password from MongoDB Atlas

1. **Log in to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Go to Database Access**:
   - Click on "Database Access" in the left sidebar
   - Find your user: `yaswanththottempudi_db_user`
   - Click "Edit" next to the user

3. **Check or Reset Password**:
   - If you see "Show" next to the password, click it to view the password
   - If you can't see it, click "Edit" and then "Edit Password"
   - **IMPORTANT**: Copy the password exactly as shown
   - If the password contains special characters, you may need to URL-encode them

### Step 2: Update Your .env File

1. Open `backend/.env` file
2. Update the `MONGODB_URI` with the correct password:

```env
MONGODB_URI=mongodb+srv://yaswanththottempudi_db_user:YOUR_ACTUAL_PASSWORD@ai-workspace.o0vmcuv.mongodb.net/ai-workspace?retryWrites=true&w=majority&appName=AI-Workspace
```

**Replace `YOUR_ACTUAL_PASSWORD` with the actual password from MongoDB Atlas.**

### Step 3: Handle Special Characters in Password

If your password contains special characters (like `@`, `#`, `%`, `&`, etc.), you need to URL-encode them:

| Character | URL Encoded |
|-----------|-------------|
| `@` | `%40` |
| `#` | `%23` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |
| `?` | `%3F` |
| `/` | `%2F` |
| `:` | `%3A` |

**Example**: If your password is `MyP@ssw0rd#123`, it should be:
```
MONGODB_URI=mongodb+srv://yaswanththottempudi_db_user:MyP%40ssw0rd%23123@ai-workspace.o0vmcuv.mongodb.net/ai-workspace?retryWrites=true&w=majority&appName=AI-Workspace
```

### Step 4: Verify Network Access

1. **Go to Network Access** in MongoDB Atlas:
   - Click "Network Access" in the left sidebar
   - Make sure your IP address is whitelisted
   - OR add `0.0.0.0/0` (allows all IPs) for development (NOT recommended for production)

2. **Wait 1-2 minutes** after adding/updating IP whitelist for changes to propagate

### Step 5: Verify User Permissions

1. **Go to Database Access**:
   - Check that `yaswanththottempudi_db_user` has the correct permissions
   - Should have "Read and write to any database" or at least access to `ai-workspace` database

### Step 6: Test the Connection

After updating the `.env` file:

```bash
cd backend
npm run dev
```

You should see:
```
MongoDB Connected: ai-workspace-shard-00-00.o0vmcuv.mongodb.net
Database Name: ai-workspace
Mongoose connected to MongoDB

Server is running on port 5000
```

## Common Issues

### Issue 1: Password with Special Characters
**Solution**: URL-encode special characters in the password

### Issue 2: IP Not Whitelisted
**Solution**: Add your IP address to Network Access in MongoDB Atlas

### Issue 3: User Doesn't Exist
**Solution**: Create the user in Database Access with the correct username and password

### Issue 4: Database Doesn't Exist
**Solution**: MongoDB Atlas will create the database automatically on first connection, or create it manually in the Atlas UI

## Quick Fix: Reset Password

If you're unsure about the password:

1. Go to MongoDB Atlas → Database Access
2. Click "Edit" next to `yaswanththottempudi_db_user`
3. Click "Edit Password"
4. Generate a new password (click "Autogenerate Secure Password")
5. **Copy the password immediately** (you won't be able to see it again)
6. Update your `.env` file with the new password
7. Save the password securely for future use

## Alternative: Create a New Database User

If you want to create a new user:

1. Go to MongoDB Atlas → Database Access
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username (e.g., `ai-workspace-user`)
5. Enter or autogenerate password
6. Set permissions to "Read and write to any database"
7. Click "Add User"
8. Update your `.env` file with the new credentials


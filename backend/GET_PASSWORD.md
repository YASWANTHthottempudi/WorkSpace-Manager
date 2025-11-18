# How to Get Your MongoDB Atlas Password

## Step-by-Step Guide

### Step 1: Log in to MongoDB Atlas
1. Go to https://cloud.mongodb.com/
2. Log in with your MongoDB Atlas account

### Step 2: Navigate to Database Access
1. Click on **"Database Access"** in the left sidebar
2. You'll see a list of database users

### Step 3: Find Your User
1. Look for the user: `yaswanththottempudi_db_user`
2. Click on **"Edit"** (or the pencil icon) next to the user

### Step 4: Get or Reset Password

#### Option A: If You Can See the Password
1. Look for a **"Show"** button or eye icon next to the password field
2. Click it to reveal the password
3. **Copy the password immediately** (it may be hidden for security)

#### Option B: If You Can't See the Password (Reset It)
1. Click **"Edit Password"**
2. You'll see two options:
   - **"Autogenerate Secure Password"** (Recommended)
   - **"Enter Password"** (Manual)
3. Click **"Autogenerate Secure Password"**
4. **IMPORTANT**: Copy the password that appears immediately
   - This is the only time you'll see it
   - Save it securely (password manager, secure note, etc.)
5. Click **"Update User"** or **"Save"**

### Step 5: Update Your .env File

1. Open `backend/.env` file
2. Find this line:
   ```
   MONGODB_URI=mongodb+srv://yaswanththottempudi_db_user:<db_password>@ai-workspace.o0vmcuv.mongodb.net/ai-workspace?retryWrites=true&w=majority&appName=AI-Workspace
   ```

3. Replace `<db_password>` with the actual password you copied

   **Example**: If your password is `MySecurePass123!`, the line should be:
   ```
   MONGODB_URI=mongodb+srv://yaswanththottempudi_db_user:MySecurePass123!@ai-workspace.o0vmcuv.mongodb.net/ai-workspace?retryWrites=true&w=majority&appName=AI-Workspace
   ```

### Step 6: Handle Special Characters in Password

If your password contains special characters, you need to URL-encode them:

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
| `!` | `%21` |
| `*` | `%2A` |
| `(` | `%28` |
| `)` | `%29` |

**Example**: If your password is `MyP@ss#123!`, it should be:
```
MONGODB_URI=mongodb+srv://yaswanththottempudi_db_user:MyP%40ss%23123%21@ai-workspace.o0vmcuv.mongodb.net/ai-workspace?retryWrites=true&w=majority&appName=AI-Workspace
```

### Step 7: Verify Network Access

1. Go to **"Network Access"** in MongoDB Atlas (left sidebar)
2. Make sure your IP address is whitelisted, OR
3. Click **"Add IP Address"** → **"Allow Access from Anywhere"** (for development only)
   - This adds `0.0.0.0/0` which allows all IPs
   - **Warning**: Only use this for development, not production
4. Wait 1-2 minutes for changes to propagate

### Step 8: Test the Connection

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
Environment: development
Health check: http://localhost:5000/api/health
Database: connected
```

## Quick Reference

### Connection String Format
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority&appName=<app-name>
```

### Your Connection String Template
```
mongodb+srv://yaswanththottempudi_db_user:<db_password>@ai-workspace.o0vmcuv.mongodb.net/ai-workspace?retryWrites=true&w=majority&appName=AI-Workspace
```

### What to Replace
- `<db_password>` → Your actual password from MongoDB Atlas

### Connection String Parts
- `yaswanththottempudi_db_user` → Username (don't change)
- `<db_password>` → Password (replace with actual password)
- `ai-workspace.o0vmcuv.mongodb.net` → Cluster address (don't change)
- `ai-workspace` → Database name (don't change)
- `appName=AI-Workspace` → Application name (don't change)

## Troubleshooting

### Error: "bad auth : authentication failed"
- **Cause**: Incorrect password
- **Solution**: Double-check the password in MongoDB Atlas and update `.env` file

### Error: "IP not whitelisted"
- **Cause**: Your IP address is not in the Network Access list
- **Solution**: Add your IP address or allow all IPs (0.0.0.0/0) in Network Access

### Error: "getaddrinfo ENOTFOUND"
- **Cause**: Internet connection issue or incorrect cluster address
- **Solution**: Check your internet connection and verify the cluster address

### Password with Special Characters Not Working
- **Cause**: Special characters need URL encoding
- **Solution**: URL-encode special characters in the password (see Step 6)

## Security Notes

1. **Never commit `.env` file to Git** (it's already in `.gitignore`)
2. **Never share your password** publicly
3. **Use a strong password** for production
4. **Restrict IP access** in production (don't use 0.0.0.0/0)
5. **Use environment variables** in production deployments


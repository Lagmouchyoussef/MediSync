# MediSync API Debug Guide

## Quick Checklist
- [ ] Backend running on http://localhost:8001
- [ ] Frontend running on http://localhost:3000 or 3001
- [ ] Check vite.config.js proxy target matches backend port
- [ ] Check Django CORS settings include your frontend URL

## Test Login Endpoint

### Using cURL (Windows PowerShell):
```powershell
$body = @{
    email = "test@example.com"
    password = "testpass"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8001/api/login/" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

### Expected Response:
```json
{
  "message": "Login successful",
  "user": {
    "email": "test@example.com",
    "role": "patient",
    "first_name": "",
    "last_name": "",
    "image": null,
    "password_last_changed": null
  },
  "token": "abc123..."
}
```

## Common Issues

### 1. "Unexpected end of JSON input"
- Backend is returning empty response (500 error crash)
- Check Django error logs in the terminal running Django

### 2. CORS Error in Browser
- Frontend port not in CORS_ALLOWED_ORIGINS
- Update `backend/settings.py` CORS_ALLOWED_ORIGINS

### 3. 404 Not Found on /api/login/
- URL routing not configured correctly
- Check `backend/urls.py` includes `authentication.urls`

## Frontend Port Detection

The Vite config sets port 3000, but might run on 3001 if 3000 is busy.
Check browser console and update `vite.config.js` if needed:

```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8001',
      changeOrigin: true,
    },
  },
},
```

## Backend Error Logs

When Django shows an error, you'll see it in the PowerShell window running `python manage.py runserver 8001`.
Look for:
- ImportError
- NameError
- AttributeError
- etc.

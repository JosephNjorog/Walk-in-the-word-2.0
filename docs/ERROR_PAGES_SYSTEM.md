# Error Pages & Notifications Implementation

## Overview

Comprehensive error handling system with beautiful error pages and toast notifications for Walk in the Word application.

## ✅ Error Pages Implemented

### 1. Authentication Error Page
**Location**: `/auth/error`  
**URL**: `http://localhost:3000/auth/error?error=<error_code>`

**Handles**:
- `please_restart_the_process` - Session expired
- `invalid_credentials` - Wrong email/password
- `oauth_account_not_linked` - OAuth not linked
- `email_already_in_use` - Duplicate email
- `user_not_found` - User doesn't exist
- `email_not_verified` - Email needs verification
- `too_many_requests` - Rate limiting
- `account_locked` - Account security lock
- `oauth_error` - OAuth provider error
- `callback_error` - OAuth callback error
- `unknown_error` - Generic fallback

**Features**:
- ✅ Automatic toast notification on load
- ✅ Beautiful gradient background
- ✅ Icon matching error type
- ✅ Clear error description
- ✅ Error code display
- ✅ Smart retry button (redirects appropriately)
- ✅ Multiple action options
- ✅ Support link
- ✅ Contextual help messages

### 2. 404 Not Found Page
**Location**: `/not-found`  
**Triggered**: Any non-existent route

**Features**:
- ✅ Large "404" display
- ✅ Biblical verse for encouragement
- ✅ Toast notification
- ✅ Multiple navigation options
- ✅ Beautiful design matching app theme

### 3. 403 Unauthorized Page
**Location**: `/unauthorized`

**Features**:
- ✅ Clear "Access Denied" message
- ✅ Explanation of permissions
- ✅ Toast notification
- ✅ Navigation back to safe pages
- ✅ Support contact option

### 4. Global Error Handler
**Location**: `global-error.tsx`  
**Triggered**: Uncaught errors anywhere in app

**Features**:
- ✅ Catches all unhandled errors
- ✅ Error digest ID for debugging
- ✅ Reset functionality
- ✅ Toast notification
- ✅ Graceful recovery options

---

## 🎯 Error Handler Utility

**Location**: `src/lib/error-handler.ts`

### Functions Available

```typescript
// Show error with toast
showError("Error message")
showError({
  type: "auth",
  message: "Error title",
  description: "Detailed message"
})

// Show success
showSuccess("Success!", "Optional description")

// Show info
showInfo("Info message", "Details")

// Show warning
showWarning("Warning!", "Be careful")

// Handle auth errors
const error = handleAuthError("please_restart_the_process")
showError(error)

// Handle API errors
const error = handleApiError(apiError)
showError(error)

// Promise-based toast
toastPromise(
  fetchData(),
  {
    loading: "Loading...",
    success: "Data loaded!",
    error: "Failed to load"
  }
)

// Async error wrapper
const [data, error] = await handleAsync(
  fetchData(),
  "Failed to fetch data"
)

// Loading toast with update
const toastId = showLoading("Processing...")
// Later...
updateToast(toastId, "success", "Done!")
```

---

## 🎨 Design Features

### Consistent Elements
- Gradient backgrounds (red/orange for errors)
- App logo and branding
- Clear typography hierarchy
- Smooth animations
- Mobile responsive
- Beautiful cards with shadows

### Error Page Structure
1. **Header** - Logo and app name
2. **Icon** - Visual indicator of error type
3. **Title** - Clear error name
4. **Description** - Helpful explanation
5. **Error Code** - Technical detail in muted box
6. **Actions** - Primary and secondary CTAs
7. **Support Link** - Always accessible

### Toast Notifications
- Match error severity with colors
- Auto-dismiss after appropriate time
- Include descriptions for context
- Action buttons when needed
- Close button available

---

## 🔧 Configuration

### Better-Auth Integration

In `src/lib/auth.ts`:
```typescript
export const auth = betterAuth({
  // ... other config
  pages: {
    signIn: "/login",
    signUp: "/register",
    error: "/auth/error",  // Custom error page
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      sameSite: "lax",
      path: "/",
      httpOnly: true,
    },
  },
})
```

---

## 📋 Error Flow Examples

### Authentication Error Flow

1. User tries to login with OAuth
2. Session expires or error occurs
3. Better-auth redirects to `/auth/error?error=please_restart_the_process`
4. Error page loads and shows toast
5. User sees clear error message
6. User clicks "Try Again" → redirects to `/login`

### API Error Flow

```typescript
// In your component
import { handleAsync, showError } from "@/lib/error-handler"

async function saveData() {
  const [data, error] = await handleAsync(
    fetch('/api/save').then(r => r.json()),
    "Failed to save data"
  )
  
  if (error) {
    // Error already shown via toast
    return
  }
  
  // Use data
  console.log(data)
}
```

### Form Validation Error

```typescript
import { handleValidationError, showError } from "@/lib/error-handler"

function validateForm(email: string, password: string) {
  if (!email.includes('@')) {
    const error = handleValidationError("Email", "Must be a valid email")
    showError(error)
    return false
  }
  
  if (password.length < 8) {
    const error = handleValidationError("Password", "Must be at least 8 characters")
    showError(error)
    return false
  }
  
  return true
}
```

---

## 🚀 Usage Examples

### In a Component

```typescript
"use client"

import { showError, showSuccess, toastPromise } from "@/lib/error-handler"
import { toast } from "sonner"

export default function MyComponent() {
  const handleSubmit = async () => {
    // Option 1: Simple toast
    toast.loading("Saving...")
    
    try {
      await saveData()
      toast.dismiss()
      showSuccess("Data saved!", "Your changes are now live")
    } catch (error) {
      toast.dismiss()
      showError("Failed to save")
    }
    
    // Option 2: Promise-based (cleaner)
    toastPromise(
      saveData(),
      {
        loading: "Saving...",
        success: "Data saved!",
        error: "Failed to save"
      }
    )
  }
}
```

### In an API Route

```typescript
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // ... your logic
    
    return NextResponse.json({ 
      success: true,
      message: "Operation completed"
    })
  } catch (error) {
    console.error(error)
    
    return NextResponse.json(
      { 
        success: false,
        error: "Something went wrong",
        code: "INTERNAL_ERROR"
      },
      { status: 500 }
    )
  }
}
```

---

## 🎭 Error Types

### Auth Errors
- Session expired
- Invalid credentials
- OAuth issues
- Account locked
- Email not verified

### Network Errors
- Connection timeout
- No internet
- Server unreachable

### Validation Errors
- Invalid input
- Missing required fields
- Format errors

### Server Errors
- 500 Internal Server Error
- Database errors
- Third-party API failures

### Permission Errors
- 401 Unauthorized
- 403 Forbidden
- Missing permissions

---

## 🐛 Troubleshooting

### Error Page Not Showing

1. Check better-auth configuration has error page set
2. Verify route exists at `/auth/error/page.tsx`
3. Check URL parameters are being passed
4. Look for console errors

### Toast Not Appearing

1. Ensure Toaster is in root layout
2. Check if toast-styles.css is imported
3. Verify sonner is installed
4. Check browser console

### Wrong Error Message

1. Check error code mapping in auth error page
2. Verify better-auth error codes
3. Add missing error codes to errorMessages object

---

## 📱 Mobile Considerations

- All error pages are fully responsive
- Toast notifications adapt to screen size
- Touch-friendly button sizes
- Readable text at all sizes
- Proper spacing and padding

---

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly
- Sufficient color contrast
- Focus indicators

---

## 🔒 Security Considerations

- Don't expose sensitive error details
- Use generic messages for security errors
- Log detailed errors server-side only
- Prevent error-based enumeration
- Rate limit error pages if needed

---

## 📊 Testing Checklist

### Auth Error Page
- [ ] Visit `/auth/error?error=please_restart_the_process`
- [ ] Verify toast appears
- [ ] Check error message displays
- [ ] Test "Try Again" button
- [ ] Test "Back to Sign In" button
- [ ] Test support link

### 404 Page
- [ ] Visit non-existent URL
- [ ] Verify 404 page loads
- [ ] Check toast notification
- [ ] Test navigation buttons
- [ ] Verify biblical verse displays

### Global Error
- [ ] Trigger an error in development
- [ ] Verify global error boundary catches it
- [ ] Check error details display
- [ ] Test reset button

### Toast Notifications
- [ ] Test success toast
- [ ] Test error toast
- [ ] Test info toast
- [ ] Test warning toast
- [ ] Test loading toast
- [ ] Test toast with description
- [ ] Test toast with action
- [ ] Test promise-based toast

---

## 🎯 Best Practices

### DO:
- ✅ Use appropriate error types
- ✅ Provide helpful error messages
- ✅ Offer recovery actions
- ✅ Log errors for debugging
- ✅ Show empathy in messages
- ✅ Test all error scenarios

### DON'T:
- ❌ Expose technical details to users
- ❌ Use jargon in error messages
- ❌ Leave users without options
- ❌ Show raw error objects
- ❌ Ignore error logging
- ❌ Make errors scary

---

## 📚 Related Documentation

- [Toast Notification System](./EMAIL_NOTIFICATION_SYSTEM.md)
- [Better-Auth Documentation](https://better-auth.com)
- [Sonner Documentation](https://sonner.emilkowal.ski)

---

**Implementation Date**: January 8, 2026  
**Status**: ✅ Production Ready  
**Author**: GitHub Copilot (Claude Sonnet 4.5)

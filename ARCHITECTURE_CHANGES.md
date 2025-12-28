# Login Subdomain Architecture Changes

## Overview
The app has been recoded so that login and register screens live on dedicated routes (`/login` and `/register`) that function like subdomains, completely separate from the main website.

## Key Changes

### 1. App.tsx
- **Removed modal-based login system** - No more overlays or modals for authentication
- **Added route-based authentication check** - Uses `useLocation()` to detect current route
- **Conditional rendering** - When on `/login` or `/register` routes, only auth screens render
- **Main site auto-redirect** - If not authenticated and `LOGIN_ENABLED` is true, automatically redirects to `/login` using `window.location.href`
- **Analytics only on main site** - `AnalyticsModal` and other main site components only render on main routes
- **Firebase initialized once** - Single initialization at app level

### 2. Login.tsx (pages/Login.tsx)
- **Full-page route** - Renders `LoginScreen` as a standalone page
- **Authentication handlers** - Sets both `sessionStorage` and `localStorage` on success
- **Hard redirect** - Uses `window.location.href = "/"` to redirect to main site after login
- **Switch to register** - Uses `navigate("/register")` to switch between auth screens
- **Background styling** - Consistent with main site theme

### 3. Register.tsx (pages/Register.tsx)
- **Full-page route** - Renders `RegisterScreen` as a standalone page
- **Authentication handlers** - Sets both `sessionStorage` and `localStorage` on success
- **Hard redirect** - Uses `window.location.href = "/"` to redirect to main site after registration
- **Switch to login** - Uses `navigate("/login")` to switch between auth screens
- **Background styling** - Consistent with main site theme

### 4. LoginScreen.tsx (components/LoginScreen.tsx)
- **Already supports dual mode** - Accepts `onSwitchToRegister` callback prop
- **Falls back to Link** - Uses React Router Link if callback not provided
- **Kept existing styling** - No visual changes needed

### 5. RegisterScreen.tsx (components/RegisterScreen.tsx)
- **Added `onSwitchToLogin` prop** - New optional callback for switching to login
- **Dual mode support** - Uses callback if provided, otherwise falls back to Link component
- **Kept existing styling** - No visual changes needed

## Authentication Flow

### Login Flow
1. User visits main site (`/`)
2. If not authenticated and `LOGIN_ENABLED` is true → redirects to `/login`
3. User enters credentials on `/login` route
4. On success:
   - Sets `xyfen_authenticated = true` in both sessionStorage and localStorage
   - Redirects to `/` using `window.location.href`
5. Main site checks authentication and renders normally

### Register Flow
1. User navigates to `/register` or clicks "Register" on `/login`
2. User enters credentials on `/register` route
3. On success:
   - Sets `xyfen_authenticated = true` in both sessionStorage and localStorage
   - Redirects to `/` using `window.location.href`
4. Main site checks authentication and renders normally

## Key Technical Details

### Why `window.location.href` instead of `navigate()`?
Using `window.location.href` forces a full page reload, which:
- Ensures React state is completely reset
- Guarantees the authentication check runs fresh
- Prevents any stale state from persisting
- Works reliably across all browsers

### Why check both sessionStorage and localStorage?
- **sessionStorage**: Persists only during the browser session (closes when tab closes)
- **localStorage**: Persists across browser sessions
- Checking both provides flexibility and backward compatibility

### Route-based separation
The `/login` and `/register` routes are completely isolated:
- No main website components render (no Header, Footer, WarningModal, MobileBlockModal, AnalyticsModal)
- Only authentication screens are visible
- Clean, focused user experience

### LOGIN_ENABLED flag
The entire authentication system can be toggled with the `LOGIN_ENABLED` constant:
- `true`: Enforces authentication, redirects to `/login` if not authenticated
- `false`: Skips all authentication checks, main site loads directly

## Testing Checklist

- [ ] Visit `/` without authentication → should redirect to `/login`
- [ ] Login successfully → should redirect to `/` with full site access
- [ ] Visit `/login` when already authenticated → should still show login (optional: add redirect to `/` in future)
- [ ] Register successfully → should redirect to `/` with full site access
- [ ] Switch between login and register → should navigate smoothly
- [ ] Logout (when implemented) → should clear storage and redirect to `/login`
- [ ] Set `LOGIN_ENABLED = false` → should skip all auth and load main site directly
- [ ] Analytics modal should only appear on main site, not on `/login`
- [ ] Main site components (Header, Footer, etc.) should not appear on `/login` or `/register`

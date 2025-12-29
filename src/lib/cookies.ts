import Cookies from "js-cookie";

const AUTH_COOKIE_NAME = "xyfen_auth";
const COOKIES_ACCEPTED_NAME = "xyfen_cookies_accepted";
const WARNING_ACCEPTED_NAME = "xyfen_warning_accepted";

/**
 * Check if user is authenticated via cookie
 */
export const isAuthenticated = (): boolean => {
  return Cookies.get(AUTH_COOKIE_NAME) === "true";
};

/**
 * Set authentication cookie
 */
export const setAuthCookie = (value: boolean): void => {
  if (value) {
    Cookies.set(AUTH_COOKIE_NAME, "true", { expires: 7, sameSite: "strict" });
  } else {
    Cookies.remove(AUTH_COOKIE_NAME);
  }
};

/**
 * Clear authentication
 */
export const clearAuth = (): void => {
  Cookies.remove(AUTH_COOKIE_NAME);
  sessionStorage.removeItem("xyfen_authenticated");
  localStorage.removeItem("xyfen_authenticated");
};

/**
 * Check if cookies have been accepted
 */
export const areCookiesAccepted = (): boolean => {
  return Cookies.get(COOKIES_ACCEPTED_NAME) === "true";
};

/**
 * Set cookies accepted preference
 */
export const setCookiesAccepted = (accepted: boolean): void => {
  if (accepted) {
    Cookies.set(COOKIES_ACCEPTED_NAME, "true", { expires: 365, sameSite: "strict" });
  } else {
    Cookies.remove(COOKIES_ACCEPTED_NAME);
  }
};

/**
 * Check if warning has been accepted
 */
export const isWarningAccepted = (): boolean => {
  return Cookies.get(WARNING_ACCEPTED_NAME) === "true" || 
         sessionStorage.getItem("warningAccepted") === "true";
};

/**
 * Set warning accepted
 */
export const setWarningAccepted = (): void => {
  Cookies.set(WARNING_ACCEPTED_NAME, "true", { expires: 1, sameSite: "strict" });
  sessionStorage.setItem("warningAccepted", "true");
};

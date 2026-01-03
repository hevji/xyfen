export const areCookiesAccepted = (): boolean => {
  return localStorage.getItem("analytics_accepted") === "true";
};

export const acceptCookies = (): void => {
  localStorage.setItem("analytics_accepted", "true");
};

export const rejectCookies = (): void => {
  localStorage.removeItem("analytics_accepted");
};

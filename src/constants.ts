export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/v1/auth/register",
    LOGIN: "/api/v1/auth/login",
    GOOGLE_AUTH: "/api/v1/auth/google",
    GITHUB_AUTH: "/api/v1/auth/github",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    VERIFY_EMAIL: "/api/v1/auth/verify-email",
    CHECK_EXISTS: "/api/v1/auth/check-exists", // Checks if email is already taken
    LOGOUT: "/api/v1/auth/logout",
  },
  USER: {
    PROFILE: "/api/v1/user/profile",
    UPDATE_AVATAR: "/api/v1/user/avatar",
    DEVICE_LOGS: "/api/v1/user/devices",
  },
  PAYMENTS: {
    CREATE_SESSION: "/api/v1/payments/create-session", // FUTURE_IMPLEMENTATION
    SUBSCRIPTION: "/api/v1/payments/subscription", // FUTURE_IMPLEMENTATION
  },
} as const;

export const SESSION_KEY = "BITA_SESSION_TOKEN";
export const REFRESH_KEY = "BITA_REFRESH_TOKEN";

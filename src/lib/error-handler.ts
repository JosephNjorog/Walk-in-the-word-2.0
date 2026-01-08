/**
 * Error Handling Utilities
 * Centralized error handling and notification system
 */

import { toast } from "sonner";

export type ErrorType = 
  | "auth"
  | "network"
  | "validation"
  | "server"
  | "notfound"
  | "unauthorized"
  | "unknown";

export interface AppError {
  type: ErrorType;
  message: string;
  description?: string;
  code?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Show error toast notification
 */
export function showError(error: AppError | string) {
  if (typeof error === "string") {
    toast.error(error);
    return;
  }

  toast.error(error.message, {
    description: error.description,
    action: error.action,
    duration: 5000,
  });
}

/**
 * Show success toast notification
 */
export function showSuccess(message: string, description?: string) {
  toast.success(message, {
    description,
    duration: 4000,
  });
}

/**
 * Show info toast notification
 */
export function showInfo(message: string, description?: string) {
  toast.info(message, {
    description,
    duration: 4000,
  });
}

/**
 * Show warning toast notification
 */
export function showWarning(message: string, description?: string) {
  toast.warning(message, {
    description,
    duration: 4000,
  });
}

/**
 * Handle authentication errors
 */
export function handleAuthError(errorCode: string): AppError {
  const errors: Record<string, AppError> = {
    "please_restart_the_process": {
      type: "auth",
      message: "Session Expired",
      description: "Your authentication session has expired. Please try signing in again.",
      code: errorCode,
    },
    "invalid_credentials": {
      type: "auth",
      message: "Invalid Credentials",
      description: "The email or password you entered is incorrect.",
      code: errorCode,
    },
    "oauth_account_not_linked": {
      type: "auth",
      message: "Account Not Linked",
      description: "This OAuth account is not linked. Please sign up first.",
      code: errorCode,
    },
    "email_already_in_use": {
      type: "auth",
      message: "Email Already in Use",
      description: "An account with this email already exists.",
      code: errorCode,
    },
    "user_not_found": {
      type: "auth",
      message: "User Not Found",
      description: "No account found with these credentials.",
      code: errorCode,
    },
    "too_many_requests": {
      type: "auth",
      message: "Too Many Attempts",
      description: "Too many login attempts. Please try again later.",
      code: errorCode,
    },
  };

  return errors[errorCode] || {
    type: "auth",
    message: "Authentication Error",
    description: "An error occurred during authentication.",
    code: errorCode,
  };
}

/**
 * Handle API errors
 */
export function handleApiError(error: any): AppError {
  if (error.response) {
    // Server responded with error
    const status = error.response.status;
    
    if (status === 401) {
      return {
        type: "unauthorized",
        message: "Unauthorized",
        description: "Please sign in to continue.",
      };
    }
    
    if (status === 403) {
      return {
        type: "unauthorized",
        message: "Access Denied",
        description: "You don't have permission to perform this action.",
      };
    }
    
    if (status === 404) {
      return {
        type: "notfound",
        message: "Not Found",
        description: "The requested resource was not found.",
      };
    }
    
    if (status >= 500) {
      return {
        type: "server",
        message: "Server Error",
        description: "Something went wrong on our end. Please try again later.",
      };
    }
  }
  
  if (error.request) {
    // Network error
    return {
      type: "network",
      message: "Network Error",
      description: "Unable to connect to the server. Check your internet connection.",
    };
  }
  
  return {
    type: "unknown",
    message: "Something Went Wrong",
    description: error.message || "An unexpected error occurred.",
  };
}

/**
 * Handle validation errors
 */
export function handleValidationError(field: string, message: string): AppError {
  return {
    type: "validation",
    message: "Validation Error",
    description: `${field}: ${message}`,
  };
}

/**
 * Show loading toast and return toast ID for updates
 */
export function showLoading(message: string = "Loading...") {
  return toast.loading(message);
}

/**
 * Update existing toast
 */
export function updateToast(
  toastId: string | number, 
  type: "success" | "error" | "info",
  message: string,
  description?: string
) {
  if (type === "success") {
    toast.success(message, { id: toastId, description });
  } else if (type === "error") {
    toast.error(message, { id: toastId, description });
  } else {
    toast.info(message, { id: toastId, description });
  }
}

/**
 * Dismiss all toasts
 */
export function dismissAllToasts() {
  toast.dismiss();
}

/**
 * Async error handler wrapper
 */
export async function handleAsync<T>(
  promise: Promise<T>,
  errorMessage?: string
): Promise<[T | null, AppError | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    const appError = handleApiError(error);
    if (errorMessage) {
      appError.message = errorMessage;
    }
    showError(appError);
    return [null, appError];
  }
}

/**
 * Promise-based toast
 */
export function toastPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) {
  return toast.promise(promise, messages);
}

import {
  createContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { getDeviceInfo } from "../utils/deviceInfo";
import {
  registerUser,
  verifySignupOtp as verifySignupOtpApi,
  resendSignupOtp as resendSignupOtpApi,
  loginUser,
  getCurrentUser,
  forgotPassword as forgotPasswordApi,
  verifyOtp as verifyOtpApi,
  resetPassword as resetPasswordApi,
} from "../api/authApi";
import {
  updateProfile as updateProfileApi,
  changePassword as changePasswordApi,
  deleteAccount as deleteAccountApi,
} from "../api/userApi";
import {
  clearAllOfflineMemoryData,
} from "../services/offlineMemoryService";

export const AuthContext = createContext(null);

const TOKEN_KEY = "memory_ticket_auth_token";

const getAccountId = (user) => {
  const id = user?._id ?? user?.id ?? null;

  if (
    id === null ||
    id === undefined ||
    String(id).trim() === ""
  ) {
    return null;
  }

  return String(id).trim();
};

async function clearStoredSession() {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    return true;
  } catch (error) {
    console.error(
      "Failed to remove stored authentication token:",
      error,
    );

    return false;
  }
}

async function clearAccountLocalData(accountId) {
  if (!accountId) {
    return {
      success: false,
      failures: ["valid account ID"],
    };
  }

  const tasks = [
    {
      name: "authentication token",
      run: clearStoredSession,
    },
    {
      name: "offline memory data and image files",
      run: () =>
        clearAllOfflineMemoryData(accountId),
    },
  ];

  const results = await Promise.allSettled(
    tasks.map((task) => task.run()),
  );

  const failures = [];

  results.forEach((result, index) => {
    const taskName = tasks[index].name;

    if (result.status === "rejected") {
      console.error(
        `Account cleanup failed for ${taskName}:`,
        result.reason,
      );

      failures.push(taskName);
      return;
    }

    if (taskName === "authentication token") {
      if (result.value !== true) {
        failures.push(taskName);
      }

      return;
    }

    if (result.value?.success !== true) {
      failures.push(taskName);
    }
  });

  return {
    success: failures.length === 0,
    failures,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const storedToken =
          await SecureStore.getItemAsync(TOKEN_KEY);

        if (cancelled) return;

        if (!storedToken) {
          return;
        }

        const result =
          await getCurrentUser(storedToken);

        if (cancelled) return;

        if (!result?.success) {
          if (result?.status === 401) {
            const removed =
              await clearStoredSession();

            if (!removed) {
              console.error(
                "Unable to remove the invalid authentication token.",
              );
            }
          } else {
            console.warn(
              "Session restoration failed temporarily. The stored token has been preserved.",
              result?.message,
            );
          }

          return;
        }

        const restoredUser =
          result.data?.user;

        if (!restoredUser || !getAccountId(restoredUser)) {
          console.error(
            "Session restoration returned an invalid user or missing account ID.",
          );

          return;
        }

        if (cancelled) return;

        setToken(storedToken);
        setUser(restoredUser);
      } catch (error) {
        console.error(
          "Restore session error:",
          error,
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const saveSession = async (
    authToken,
    userData,
  ) => {
    if (!authToken) {
      throw new Error(
        "Authentication token is missing.",
      );
    }

    if (!userData) {
      throw new Error(
        "Authenticated user information is missing.",
      );
    }

    if (!getAccountId(userData)) {
      throw new Error(
        "Authenticated user ID is missing.",
      );
    }

    await SecureStore.setItemAsync(
      TOKEN_KEY,
      authToken,
    );

    setToken(authToken);
    setUser(userData);
  };

  const signup = async (
    name,
    email,
    password,
  ) => {
    try {
      const device = getDeviceInfo();

      const result = await registerUser(
        name,
        email,
        password,
        device,
      );

      if (!result.success) {
        return {
          success: false,
          message:
            result.message ||
            "Unable to start account creation.",
        };
      }

      return {
        success: true,
        message:
          result.data?.message ||
          "Verification OTP sent successfully.",
      };
    } catch (error) {
      console.error("Signup error:", error);

      return {
        success: false,
        message:
          "Unable to start account creation.",
      };
    }
  };

  const verifySignupOtp = async (
    email,
    otp,
  ) => {
    try {
      const result = await verifySignupOtpApi(
        email,
        otp,
      );

      if (!result.success) {
        return {
          success: false,
          message:
            result.message || "Invalid OTP.",
        };
      }

      return {
        success: true,
        message:
          result.data?.message ||
          "Account verified successfully.",
      };
    } catch (error) {
      console.error(
        "Verify signup OTP error:",
        error,
      );

      return {
        success: false,
        message:
          "Unable to verify OTP.",
      };
    }
  };

  const resendSignupOtp = async (email) => {
    try {
      const result = await resendSignupOtpApi(
        email,
      );

      if (!result.success) {
        return {
          success: false,
          message:
            result.message ||
            "Unable to resend OTP.",
        };
      }

      return {
        success: true,
        message:
          result.data?.message ||
          "OTP resent successfully.",
      };
    } catch (error) {
      console.error(
        "Resend signup OTP error:",
        error,
      );

      return {
        success: false,
        message:
          "Unable to resend OTP.",
      };
    }
  };

  const login = async (email, password) => {
    try {
      const device = getDeviceInfo();

      const result = await loginUser(
        email,
        password,
        device,
      );

      if (!result.success) {
        return {
          success: false,
          message:
            result.message || "Unable to login.",
        };
      }

      const {
        token: authToken,
        user: loggedInUser,
      } = result.data || {};

      if (!authToken || !loggedInUser) {
        return {
          success: false,
          message:
            "Invalid response from server.",
        };
      }

      if (!getAccountId(loggedInUser)) {
        return {
          success: false,
          message:
            "User account ID is missing from the server response.",
        };
      }

      await saveSession(
        authToken,
        loggedInUser,
      );

      return {
        success: true,
        user: loggedInUser,
      };
    } catch (error) {
      console.error("Login error:", error);

      return {
        success: false,
        message:
          error.message || "Unable to login.",
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const result = await forgotPasswordApi(
        email,
      );

      if (!result.success) {
        return {
          success: false,
          message:
            result.message ||
            "Unable to process password reset request.",
        };
      }

      return {
        success: true,
        message:
          result.data?.message ||
          "OTP sent successfully.",
        data: result.data,
      };
    } catch (error) {
      console.error(
        "Forgot password error:",
        error,
      );

      return {
        success: false,
        message:
          "Unable to process password reset request.",
      };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const result = await verifyOtpApi(
        email,
        otp,
      );

      if (!result.success) {
        return {
          success: false,
          message:
            result.message || "Invalid OTP.",
        };
      }

      return {
        success: true,
        message:
          result.data?.message ||
          "OTP verified successfully.",
        data: result.data,
      };
    } catch (error) {
      console.error(
        "Verify OTP error:",
        error,
      );

      return {
        success: false,
        message:
          "Unable to verify OTP.",
      };
    }
  };

  const resetPassword = async (
    email,
    resetToken,
    newPassword,
  ) => {
    try {
      const result = await resetPasswordApi(
        email,
        resetToken,
        newPassword,
      );

      if (!result.success) {
        return {
          success: false,
          message:
            result.message ||
            "Unable to reset password.",
        };
      }

      return {
        success: true,
        message:
          result.data?.message ||
          "Password reset successfully.",
        data: result.data,
      };
    } catch (error) {
      console.error(
        "Reset password error:",
        error,
      );

      return {
        success: false,
        message:
          "Unable to reset password.",
      };
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      if (!token || !user) {
        return {
          success: false,
          message:
            "No authenticated user.",
        };
      }

      const {
        name,
        profileImage,
      } = updatedData || {};

      const result = await updateProfileApi(
        token,
        {
          name,
          profileImage,
        },
      );

      if (!result.success) {
        return {
          success: false,
          message:
            result.message ||
            "Unable to update profile.",
        };
      }

      const updatedUser = result.data?.user;

      if (!updatedUser) {
        return {
          success: false,
          message:
            "Invalid response from server.",
        };
      }

      const normalizedUser = {
        ...user,
        ...updatedUser,

        _id:
          updatedUser._id ||
          user._id,

        id:
          updatedUser.id ||
          user.id,
      };

      setUser(normalizedUser);

      return {
        success: true,
        user: normalizedUser,
      };
    } catch (error) {
      console.error(
        "Update profile error:",
        error,
      );

      return {
        success: false,
        message:
          "Unable to update profile.",
      };
    }
  };

  const changePassword = async (
    currentPassword,
    newPassword,
  ) => {
    try {
      if (!token || !user) {
        return {
          success: false,
          message:
            "No authenticated user.",
        };
      }

      const result = await changePasswordApi(
        token,
        currentPassword,
        newPassword,
      );

      if (!result.success) {
        return {
          success: false,
          message:
            result.message ||
            "Unable to change password.",
        };
      }

      setToken(null);
      setUser(null);

      const tokenRemoved =
        await clearStoredSession();

      return {
        success: true,
        sessionCleanupComplete: tokenRemoved,
        message:
          result.data?.message ||
          "Password changed successfully. Please log in again.",
      };
    } catch (error) {
      console.error(
        "Change password error:",
        error,
      );

      return {
        success: false,
        message:
          "Unable to change password.",
      };
    }
  };

  const deleteAccount = async () => {
    if (!token || !user) {
      return {
        success: false,
        message:
          "No authenticated user.",
      };
    }

    const accountId = getAccountId(user);

    if (!accountId) {
      return {
        success: false,
        message:
          "Account ID is missing. Unable to safely clear account-specific offline data.",
      };
    }

    try {
      const result = await deleteAccountApi(token);

      if (!result.success) {
        return {
          success: false,
          message:
            result.message ||
            "Unable to delete account.",
        };
      }

      setToken(null);
      setUser(null);

      const cleanup =
        await clearAccountLocalData(accountId);

      if (!cleanup.success) {
        console.error(
          "Account deleted, but local cleanup was incomplete:",
          cleanup.failures,
        );

        return {
          success: true,
          localCleanupComplete: false,
          cleanupFailures: cleanup.failures,
          message:
            "Your account was deleted, but some local data could not be cleared. Do not sign in to another account on this device until local cleanup is complete.",
        };
      }

      return {
        success: true,
        localCleanupComplete: true,
        message:
          result.data?.message ||
          "Account deleted successfully.",
      };
    } catch (error) {
      console.error(
        "Delete account error:",
        error,
      );

      return {
        success: false,
        message:
          "Unable to complete the account deletion request.",
      };
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);

    const tokenRemoved =
      await clearStoredSession();

    if (!tokenRemoved) {
      return {
        success: false,
        message:
          "You have been signed out in the app, but the stored session token could not be removed.",
      };
    }

    return {
      success: true,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signup,
        verifySignupOtp,
        resendSignupOtp,
        login,
        logout,
        updateProfile,
        changePassword,
        deleteAccount,
        forgotPassword,
        verifyOtp,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

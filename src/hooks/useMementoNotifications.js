import { useCallback } from "react";
import { useAnimatedNotification } from "../context/AnimatedNotificationContext";

const NOTIFICATION_PRESETS = {
  memoryDeleted: {
    type: "success",
    title: "Memory Deleted",
    message: "Your memory has been deleted.",
  },

  collectionCreated: {
    type: "success",
    title: "Collection Created",
    message: "Your new collection is ready.",
  },

  collectionDeleted: {
    type: "success",
    title: "Collection Deleted",
    message: "The collection has been deleted.",
  },

  memoryAddedToCollection: {
    type: "success",
    title: "Memory Added",
    message: "Your memory was added to the collection.",
  },

  loggedIn: {
    type: "success",
    title: "Welcome Back!",
    message: "Your memories are waiting for you.",
  },

  loggedOut: {
    type: "success",
    title: "Logged Out",
    message: "You have safely logged out of Memento.",
  },

  accountCreated: {
    type: "success",
    title: "Account Created",
    message: "Welcome to Memento. Your journey begins here.",
  },

  passwordResetRequested: {
    type: "success",
    title: "Reset Request Submitted",
    message:
      "If an account matches this email, reset instructions will be sent.",
  },

  passwordReset: {
    type: "success",
    title: "Password Reset",
    message: "Your password has been reset successfully.",
  },

  passwordChanged: {
    type: "success",
    title: "Password Changed",
    message: "Your new password has been saved.",
  },

  accountDeleted: {
    type: "success",
    title: "Account Deleted",
    message: "Your Memento account has been deleted.",
  },

  memoryStorageCleared: {
    type: "success",
    title: "Memory Storage Cleared",
    message: "Your memory storage has been cleared.",
  },

  notificationsEnabled: {
    type: "success",
    title: "Notifications Enabled",
    message: "Memento reminders are now enabled.",
  },

  notificationsDisabled: {
    type: "info",
    title: "Notifications Disabled",
    message: "Memento reminders have been turned off.",
  },

  profileUpdated: {
    type: "success",
    title: "Profile Updated",
    message: "Your profile changes have been saved.",
  },

  collectionUpdated: {
    type: "success",
    title: "Collection Updated",
    message: "Your collection changes have been saved.",
  },

  memoryTicketUpdated: {
    type: "success",
    title: "Memory Ticket Updated",
    message: "Your ticket changes have been saved.",
  },

  memoryCreated: {
    type: "success",
    title: "Memory Saved!",
    message: "Your moment is safe.",
  },

  memoryUpdated: {
    type: "success",
    title: "Memory Updated",
    message: "Your memory changes have been saved.",
  },

  themeChanged: {
    type: "success",
    title: "Theme Updated",
    message: "Your Memento theme has been updated.",
  },

  emailVerified: {
    type: "success",
    title: "Email Verified",
    message: "Your email has been verified. You can now log in to Memento.",
  },

  signupOtpResent: {
    type: "success",
    title: "OTP Sent",
    message: "A new verification code has been sent to your email.",
  },

  signupOtpSent: {
    type: "success",
    itle: "Verification Code Sent",
    message: "Check your email for your 6-digit verification code.",
  },

  memoryRemovedFromCollection: {
    type: "success",
    title: "Memory Removed",
    message: "The memory has been removed from this collection.",
  },

  favoriteAdded: {
    type: "success",
    title: "Added to Favorites",
    message: "Your memory has been added to favorites.",
  },

  favoriteRemoved: {
    type: "info",
    title: "Removed from Favorites",
    message: "Your memory has been removed from favorites.",
  },
};

export function useMementoNotifications() {
  const { showNotification } = useAnimatedNotification();

  const notify = useCallback(
    (event, overrides = {}) => {
      const preset = NOTIFICATION_PRESETS[event];

      if (!preset) {
        console.warn(
          `Unknown Memento notification event: ${event}`
        );
        return;
      }

      showNotification({
        ...preset,
        ...overrides,
        duration: overrides.duration ?? 2800,
      });
    },
    [showNotification]
  );

  const notifyError = useCallback(
    (title, message, duration = 3500) => {
      showNotification({
        type: "error",
        title,
        message,
        duration,
      });
    },
    [showNotification]
  );

  return {
    notify,
    notifyError,
  };
}

export default useMementoNotifications;
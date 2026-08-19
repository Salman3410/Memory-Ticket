import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log("Load user error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        profileImage: null,
      };

      await AsyncStorage.setItem("user", JSON.stringify(newUser));

      setUser(newUser);

      return {
        success: true,
        user: newUser,
      };
    } catch (error) {
      console.log("Signup error:", error);

      return {
        success: false,
        message: "Unable to create account.",
      };
    }
  };

  const login = async (email, password) => {
    try {
      const storedUser = await AsyncStorage.getItem("user");

      if (!storedUser) {
        return {
          success: false,
          message: "No account found. Please sign up first.",
        };
      }

      const savedUser = JSON.parse(storedUser);

      if (
        savedUser.email !== email.trim().toLowerCase() ||
        savedUser.password !== password
      ) {
        return {
          success: false,
          message: "Invalid email or password.",
        };
      }

      setUser(savedUser);

      return {
        success: true,
        user: savedUser,
      };
    } catch (error) {
      console.log("Login error:", error);

      return {
        success: false,
        message: "Unable to login.",
      };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      if (!user) {
        return {
          success: false,
          message: "No user is currently logged in.",
        };
      }

      const updatedUser = {
        ...user,
        ...updatedData,
      };

      setUser(updatedUser);

      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      console.log("Update profile error:", error);

      return {
        success: false,
        message: "Unable to update profile.",
      };
    }
  };

   const changePassword = async (currentPassword, newPassword) => {
     try {
       if (!user) {
         return {
           success: false,
           message: "No user is currently logged in.",
         };
       }

       // Check current password
       if (user.password !== currentPassword) {
         return {
           success: false,
           message: "Current password is incorrect.",
         };
       }

       // Prevent using the same password
       if (currentPassword === newPassword) {
         return {
           success: false,
           message:
             "New password must be different from your current password.",
         };
       }

       const updatedUser = {
         ...user,
         password: newPassword,
       };

       await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

       setUser(updatedUser);

       return {
         success: true,
         user: updatedUser,
       };
     } catch (error) {
       console.log("Change password error:", error);

       return {
         success: false,
         message: "Unable to change password.",
       };
     }
   };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

import * as SecureStore from "expo-secure-store";

const AUTH_TOKEN_KEY = "memory_ticket_auth_token";

export const saveAuthToken = async (token) => {
    await SecureStore.setItemAsync(
        AUTH_TOKEN_KEY,
        token,
    )
};

export const getAuthToken = async () => {
    return await SecureStore.getItemAsync(
        AUTH_TOKEN_KEY,
    );
};

export const removeAuthToken = async () => {
    await SecureStore.deleteItemAsync(
        AUTH_TOKEN_KEY,
    )
}
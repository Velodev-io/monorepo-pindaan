import { apiClient } from "../lib/api-client";
import { User } from "@pinddaan/types";

export const UserService = {
    async getCurrentRole(): Promise<{ role: string }> {
        return apiClient("/users/me/role");
    },
    async getUsers(page = 1, limit = 10): Promise<{ data: User[], total: number }> {
        return apiClient(`/users?page=${page}&limit=${limit}`);
    },
    async updateUserRole(userId: string, targetRole: string): Promise<User> {
        return apiClient(`/users/${userId}/role`, {
            method: "PATCH",
            body: JSON.stringify({ role: targetRole }),
        });
    },
    async disableUser(userId: string): Promise<User> {
        return apiClient(`/users/${userId}/disable`, {
            method: "PATCH",
        });
    }
};

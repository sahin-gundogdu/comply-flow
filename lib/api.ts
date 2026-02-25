import { Task, User, Group, DashboardSummaryDto, Role } from "@/types";

const BASE_URL = 'http://localhost:5000/api';

function getAuthHeaders(includeContentType = false): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = {};
    if (includeContentType) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
}

export async function fetchTasks(): Promise<Task[]> {
    try {
        const response = await fetch(`${BASE_URL}/Tasks`, {
            cache: 'no-store',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch tasks: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
}

export async function fetchMyTasks(): Promise<Task[]> {
    try {
        const response = await fetch(`${BASE_URL}/Tasks/my-tasks`, {
            cache: 'no-store',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch my tasks: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching my tasks:", error);
        return [];
    }
}

export async function fetchUsers(): Promise<User[]> {
    try {
        const response = await fetch(`${BASE_URL}/users`, {
            cache: 'no-store',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function createUser(data: any): Promise<User> {
    const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Failed to create user: ${response.statusText}`);
    }

    return await response.json();
}

export async function updateUser(id: number, data: any): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ id, ...data }),
    });

    if (!response.ok) {
        throw new Error(`Failed to update user: ${response.statusText}`);
    }

    if (response.status === 204) {
        return data as User;
    }

    try {
        return await response.json();
    } catch {
        return data as User;
    }
}

export async function deleteUser(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
    }
}

export async function fetchGroups(): Promise<Group[]> {
    try {
        const response = await fetch(`${BASE_URL}/groups`, {
            cache: 'no-store',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch groups");
        return await response.json();
    } catch (error) {
        console.error("Error fetching groups:", error);
        return [];
    }
}

export async function createGroup(data: any): Promise<Group> {
    const response = await fetch(`${BASE_URL}/groups`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Failed to create group: ${response.statusText}`);
    }

    return await response.json();
}

export async function updateGroup(id: number, data: any): Promise<Group> {
    const response = await fetch(`${BASE_URL}/groups/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ id, ...data }),
    });

    if (!response.ok) {
        throw new Error(`Failed to update group: ${response.statusText}`);
    }

    if (response.status === 204) {
        return data as Group;
    }

    try {
        return await response.json();
    } catch {
        return data as Group;
    }
}

export async function deleteGroup(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/groups/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to delete group: ${response.statusText}`);
    }
}

export async function fetchRoles(): Promise<Role[]> {
    try {
        const response = await fetch(`${BASE_URL}/roles`, {
            cache: 'no-store',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch roles");
        return await response.json();
    } catch (error) {
        console.error("Error fetching roles:", error);
        return [];
    }
}

export async function createRole(data: any): Promise<Role> {
    const response = await fetch(`${BASE_URL}/roles`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Failed to create role: ${response.statusText}`);
    }

    return await response.json();
}

export async function updateRole(id: number, data: any): Promise<Role> {
    const response = await fetch(`${BASE_URL}/roles/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ id, ...data }),
    });

    if (!response.ok) {
        throw new Error(`Failed to update role: ${response.statusText}`);
    }

    if (response.status === 204) {
        return data as Role;
    }

    try {
        return await response.json();
    } catch {
        return data as Role;
    }
}

export async function deleteRole(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/roles/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to delete role: ${response.statusText}`);
    }
}

export async function createTask(data: any): Promise<Task> {
    const response = await fetch(`${BASE_URL}/Tasks`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Failed to create task: ${response.statusText}`);
    }

    return await response.json();
}

export async function updateTask(id: number, data: any): Promise<Task> {
    const response = await fetch(`${BASE_URL}/Tasks/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ id, ...data }), // Some APIs require ID in body for PUT
    });

    if (!response.ok) {
        throw new Error(`Failed to update task: ${response.statusText}`);
    }

    // Handle 204 No Content which is common for PUT
    if (response.status === 204) {
        return data as Task;
    }

    try {
        return await response.json();
    } catch {
        return data as Task;
    }
}

export async function deleteTask(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/Tasks/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.statusText}`);
    }
}

export async function updateTaskStatus(id: number, status: string): Promise<Task> {
    const response = await fetch(`${BASE_URL}/Tasks/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        throw new Error(`Failed to update task status: ${response.statusText}`);
    }

    if (response.status === 204) {
        return { id, status } as Task; 
    }

    try {
        return await response.json();
    } catch {
        return { id, status } as Task;
    }
}

export async function fetchDashboardSummary(): Promise<DashboardSummaryDto | null> {
    try {
        const response = await fetch(`${BASE_URL}/Tasks/dashboard`, {
            cache: 'no-store',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch dashboard summary: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching dashboard summary:", error);
        return null; // Handle null in UI
    }
}

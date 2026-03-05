import { Task, User, Group, DashboardSummaryDto, Role } from "@/types";

const BASE_URL = 'https://localhost:5001/api';

function getAuthHeaders(includeContentType = false): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    // Debug log to see if token exists in the browser console
    console.log("Current Token in Storage:", token ? "Token Found" : "No Token");

    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

async function apiFetch(endpoint: string, options: RequestInit = {}) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: { ...getAuthHeaders(), ...options.headers }
        });
        if (response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token'); // Clear invalid/expired token
                window.location.href = '/login'; // Hard redirect to clear React state
            }
            throw new Error("Unauthorized");
        }

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response;
    } catch (error) {
        // Catch Network Errors (API Down / Server Offline)
        if (error instanceof TypeError && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
            console.error("API Connection Lost:", error);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token'); // Clear token to stop redirect loop
                window.location.href = '/login?error=api_offline';
            }
        }
        throw error;
    }
}

export async function fetchTasks(): Promise<Task[]> {
    try {
        const response = await apiFetch(`/Tasks`, {
            cache: 'no-store',
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
}

export async function fetchTasksByUserId(userId: string | number): Promise<Task[]> {
    try {
        const response = await apiFetch(`/Tasks/user/${userId}`, {
            cache: 'no-store',
        });
        return await response.json();
    } catch (error) {
        console.error(`Error fetching tasks for user ${userId}:`, error);
        return [];
    }
}

export async function fetchMyTasks(): Promise<Task[]> {
    try {
        const response = await apiFetch(`/Tasks/my-tasks`, {
            cache: 'no-store',
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching my tasks:", error);
        return [];
    }
}

export async function fetchUsers(): Promise<User[]> {
    try {
        const response = await apiFetch(`/users`, {
            cache: 'no-store',
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function createUser(data: any): Promise<User> {
    const response = await apiFetch(`/users`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return await response.json();
}

export async function updateUser(id: number, data: any): Promise<User> {
    const response = await apiFetch(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify({ id, ...data }),
    });

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
    await apiFetch(`/users/${id}`, {
        method: "DELETE",
    });
}

export async function fetchGroups(): Promise<Group[]> {
    try {
        const response = await apiFetch(`/groups`, {
            cache: 'no-store',
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching groups:", error);
        return [];
    }
}

export async function createGroup(data: any): Promise<Group> {
    const response = await apiFetch(`/groups`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return await response.json();
}

export async function updateGroup(id: number, data: any): Promise<Group> {
    const response = await apiFetch(`/groups/${id}`, {
        method: "PUT",
        body: JSON.stringify({ id, ...data }),
    });

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
    await apiFetch(`/groups/${id}`, {
        method: "DELETE",
    });
}

export async function fetchRoles(): Promise<Role[]> {
    try {
        const response = await apiFetch(`/roles`, {
            cache: 'no-store',
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching roles:", error);
        return [];
    }
}

export async function createRole(data: any): Promise<Role> {
    const response = await apiFetch(`/roles`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return await response.json();
}

export async function updateRole(id: number, data: any): Promise<Role> {
    const response = await apiFetch(`/roles/${id}`, {
        method: "PUT",
        body: JSON.stringify({ id, ...data }),
    });

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
    await apiFetch(`/roles/${id}`, {
        method: "DELETE",
    });
}

export async function createTask(data: any): Promise<Task> {
    const response = await apiFetch(`/Tasks`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return await response.json();
}

export async function updateTask(id: number, data: any): Promise<Task> {
    const response = await apiFetch(`/Tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ id, ...data }),
    });

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
    await apiFetch(`/Tasks/${id}`, {
        method: "DELETE",
    });
}

export async function updateTaskStatus(id: number, status: string): Promise<Task> {
    const response = await apiFetch(`/Tasks/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });

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
        const response = await apiFetch(`/Tasks/dashboard`, {
            cache: 'no-store',
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching dashboard summary:", error);
        return null;
    }
}

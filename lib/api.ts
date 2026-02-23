import { Task, User, Group } from "@/types";

const BASE_URL = 'http://localhost:5000/api';

export async function fetchTasks(): Promise<Task[]> {
    try {
        const response = await fetch(`${BASE_URL}/Tasks`, {
            cache: 'no-store',
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

export async function fetchUsers(): Promise<User[]> {
    try {
        const response = await fetch(`${BASE_URL}/users`, {
            cache: 'no-store',
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function fetchGroups(): Promise<Group[]> {
    try {
        const response = await fetch(`${BASE_URL}/groups`, {
            cache: 'no-store',
        });
        if (!response.ok) throw new Error("Failed to fetch groups");
        return await response.json();
    } catch (error) {
        console.error("Error fetching groups:", error);
        return [];
    }
}

export async function createTask(data: any): Promise<Task> {
    const response = await fetch(`${BASE_URL}/Tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
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
        headers: {
            "Content-Type": "application/json",
        },
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
    });

    if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.statusText}`);
    }
}

import { Task } from "@/types";

const BASE_URL = 'https://localhost:5001/api';

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

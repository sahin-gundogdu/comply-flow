export interface User {
  id: number;
  fullName: string;
  role: string;
}

export interface Group {
  id: number;
  name: string;
}

export interface SubTask {
  id: number;
  taskId: number;
  title: string;
  description?: string;
  dueDate?: string | Date;
  isCompleted: boolean;
  assignedToUserId?: number;
  assignedToUser?: User;
  assignedToGroupId?: number;
  assignedToGroup?: Group;
  assignedToUserName?: string;
  assignedToGroupName?: string;
}

export interface CreateSubTask {
  title: string;
  description?: string;
  dueDate?: string | Date;
  assignedToUserId?: number;
  assignedToGroupId?: number;
  assignedToUserName?: string;
  assignedToGroupName?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedToUserId?: number;
  assignedToUser?: User;
  assignedToGroupId?: number;
  assignedToGroup?: Group;
  subTasks?: SubTask[];
}

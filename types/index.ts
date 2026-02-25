export interface Role {
  id: number;
  name: string;
}

export interface CreateRoleDto {
  name: string;
}

export interface UpdateRoleDto {
  name?: string;
}

export interface User {
  id: number;
  fullName: string;
  username: string;
  role: string;
}

export interface CreateUserDto {
  fullName: string;
  username: string;
  password?: string;
  role: string;
}

export interface UpdateUserDto {
  fullName?: string;
  username?: string;
  password?: string;
  role?: string;
}

export interface Group {
  id: number;
  name: string;
}

export interface CreateGroupDto {
  name: string;
}

export interface UpdateGroupDto {
  name?: string;
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

export interface DashboardSummaryDto {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  recentTasks: Task[];
}

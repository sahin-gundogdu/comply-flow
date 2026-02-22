export interface User {
  id: number;
  fullName: string;
  role: string;
}

export interface Group {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedToUserId?: number;
  assignedToUser?: User;
  assignedToGroupId?: number;
  assignedToGroup?: Group;
}

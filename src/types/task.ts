export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  groupId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

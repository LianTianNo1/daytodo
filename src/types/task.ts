export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  groupId: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

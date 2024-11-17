export interface Task {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3' | 'P4';
  completed: boolean;
  groupId: string;
  tags: string[];
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

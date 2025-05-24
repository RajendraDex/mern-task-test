
export interface User {
	_id: string;
	name: string;
	email: string;
	username: string
	role: 'admin' | 'member';
}


export interface Project {
	_id: string;
	title: string;
	description: string;
	owner: User;
	teamMembers: User[];
	createdAt: string;
	updatedAt: string;
}


export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Task {
	_id: string;
	title: string;
	description: string;
	project: Project | string;
	assignedTo: User | string;
	status: TaskStatus;
	createdAt: string;
	updatedAt: string;
}


export interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (email: string, password: string) => Promise<void>;
	register: (username: string, email: string, password: string) => Promise<void>;
	logout: () => void;
	isAuthenticated: boolean;
}


export interface ApiResponse<T> {
	status?: number;
	data?: T;
	error?: string;
	message?: string;
}


export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
	_id: string;
	title: string;
	description: string;
	project: Project | string;
	assignedTo: User | string;
	status: TaskStatus;
	priority: TaskPriority;
	dueDate?: string;
	createdAt: string;
	updatedAt: string;
}

export interface TaskFormValues {
	_id?: string;
	project?: string;
	title: string;
	description: string;
	assignedTo: string;
	status: TaskStatus;
	priority: TaskPriority;
	dueDate?: string | undefined;
}


export interface TeamMember extends User {
	role: 'admin' | 'member';
}

export interface AddTeamMemberRequest {
	projectId: string;
	userId: string;
	role: 'admin' | 'member';
}

export interface RemoveTeamMemberRequest {
	projectId: string;
	userId: string;
}



export interface DashboardStats {
	totalProjects: number;
	totalTasks: number;
	completedTasks: number;
	pendingTasks: number;
	overdueTasks: number;
	teamMembers: number;
}

export interface UserTaskStats {
	userId: string;
	name: string;
	totalTasks: number;
	completedTasks: number;
	pendingTasks: number;
}

export interface ProjectProgress {
	projectId: string;
	title: string;
	totalTasks: number;
	completedTasks: number;
	completionPercentage: number;
	pendingTasks: number;
}
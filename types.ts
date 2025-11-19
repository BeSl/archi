export enum ReleaseStatus {
  PLANNING = 'PLANNING',
  DEVELOPMENT = 'DEVELOPMENT',
  TESTING = 'TESTING',
  DEPLOYMENT = 'DEPLOYMENT',
  DONE = 'DONE'
}

export enum Priority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  CRITICAL = 'Critical'
}

export interface Developer {
  id: string;
  name: string;
  role: string;
  avatar: string;
  activeTasks: number;
  efficiency: number; // 0-100
}

export interface Repository {
  id: string;
  name: string;
  address: string; // tcp://...
  version: string;
  lastCommit: string;
  status: 'Online' | 'Offline' | 'Syncing';
  branch: string;
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string;
  status: 'To Do' | 'In Progress' | 'Code Review' | 'Done';
  priority: Priority;
  releaseId: string;
}

export interface ExternalResource {
  name: string;
  type: 'Report' | 'DataProcessor'; // epf or erf
  version: string;
}

export interface Release {
  id: string;
  projectName: string;
  version: string;
  codename: string;
  deadline: string;
  status: ReleaseStatus;
  progress: number;
  description: string;
  metadataObjects: string[];
  externalResources: ExternalResource[];
}

export interface CodeReview {
  id: string;
  authorId: string;
  reviewerId: string;
  repositoryId: string;
  objectName: string; // e.g., Document.Order
  changes: string;
  status: 'Pending' | 'Approved' | 'Changes Requested';
  timestamp: string;
}

export interface ReviewComment {
  id: string;
  authorName: string;
  text: string;
  timestamp: string;
}

export interface ExtendedCodeReview extends CodeReview {
  comments: ReviewComment[];
  staticAnalysis: {
    bugs: number;
    vulnerabilities: number;
    codeSmells: number;
    coverage: number;
    duplications: number;
  };
}
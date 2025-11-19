import { 
  MOCK_RELEASES, MOCK_TASKS, MOCK_REPOSITORIES, 
  MOCK_DEVELOPEPRS, MOCK_REVIEWS, 
  APDEX_DATA, COVERAGE_DATA, VELOCITY_DATA 
} from '../constants';
import { Release, Task, Repository, Developer, ExtendedCodeReview } from '../types';

// Toggle this to false when connecting to real Backend
const USE_MOCK_DATA = true;
const API_BASE_URL = '/api/v1';
const MOCK_DELAY = 600; // Simulate network latency

// In-memory storage for the session when using mock data
let localReleases = [...MOCK_RELEASES];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (USE_MOCK_DATA) {
    // Mock Routing Logic
    await sleep(MOCK_DELAY);
    
    if (endpoint === '/releases' && options?.method === 'POST') {
        // @ts-ignore
        const newRelease = JSON.parse(options.body as string);
        localReleases.push(newRelease);
        return newRelease as T;
    }

    switch (endpoint) {
      case '/releases': return localReleases as any;
      case '/tasks': return MOCK_TASKS as any;
      case '/repositories': return MOCK_REPOSITORIES as any;
      case '/developers': return MOCK_DEVELOPEPRS as any;
      case '/reviews': return MOCK_REVIEWS as any;
      case '/metrics/dashboard': 
        return {
          apdex: APDEX_DATA,
          coverage: COVERAGE_DATA,
          velocity: VELOCITY_DATA,
          kpi: { apdexScore: 0.94, bugs: 3, velocity: "+12%", reviewTime: "4.2 ч" }
        } as any;
      default: throw new Error('Endpoint not found');
    }
  } else {
    // Real Network Logic
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }
}

export const api = {
  releases: {
    getAll: () => request<Release[]>('/releases'),
    getTasks: () => request<Task[]>('/tasks'),
    create: (release: Release) => request<Release>('/releases', {
        method: 'POST',
        body: JSON.stringify(release)
    })
  },
  repositories: {
    getAll: () => request<Repository[]>('/repositories'),
  },
  reviews: {
    getAll: () => request<ExtendedCodeReview[]>('/reviews'),
  },
  team: {
    getAll: () => request<Developer[]>('/developers'),
  },
  dashboard: {
    getMetrics: () => request<{
      apdex: typeof APDEX_DATA;
      coverage: typeof COVERAGE_DATA;
      velocity: typeof VELOCITY_DATA;
      kpi: { apdexScore: number; bugs: number; velocity: string; reviewTime: string };
    }>('/metrics/dashboard'),
  }
};
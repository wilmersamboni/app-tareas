export type TaskStatus = 'all' | 'completed' | 'pending';

export interface RawTask {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface DummyJsonResponse {
  todos: RawTask[];
  total: number;
  skip: number;
  limit: number;
}

export type RootStackParamList = {
  Dashboard: undefined;
};
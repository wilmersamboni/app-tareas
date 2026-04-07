import { DummyJsonResponse, RawTask } from '../types';

export const fetchTodos = async (): Promise<RawTask[]> => {
  const response = await fetch('https://dummyjson.com/todos?limit=150');
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data: DummyJsonResponse = await response.json();
  return data.todos;
};
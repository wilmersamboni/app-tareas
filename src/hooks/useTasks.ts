import { useEffect, useState, useMemo, useCallback } from 'react';
import { database, Task } from '../database';
import { TaskStatus } from '../types';

export const useTasks = (filter: TaskStatus) => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [optimisticOverrides, setOptimisticOverrides] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const collection = database.get<Task>('tasks');
    const sub = collection.query().observe().subscribe({
      next: (result) => {
        setAllTasks(result);
        setIsLoading(false);
        setOptimisticOverrides({});
      },
      error: (err) => {
        console.error('DB error:', err);
        setIsLoading(false);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  const tasks = useMemo((): Task[] => {
    switch (filter) {
      case 'completed':
        return allTasks.filter((t) =>
          optimisticOverrides[t.id] !== undefined
            ? optimisticOverrides[t.id]
            : t.completed
        );
      case 'pending':
        return allTasks.filter((t) =>
          optimisticOverrides[t.id] !== undefined
            ? !optimisticOverrides[t.id]
            : !t.completed
        );
      default:
        return allTasks;
    }
  }, [allTasks, filter, optimisticOverrides]);

  const setOptimistic = useCallback((taskId: string, completed: boolean) => {
    setOptimisticOverrides((prev) => ({ ...prev, [taskId]: completed }));
  }, []);

  return { tasks, isLoading, setOptimistic };
};
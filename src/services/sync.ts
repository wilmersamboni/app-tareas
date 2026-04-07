import { database, Task } from '../database';
import { fetchTodos } from './api';

export const syncTasks = async (): Promise<void> => {
  const remoteTasks = await fetchTodos();
  const collection = database.get<Task>('tasks');
  const existingTasks = await collection.query().fetch();

  const remoteMap = new Map(remoteTasks.map((t) => [t.id, t]));
  const existingMap = new Map(existingTasks.map((t) => [t.remoteId, t]));

  await database.write(async () => {
    const batch: any[] = [];

    for (const remote of remoteTasks) {
      if (!existingMap.has(remote.id)) {
        batch.push(
          collection.prepareCreate((task: Task) => {
            task.remoteId = remote.id;
            task.title = remote.todo;
            task.completed = remote.completed;
            task.userId = remote.userId;
            task.attachmentUri = null;
          })
        );
      } else {
        const local = existingMap.get(remote.id)!;
        batch.push(local.prepareUpdate((task: Task) => {
          task.title = remote.todo;
        }));
      }
    }

    for (const local of existingTasks) {
      if (!remoteMap.has(local.remoteId)) {
        batch.push(local.prepareDestroyPermanently());
      }
    }

    await database.batch(...batch);
  });
};

export const toggleTaskCompleted = async (taskId: string): Promise<void> => {
  const task = await database.get<Task>('tasks').find(taskId);
  await database.write(async () => {
    await task.update((t: Task) => {
      t.completed = !t.completed;
    });
  });
};

export const attachPhotoToTask = async (taskId: string, uri: string): Promise<void> => {
  const task = await database.get<Task>('tasks').find(taskId);
  await database.write(async () => {
    await task.update((t: Task) => {
      t.attachmentUri = uri;
    });
  });
};
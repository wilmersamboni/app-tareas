import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'tasks',
      columns: [
        { name: 'remote_id', type: 'number' },
        { name: 'title', type: 'string' },
        { name: 'completed', type: 'boolean' },
        { name: 'user_id', type: 'number' },
        { name: 'attachment_uri', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
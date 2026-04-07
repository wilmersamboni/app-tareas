import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export class Task extends Model {
  static table = 'tasks';
  // @ts-ignore
  @field('remote_id') remoteId: number;
  // @ts-ignore
  @field('title') title: string;
  // @ts-ignore
  @field('completed') completed: boolean;
  // @ts-ignore
  @field('user_id') userId: number;
  // @ts-ignore
  @field('attachment_uri') attachmentUri: string | null;
  // @ts-ignore
  @readonly @date('created_at') createdAt: Date;
  // @ts-ignore
  @date('updated_at') updatedAt: Date;
}
import { Schema, z } from 'zod';
import { ListMessageDTO } from './list-message.dto';

export const ListMessageSchema: Schema<ListMessageDTO> = z.object({
  conversationId: z.string(),
});

import { Schema, z } from 'zod';
import { CreateMessageDTO } from './create-message.dto';

export const CreateMessageSchema: Schema<CreateMessageDTO> = z.object({
  content: z.string(),
  conversationId: z.string(),
});

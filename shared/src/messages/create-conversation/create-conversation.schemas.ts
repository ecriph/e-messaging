import { Schema, z } from 'zod';
import { createConversationDTO } from './create-conversation.dto';

export const CreateConversationSchema: Schema<createConversationDTO> = z.object(
  {
    recipientId: z.string(),
    recipientName: z.string(),
    userName: z.string(),
    userId: z.string(),
  }
);

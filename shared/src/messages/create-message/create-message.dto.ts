export class CreateMessageDTO {
  userId!: string;
  content!: string;
  conversationId!: string;
  category!: string;
}

export class CreateChatMessageDTO {
  senderId!: string;
  content!: string;
  createdAt!: Date;
  category!: string;
}

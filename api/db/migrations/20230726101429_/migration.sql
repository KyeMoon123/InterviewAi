-- DropForeignKey
ALTER TABLE "ConversationEntry" DROP CONSTRAINT "ConversationEntry_conversationId_fkey";

-- AddForeignKey
ALTER TABLE "ConversationEntry" ADD CONSTRAINT "ConversationEntry_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

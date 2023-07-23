/*
  Warnings:

  - You are about to drop the `ConversationPanel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ConversationEntry" DROP CONSTRAINT "ConversationEntry_conversationId_fkey";

-- DropTable
DROP TABLE "ConversationPanel";

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConversationEntry" ADD CONSTRAINT "ConversationEntry_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

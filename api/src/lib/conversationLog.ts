import {db} from "src/lib/db";
import {Speaker} from "types/graphql";

type ConversationLogEntry = {
  entry: string,
  createdAt: Date,
  speaker: Speaker,
}

class ConversationLog {
  constructor(
    public conversationId: string,
  ) {
    this.conversationId = conversationId
  }


  public async addEntry({ entry, speaker }: { entry: string, speaker: Speaker }) {
    try {
      await db.conversationEntry.create({
        data: {
          entry: entry,
          speaker: speaker,
          conversationId: this.conversationId
        }
      })
    } catch (e) {
      console.log(`Error adding entry: ${e}`)
    }
  }

  public async getConversation({ limit, speaker }: { limit: number, speaker? :Speaker }): Promise<string[]> {
    const conversation = await db.conversationEntry.findMany({
      where: {
        conversationId: this.conversationId,
        ...(speaker && { speaker: speaker })
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        entry: true,
        speaker: true,
        createdAt: true,
      },
      take: limit
    })

    const history = conversation as ConversationLogEntry[]

    return history.map((entry) => {
      return `${entry.speaker.toUpperCase()}: ${entry.entry}`
    }).reverse()
  }

  // public async clearConversation() {
  //   //await sequelize.query(`DELETE FROM conversations WHERE user_id = '${this.userId}'`);
  //   await db.conversation.deleteMany({
  //     where: {
  //       userId: this.userId
  //     }
  //   })
  // }
}

export { ConversationLog }

import {db} from "src/lib/db";
import {Speaker} from "types/graphql";

type ConversationLogEntry = {
  entry: string,
  createdAt: Date,
  speaker: Speaker,
}

class ConversationLog {
  constructor(
    public userId: string,
  ) {
    this.userId = userId
  }

  public async addEntry({ entry, speaker }: { entry: string, speaker: Speaker }) {
    try {
      await db.conversation.create({
        data: {
          entry: entry,
          speaker: speaker,
          userId: this.userId
        }
      })
    } catch (e) {
      console.log(`Error adding entry: ${e}`)
    }
  }

  public async getConversation({ limit }: { limit: number }): Promise<string[]> {
    const conversation = await db.conversation.findMany({
      where: {
        userId: this.userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        entry: true,
        speaker: true,
        createdAt: true,
      }
    })

    const history = conversation as ConversationLogEntry[]

    return history.map((entry) => {
      return `${entry.speaker.toUpperCase()}: ${entry.entry}`
    }).reverse()
  }

  public async clearConversation() {
    //await sequelize.query(`DELETE FROM conversations WHERE user_id = '${this.userId}'`);
    await db.conversation.deleteMany({
      where: {
        userId: this.userId
      }
    })
  }
}

export { ConversationLog }

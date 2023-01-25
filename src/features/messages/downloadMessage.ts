import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { timeDifference, verifyGJP } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    messageID: number,
    isSender: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.messageID) return -1

    if(!req.body.isSender) req.body.isSender = 0

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    const q = await query("SELECT * FROM messages WHERE messageID = ? AND (fromID = ? OR toID = ?)", [req.body.messageID, req.body.accountID, req.body.accountID])

    if(q.length == 0) return -1

    const msg = q[0]

    if(req.body.isSender == 0) {
        await query("UPDATE messages SET isRead = 1 WHERE messageID = ? LIMIT 1", [req.body.messageID])
        
        const q2 = await query("SELECT userName FROM accounts WHERE accountID = ?", [msg.fromID])
        return `1:${msg.messageID}:2:${msg.fromID}:3:${msg.fromID}:4:${msg.subject}:5:${msg.body}:6:${q2[0].userName}:7:${timeDifference(msg.timestamp)}:8:${msg.isRead}`
    } else {
        const q2 = await query("SELECT userName FROM accounts WHERE accountID = ?", [msg.fromID])
        return `1:${msg.messageID}:2:${msg.fromID}:3:${msg.fromID}:4:${msg.subject}:5:${msg.body}:6:${q2[0].userName}:7:${timeDifference(msg.timestamp)}:8:${msg.isRead}`
    }
}
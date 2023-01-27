import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { timeDifference, verifyGJP } from '../../lib/tools'
import Logger from '../../lib/logger'

type Body = {
    accountID: number,
    gjp: string,
    page: number,
    getSent: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.page) return -1

    if(!req.body.getSent) req.body.getSent = 0

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    const offset = req.body.page * 10

    if(req.body.getSent == 0) {
        const q = await query("SELECT *, messages.timestamp AS messageTimestamp FROM messages LEFT JOIN accounts ON messages.fromID = accounts.accountID WHERE toID = ? ORDER BY messages.timestamp DESC LIMIT 10 OFFSET ?", [req.body.accountID, offset])
        if(q.length == 0) {
            Logger.event_get('Messages fetched')
            return -2
        }

        let out = ''

        q.forEach((msg: any) => {
            out += `1:${msg.messageID}:2:${msg.fromID}:3:${msg.fromID}:4:${msg.subject}:6:${msg.userName}:7:${timeDifference(msg.messageTimestamp)}:8:${msg.isNew}:9:0|`
        })

        out = out.slice(0, -1)

        const count = (await query("SELECT count(*) FROM messages WHERE toID = ?", [req.body.accountID]))[0]['count(*)']

        Logger.event_get('Messages fetched')
        rep.send(`${out}#${count}:${offset}:10`)
    } else {
        const q = await query("SELECT *, messages.timestamp AS messageTimestamp FROM messages LEFT JOIN accounts ON messages.fromID = accounts.accountID WHERE fromID = ? ORDER BY messages.timestamp DESC LIMIT 10 OFFSET ?", [req.body.accountID, offset])
        if(q.length == 0) {
            Logger.event_get('Sent messages fetched')
            return -2
        }

        let out = ''

        q.forEach((msg: any) => {
            out += `1:${msg.messageID}:2:${msg.fromID}:3:${msg.fromID}:4:${msg.subject}:6:${msg.userName}:7:${timeDifference(msg.messageTimestamp)}:8:${msg.isNew}:9:0|`
        })

        out = out.slice(0, -1)

        const count = (await query("SELECT count(*) FROM messages WHERE fromID = ?", [req.body.accountID]))[0]['count(*)']
        
        Logger.event_get('Sent messages fetched')
        rep.send(`${out}#${count}:${offset}:10`)
    }
}
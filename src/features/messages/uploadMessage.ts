import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { verifyGJP, getTimestamp } from '../../lib/tools'
import Logger from '../../lib/logger'

type Body = {
    accountID: number,
    gjp: string,
    toAccountID: number,
    subject: string,
    body: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.toAccountID || !req.body.subject || !req.body.body) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    let state = await query("SELECT messageState FROM accounts WHERE accountID = ?", [req.body.accountID])
    if(state[0].messageState == 1) {
        let friends = await query("SELECT count(*) FROM friends WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)", [req.body.accountID, req.body.toAccountID, req.body.toAccountID, req.body.accountID])
        if(friends[0]['count(*)'] == 0) return -1
    } else if(state == 2) return -1

    await query("INSERT INTO messages (fromID, toID, subject, body, timestamp) VALUES (?, ?, ?, ?, ?)", [req.body.accountID, req.body.toAccountID, req.body.subject, req.body.body, getTimestamp()])

    Logger.event_create('Message uploaded')
    return 1
}
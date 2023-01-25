import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { verifyGJP, getTimestamp } from '../../lib/tools'

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

    await query("INSERT INTO messages (fromID, toID, subject, body, timestamp) VALUES (?, ?, ?, ?, ?)", [req.body.accountID, req.body.toAccountID, req.body.subject, req.body.body, getTimestamp()])

    return 1
}
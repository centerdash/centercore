import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { verifyGJP, getTimestamp } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    toAccountID: number,
    comment: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.toAccountID) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    if(!req.body.comment) req.body.comment = ''

    await query("INSERT INTO friend_reqs (fromID, toID, message, timestamp) VALUES (?, ?, ?, ?)", [req.body.accountID, req.body.toAccountID, req.body.comment, getTimestamp()])

    return 1
}
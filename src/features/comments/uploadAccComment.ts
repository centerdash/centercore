import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { verifyGJP, getTimestamp } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    comment: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.comment) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    const q = await query("INSERT INTO acc_comments (comment, accountID, timestamp) VALUES (?, ?, ?)", [req.body.comment, req.body.accountID, getTimestamp()])

    return q.insertId
}
import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { verifyGJP, getTimestamp } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    targetAccountID: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.targetAccountID) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    await query("INSERT INTO blocks (fromID, toID, timestamp) VALUES (?, ?, ?)", [req.body.accountID, req.body.targetAccountID, getTimestamp()])

    return 1
}
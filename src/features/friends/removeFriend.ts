import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { verifyGJP } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    targetAccountID: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.targetAccountID) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    await query("DELETE FROM friends WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?) LIMIT 1", [req.body.accountID, req.body.targetAccountID, req.body.targetAccountID, req.body.accountID])

    return 1
}
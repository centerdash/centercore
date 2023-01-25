import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { verifyGJP } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    targetAccountID: number,
    isSender: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.targetAccountID) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    if(!req.body.isSender) req.body.isSender = 0

    if(req.body.isSender == 1) {
        await query("DELETE FROM friend_reqs WHERE fromID = ? AND toID = ? LIMIT 1", [req.body.accountID, req.body.targetAccountID])
        return 1
    } else {
        await query("DELETE FROM friend_reqs WHERE fromID = ? AND toID = ? LIMIT 1", [req.body.targetAccountID, req.body.accountID])
        return 1
    }
}
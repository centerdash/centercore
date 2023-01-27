import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { verifyGJP } from '../../lib/tools'
import Logger from '../../lib/logger'

type Body = {
    accountID: number,
    gjp: string,
    targetAccountID: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.targetAccountID) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    await query("DELETE FROM blocks WHERE fromID = ? AND toID = ?", [req.body.accountID, req.body.targetAccountID])

    Logger.event_delete('User unblocked')
    return 1
}
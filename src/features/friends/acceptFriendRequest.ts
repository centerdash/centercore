import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { verifyGJP, getTimestamp } from '../../lib/tools'
import Logger from '../../lib/logger'

type Body = {
    accountID: number,
    gjp: string,
    targetAccountID: number,
    requestID: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.targetAccountID || !req.body.requestID) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    await query("DELETE FROM friend_reqs WHERE freqID = ? AND fromID = ? AND toID = ? LIMIT 1", [req.body.requestID, req.body.targetAccountID, req.body.accountID])
    await query("INSERT INTO friends (user1, user2, timestamp) VALUES (?, ?, ?)", [req.body.targetAccountID, req.body.accountID, getTimestamp()])

    Logger.event('Friend request accepted')
    return 1
}
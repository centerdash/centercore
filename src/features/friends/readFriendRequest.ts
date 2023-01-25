import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { verifyGJP } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    requestID: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.requestID) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    await query("UPDATE friend_reqs SET isNew = 0 WHERE freqID = ? LIMIT 1", [req.body.requestID])

    return 1
}
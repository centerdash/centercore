import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { verifyGJP } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    messageID: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.messageID) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    await query("DELETE FROM messages WHERE (fromID = ? OR toID = ?) AND messageID = ? LIMIT 1", [req.body.accountID, req.body.accountID, req.body.messageID])

    return 1
}
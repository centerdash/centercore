import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { verifyGJP } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    levelID: number,
    levelDesc: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.levelID || !req.body.levelDesc) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    const q = await query("UPDATE levels SET description = ? WHERE levelID = ? AND authorID = ?", [req.body.levelID, req.body.accountID])

    if(q.affectedRows > 0) return 1
    else return -1
}
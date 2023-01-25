import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyGJP } from '../../lib/tools'
import { query } from '../../lib/db'

type Body = {
    accountID: number,
    gjp: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    const q = await query("SELECT modType FROM accounts WHERE accountID = ?", [req.body.accountID])

    if(q[0].modType == 0) {
        rep.send(-1)
    } else if(q[0].modType == 1) {
        rep.send(1)
    } else if(q[0].modType == 2) {
        rep.send(2)
    } else {
        rep.send(-1)
    }
}
import { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../../lib/db'
import { verifyGJPOrExit } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    targetAccountID: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.targetAccountID) return rep.send(-1)

    await verifyGJPOrExit(req.body.accountID, req.body.gjp, rep)

    db.query("DELETE FROM blocks WHERE fromID = ? AND toID = ?", [req.body.accountID, req.body.targetAccountID], (err, q) => {
        rep.send(1)
    })
}
import { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../../lib/db'
import { verifyGJPOrExit } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    targetAccountID: number,
    isSender: number
}

export default function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.targetAccountID) return rep.send(-1)

    verifyGJPOrExit(req.body.accountID, req.body.gjp, rep)

    if(!req.body.isSender) req.body.isSender = 0

    if(req.body.isSender == 1) {
        db.query("DELETE FROM friend_reqs WHERE fromID = ? AND toID = ? LIMIT 1", [req.body.accountID, req.body.targetAccountID], (err, q) => {
            rep.send(1)
        })
    } else {
        db.query("DELETE FROM friend_reqs WHERE fromID = ? AND toID = ? LIMIT 1", [req.body.targetAccountID, req.body.accountID], (err, q) => {
            rep.send(1)
        })
    }
}
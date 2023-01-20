import { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../../lib/db'
import { verifyGJPOrExit, getTimestamp } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    targetAccountID: number
}

export default function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.targetAccountID) rep.send(-1)

    verifyGJPOrExit(req.body.accountID, req.body.gjp, rep)

    db.query("INSERT INTO blocks (fromID, toID, timestamp) VALUES (?, ?, ?)", [req.body.accountID, req.body.targetAccountID, getTimestamp()], (err, q) => {
        rep.send(1)
    })
}
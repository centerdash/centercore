import { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../../lib/db'
import { verifyGJPOrExit, timeDifference } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    requestID: number
}

export default function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.requestID) return rep.send(-1)

    verifyGJPOrExit(req.body.accountID, req.body.gjp, rep)

    db.query("UPDATE friend_reqs SET isNew = 0 WHERE freqID = ? LIMIT 1", [req.body.requestID], (err, q) => {
        rep.send(1)
    })
}
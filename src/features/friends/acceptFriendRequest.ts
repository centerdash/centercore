import { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../../lib/db'
import { verifyGJPOrExit, getTimestamp } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    targetAccountID: number,
    requestID: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.targetAccountID || !req.body.requestID) return rep.send(-1)

    await verifyGJPOrExit(req.body.accountID, req.body.gjp, rep)

    db.query("DELETE FROM friend_reqs WHERE freqID = ? AND fromID = ? AND toID = ? LIMIT 1", [req.body.requestID, req.body.targetAccountID, req.body.accountID], (err, q) => {
        db.query("INSERT INTO friends (user1, user2, timestamp) VALUES (?, ?, ?)", [req.body.targetAccountID, req.body.accountID, getTimestamp()], (err, q1) => {
            rep.send(1)
        })
    })
}
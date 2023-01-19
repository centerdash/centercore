import { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../../lib/db'
import { verifyGJPOrExit, getTimestamp } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    toAccountID: number,
    comment: string
}

export default function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.toAccountID) rep.send(-1)

    verifyGJPOrExit(req.body.accountID, req.body.gjp, rep)

    if(!req.body.comment) req.body.comment = ''

    db.query("INSERT INTO friend_reqs (fromID, toID, message, timestamp) VALUES (?, ?, ?, ?)", [req.body.accountID, req.body.toAccountID, req.body.comment, getTimestamp()], (err, q) => {
        rep.send(1)
    })
}
import { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../../lib/db'
import { verifyGJPOrExit, getTimestamp } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    comment: string
}

export default function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.comment) rep.send(-1)

    verifyGJPOrExit(req.body.accountID, req.body.gjp, rep)

    db.query("INSERT INTO acc_comments (comment, accountID, timestamp) VALUES (?, ?, ?)", [req.body.comment, req.body.accountID, getTimestamp()], (err, q) => {
        rep.send(q.insertId)
    })
}
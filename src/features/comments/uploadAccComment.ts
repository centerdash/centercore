import { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../../lib/db'
import { verifyGJPOrExit, getTimestamp } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    comment: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.comment) return rep.send(-1)

    await verifyGJPOrExit(req.body.accountID, req.body.gjp, rep)

    db.query("INSERT INTO acc_comments (comment, accountID, timestamp) VALUES (?, ?, ?)", [req.body.comment, req.body.accountID, getTimestamp()], (err, q) => {
        rep.send(q.insertId)
    })
}
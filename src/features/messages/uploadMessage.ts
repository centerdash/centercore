import { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../../lib/db'
import { verifyGJPOrExit, getTimestamp } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    toAccountID: number,
    subject: string,
    body: string
}

export default function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.toAccountID || !req.body.subject || !req.body.body) return rep.send(-1)

    verifyGJPOrExit(req.body.accountID, req.body.gjp, rep)

    db.query("INSERT INTO messages (fromID, toID, subject, body, timestamp) VALUES (?, ?, ?, ?, ?)", [req.body.accountID, req.body.toAccountID, req.body.subject, req.body.body, getTimestamp()], (err, q) => {
        rep.send(1)
    })
}
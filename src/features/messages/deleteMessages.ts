import { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../../lib/db'
import { verifyGJPOrExit } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    messageID: number
}

export default function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.messageID) return rep.send(-1)

    verifyGJPOrExit(req.body.accountID, req.body.gjp, rep)

    db.query("DELETE FROM messages WHERE (fromID = ? OR toID = ?) AND messageID = ? LIMIT 1", [req.body.accountID, req.body.accountID, req.body.messageID], (err, q) => {
        rep.send(1)
    })
}
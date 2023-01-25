import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyGJPOrExit } from '../../lib/tools'
import { db } from '../../lib/db'

type Body = {
    accountID: number,
    gjp: string,
    commentID: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.commentID) return rep.send(-1)

    await verifyGJPOrExit(req.body.accountID, req.body.gjp, rep)

    db.query("DELETE FROM acc_comments WHERE accCommentID = ? LIMIT 1", [req.body.commentID], (err, q) => {
        rep.send(1)
    })
}
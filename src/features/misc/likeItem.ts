import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyGJPOrExit } from '../../lib/tools'
import { db } from '../../lib/db'

type Body = {
    accountID: number,
    gjp: string,
    itemID: number,
    type: number,
    like: number
}

export default function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.itemID || !req.body.type) return rep.send(-1)

    if(!req.body.like) req.body.like = 1

    if(req.body.type == 3) {
        if(req.body.like == 1) {
            db.query("UPDATE acc_comments SET likes = likes + 1 WHERE accCommentID = ? LIMIT 1", [req.body.itemID], (err, q) => {
                rep.send(1)
            })
        } else {
            db.query("UPDATE acc_comments SET likes = likes - 1 WHERE accCommentID = ? LIMIT 1", [req.body.itemID], (err, q) => {
                rep.send(1)
            })
        }
    }
}
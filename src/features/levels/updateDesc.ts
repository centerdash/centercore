import { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../../lib/db'
import { verifyGJPOrExit } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    levelID: number,
    levelDesc: string
}

export default function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.levelID || !req.body.levelDesc) return rep.send(-1)

    verifyGJPOrExit(req.body.accountID, req.body.gjp, rep)

    db.query("UPDATE levels SET description = ? WHERE levelID = ? AND authorID = ?", [req.body.levelID, req.body.accountID], (err, q) => {
        console.log(q)
        if(q.affectedRows > 0) rep.send(1)
        else rep.send(-1)
    })
}
import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyGJPOrExit } from '../../lib/tools'
import { db } from '../../lib/db'

type Body = {
    accountID: number,
    gjp: string
}

export default function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp) rep.send(-1)

    verifyGJPOrExit(req.body.accountID, req.body.gjp, rep)

    db.query("SELECT modType FROM accounts WHERE accountID = ?", [req.body.accountID], (err, q) => {
        if(q[0].modType == 0) {
            rep.send(-1)
        } else if(q[0].modType == 1) {
            rep.send(1)
        } else if(q[0].modType == 2) {
            rep.send(2)
        } else {
            rep.send(-1)
        }
    })
}
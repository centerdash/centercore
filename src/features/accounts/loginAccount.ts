import { FastifyRequest, FastifyReply } from 'fastify'
import { compareSync } from 'bcrypt'
import { db } from '../../lib/db'

type Body = {
    userName: string,
    password: string
}

export default function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.userName || !req.body.password) return rep.send(-1)

    db.query("SELECT password, accountID FROM accounts WHERE userName = ?", [req.body.userName], (err, q) => {
        if(q.length == 0) return rep.send(-1)

        if(compareSync(req.body.password, q[0].password)) return rep.send(`${q[0].accountID},${q[0].accountID}`)
        else return rep.send(-1)
    })
}
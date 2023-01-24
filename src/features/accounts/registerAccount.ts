import { FastifyRequest, FastifyReply } from 'fastify'
import { genSaltSync, hashSync } from 'bcrypt'
import { db } from '../../lib/db'
import { getTimestamp, generateString, random } from '../../lib/tools'

type Body = {
    userName: string,
    email: string,
    password: string
}

export default function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.userName || !req.body.email || !req.body.password) return rep.send(-1)

    if(req.body.userName.length > 20) return rep.send(-4)
    if(!/^[a-zA-Z0-9]*$/g.test(req.body.userName)) return rep.send(-4)
    if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(req.body.email)) return rep.send(-5)
    
    db.query("SELECT count(*) FROM accounts WHERE userName = ?", [req.body.userName], (err, q) => {
        if(q[0]['count(*)'] > 0) return rep.send(-2)

        db.query("SELECT count(*) FROM accounts WHERE email = ?", [req.body.email], (err, q1) => {
            if(q1[0]['count(*)'] > 0) return rep.send(-3)

            const verifyCode = random(100000, 999999)
            const token = generateString(10)

            db.query("INSERT INTO accounts (userName, email, password, timestamp, verifyCode, token) VALUES (?, ?, ?, ?, ?, ?)", [req.body.userName, req.body.email, hashSync(req.body.password, genSaltSync()), getTimestamp(), verifyCode, token], (err, q2) => {
                rep.send(1)
            })
        })
    })
}
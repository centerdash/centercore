import { FastifyRequest, FastifyReply } from 'fastify'
import { genSaltSync, hashSync } from 'bcrypt'
import { query } from '../../lib/db'
import { getTimestamp, generateString, random } from '../../lib/tools'

type Body = {
    userName: string,
    email: string,
    password: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>) {
    if(!req.body.userName || !req.body.email || !req.body.password) return -1

    if(req.body.userName.length > 20) return -4
    if(!/^[a-zA-Z0-9]*$/g.test(req.body.userName)) return -4
    if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(req.body.email)) return -5
    
    const q = await query("SELECT count(*) FROM accounts WHERE userName = ?", [req.body.userName])

    if(q[0]['count(*)'] > 0) return -2

    const q1 = await query("SELECT count(*) FROM accounts WHERE email = ?", [req.body.email])

    if(q1[0]['count(*)'] > 0) return -3

    const verifyCode = random(100000, 999999)
    const token = generateString(10)

    await query("INSERT INTO accounts (userName, email, password, timestamp, verifyCode, token) VALUES (?, ?, ?, ?, ?, ?)", [req.body.userName, req.body.email, hashSync(req.body.password, genSaltSync()), getTimestamp(), verifyCode, token])
    
    return 1
}
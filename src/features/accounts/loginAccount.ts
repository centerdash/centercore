import { FastifyRequest } from 'fastify'
import { compareSync } from 'bcrypt'
import { query } from '../../lib/db'
import Logger from '../../lib/logger'

type Body = {
    userName: string,
    password: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>) {
    if(!req.body.userName || !req.body.password) return -1

    const q = await query("SELECT password, accountID FROM accounts WHERE userName = ?", [req.body.userName])

    if(q.length == 0) return -1

    if(compareSync(req.body.password, q[0].password)) {
        Logger.event('User logged in')
        return `${q[0].accountID},${q[0].accountID}`
    } else return -1
}
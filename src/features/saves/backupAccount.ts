import { FastifyRequest, FastifyReply } from 'fastify'
import { compareSync } from 'bcrypt'
import { query } from '../../lib/db'
import { writeFileSync } from 'fs'
import Logger from '../../lib/logger'

type Body = {
    userName: string,
    password: string,
    saveData: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.userName || !req.body.password || !req.body.saveData) return -1
    
    const q = await query("SELECT password, accountID FROM accounts WHERE userName = ?", [req.body.userName])

    if(q.length == 0) return -1
    if(!compareSync(req.body.password, q[0].password)) return -1

    try {
        writeFileSync(`${__dirname}/../../../data/accounts/${q[0].accountID}`, req.body.saveData)
    } catch(err) {
        console.log(err)
        return -1
    }

    Logger.event_update('Account saved')
    return 1
}
import { FastifyRequest, FastifyReply } from 'fastify'
import { compareSync } from 'bcrypt'
import { query } from '../../lib/db'
import { writeFileSync } from 'fs'
import { ungzip, gzip } from 'node-gzip'
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

    let saveDataArr = req.body.saveData.split(';')
    let saveDataBuff = Buffer.from(saveDataArr[0].replace(/-/g, '+').replace(/_/g, '/'), 'base64')

    let saveData = Buffer.from(await ungzip(saveDataBuff)).toString('ascii')

    let orbs = saveData.split('</s><k>14</k><s>')[1].split('</s>')[0]
    let levels = saveData.split('<k>GS_value</k>')[1].split('</s><k>4</k><s>')[1].split('</s>')[0]
    
    saveData = Buffer.from(await gzip(saveData)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
    saveData += ';' + saveDataArr[1]

    try {
        writeFileSync(`${__dirname}/../../../data/accounts/${q[0].accountID}`, saveData)
    } catch(err) {
        console.log(err)
        return -1
    }

    await query("UPDATE accounts SET orbs = ?, completedLevels = ? WHERE accountID = ?", [orbs, levels, q[0].accountID])

    Logger.event_update('Account saved')
    return 1
}
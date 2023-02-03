import { FastifyRequest, FastifyReply } from 'fastify'
import { getTimestamp, random, verifyGJP } from '../../lib/tools'
import { query } from '../../lib/db'
import XOR from '../../lib/XOR'
import Crypto from '../../lib/crypto'
import Logger from '../../lib/logger'

type Body = {
    accountID: string,
    gjp: string,
    chk: string,
    udid: string,
    rewardType: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.chk || !req.body.accountID || !req.body.gjp || !req.body.udid) return -1

    if(!req.body.rewardType) req.body.rewardType = '0'

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    let q = await query("SELECT chest1time, chest1count, chest2time, chest2count FROM accounts WHERE accountID = ?", [req.body.accountID])

    let xor = new XOR()
    let crypto = new Crypto()

    let chk = xor.cipher(Buffer.from(req.body.chk.substring(5), 'base64').toString('ascii'), 59182)

    let time = getTimestamp() + 100
    let chest1diff = time - q[0].chest1time
    let chest2diff = time - q[0].chest2time

    let chest1stuff = `${random(Number(process.env.DC_SMALL_MIN_ORBS), Number(process.env.DC_SMALL_MAX_ORBS))},${random(Number(process.env.DC_SMALL_MIN_DIAMONDS), Number(process.env.DC_SMALL_MAX_DIAMONDS))},${random(1, 6)},${random(Number(process.env.DC_SMALL_MIN_KEYS), Number(process.env.DC_SMALL_MAX_KEYS))}`
    let chest2stuff = `${random(Number(process.env.DC_BIG_MIN_ORBS), Number(process.env.DC_BIG_MAX_ORBS))},${random(Number(process.env.DC_BIG_MIN_DIAMONDS), Number(process.env.DC_BIG_MAX_DIAMONDS))},${random(1, 6)},${random(Number(process.env.DC_BIG_MIN_KEYS), Number(process.env.DC_BIG_MAX_KEYS))}`

    let chest1left = Number(process.env.DC_SMALL_WAIT_TIME) - chest1diff
    let chest2left = Number(process.env.DC_BIG_WAIT_TIME) - chest2diff

    if(req.body.rewardType == '1') {
        if(chest1left > 0) return -1

        await query("UPDATE accounts SET chest1count = chest1count + 1, chest1time = ? WHERE accountID = ? LIMIT 1", [time, req.body.accountID])
    } else if(req.body.rewardType == '2') {
        if(chest2left > 0) return -1

        await query("UPDATE accounts SET chest2count = chest2count + 1, chest2time = ? WHERE accountID = ? LIMIT 1", [time, req.body.accountID])
    }

    let out = Buffer.from(xor.cipher(`1:${req.body.accountID}:${chk}:${req.body.udid}:${req.body.accountID}:${process.env.DC_SMALL_WAIT_TIME}:${chest1stuff}:${q[0].chest1count + 1}:${process.env.DC_BIG_WAIT_TIME}:${chest2stuff}:${q[0].chest2count + 1}:${req.body.rewardType}`, 59182)).toString('base64')
    out = out.replace('/', '_')
    out = out.replace('+', '-')

    let hash = crypto.genSolo4(out)

    Logger.event_get('Chest rewards fetched')
    return `SaKuJ${out}|${hash}`
}
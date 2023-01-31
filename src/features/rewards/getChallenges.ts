import { FastifyRequest, FastifyReply } from 'fastify'
import { getTimestamp, verifyGJP } from '../../lib/tools'
import { query } from '../../lib/db'
import XOR from '../../lib/XOR'
import Crypto from '../../lib/crypto'
import Logger from '../../lib/logger'

type Body = {
    accountID: string,
    gjp: string,
    chk: string,
    udid: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.chk || !req.body.accountID || !req.body.gjp || !req.body.udid) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    let quests = await query("SELECT * FROM quests LIMIT 3")
    if(quests.length < 3) return -1

    let xor = new XOR()
    let crypto = new Crypto()

    let chk = xor.cipher(Buffer.from(req.body.chk.substring(5), 'base64').toString('ascii'), 19847)
    let diff = getTimestamp() - 977011200

    let questID = Math.floor(diff / 86400)
    questID = questID * 3

    let questID1 = questID
    let questID2 = questID + 1
    let questID3 = questID + 2

    let left = (getTimestamp() + (60 * 60 * 24)) - getTimestamp()

    let quest1 = `${questID1},${quests[0].type},${quests[0].amount},${quests[0].reward},${quests[0].name}`
    let quest2 = `${questID2},${quests[1].type},${quests[1].amount},${quests[1].reward},${quests[1].name}`
    let quest3 = `${questID3},${quests[2].type},${quests[2].amount},${quests[2].reward},${quests[2].name}`

    let out = Buffer.from(xor.cipher(`SaKuJ:${req.body.accountID}:${chk}:${req.body.udid}:${req.body.accountID}:${left}:${quest1}:${quest2}:${quest3}`, 19847)).toString('base64')
    let hash = crypto.genSolo3(out)

    Logger.event_get('Quests fetched')
    return `SaKuJ${out}|${hash}`
}
import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { getTimestamp } from '../../lib/tools'
import Logger from '../../lib/logger'

type Body = {
    weekly: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.weekly) req.body.weekly = '0'
    
    let time
    let q
    if(req.body.weekly == '1') {
        time = Math.floor(new Date().setDate(new Date().getDate() + (1 + 7 - new Date().getDay()) % 7) / 1000)
        q = await query("SELECT dailyID FROM daily WHERE assignTimestamp < ? AND weekly = 1 ORDER BY assignTimestamp DESC LIMIT 1", [getTimestamp()])
    } else {
        time = Math.floor(new Date().setDate(new Date().getDate() + 1) / 1000)
        q = await query("SELECT dailyID FROM daily WHERE assignTimestamp < ? AND weekly = 0 ORDER BY assignTimestamp DESC LIMIT 1", [getTimestamp()])
    }

    if(q.length == 0) return -1

    let dailyID = q[0].dailyID
    let timediff = time - getTimestamp()

    if(req.body.weekly == '1') dailyID += 100001

    Logger.event_get('Daily/weekly level fetched (getGJDailyLevel.php)')
    return `${dailyID}|${timediff}`
}
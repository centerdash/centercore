import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { getDifficulty, getTimestamp, verifyGJP } from '../../lib/tools'
import Logger from '../../lib/logger'

type Body = {
    accountID: string,
    gjp: string,
    levelID: string,
    stars: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.levelID || !req.body.gjp || !req.body.levelID || !req.body.stars) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    // TODO: move it to a command
    let q = await query("SELECT modType FROM accounts WHERE accountID = ?", [req.body.accountID])
    if(q[0].modType == 1 || q[0].modType == 2) {
        let diff = getDifficulty(Number(req.body.stars))
        
        if(req.body.stars == '10') {
            await query("UPDATE levels SET demonRate = 2, autoRate = 0, difficulty = ? WHERE levelID = ?", [diff, req.body.levelID])
        } else if(req.body.stars == '1') {
            await query("UPDATE levels SET demonRate = 0, autoRate = 1, difficulty = ? WHERE levelID = ?", [diff, req.body.levelID])
        }

        Logger.event_update('Difficulty updated')
        return -1
    } else {
        await query("INSERT INTO suggestions (fromID, levelID, stars, timestamp) VALUES (?, ?, ?, ?)", [req.body.accountID, req.body.levelID, req.body.stars, getTimestamp()])
        
        Logger.event_create('Rate suggestion created')
        return 1
    }
}
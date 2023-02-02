import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { verifyGJP } from '../../lib/tools'
import { unlinkSync } from 'fs'
import Logger from '../../lib/logger'

type Body = {
    accountID: string,
    gjp: string,
    levelID: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.levelID) return -1

    if(!/^[0-9]*$/g.test(req.body.levelID)) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    await query("DELETE FROM levels WHERE levelID = ? AND authorID = ? LIMIT 1", [req.body.levelID, req.body.accountID])
    
    try {
        unlinkSync(`${__dirname}/../../../data/levels/${req.body.levelID}`)
    } catch(err) {
        console.log(err)
        return -1
    }

    Logger.event_delete('Level deleted')
    return 1
}
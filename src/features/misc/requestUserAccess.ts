import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyGJP } from '../../lib/tools'
import { query } from '../../lib/db'
import Logger from '../../lib/logger'

type Body = {
    accountID: number,
    gjp: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    const q = await query("SELECT modType FROM accounts WHERE accountID = ?", [req.body.accountID])

    if(q[0].modType == 0) {
        Logger.event_get('Moderator access denied')
        return -1
    } else if(q[0].modType == 1) {
        Logger.event_get('Moderator access granted')
        return 1
    } else if(q[0].modType == 2) {
        Logger.event_get('Elder Moderator access granted')
        return 2
    } else {
        Logger.event_get('Moderator access denied')
        return -1
    }
}
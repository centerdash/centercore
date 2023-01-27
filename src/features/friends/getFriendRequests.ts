import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { verifyGJP, timeDifference } from '../../lib/tools'
import Logger from '../../lib/logger'

type Body = {
    accountID: number,
    gjp: string,
    getSent: number,
    page: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.page) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    if(!req.body.getSent) req.body.getSent = 0

    const offset = req.body.page * 10

    if(req.body.getSent == 0) {
        const q = await query("SELECT *, friend_reqs.timestamp AS freqTimestamp FROM friend_reqs LEFT JOIN accounts ON friend_reqs.fromID = accounts.accountID WHERE toID = ? LIMIT 10 OFFSET ?", [req.body.accountID, offset])
        if(q.length == 0) return -2
        
        let out = ''

        q.forEach((freq: any) => {
            out += `1:${freq.userName}:2:${freq.accountID}:9:${freq.icon}:10:${freq.color1}:11:${freq.color2}:14:${freq.iconType}:15:${freq.glow}:16:${freq.accountID}:32:${freq.freqID}:35:${freq.message}:37:${timeDifference(freq.freqTimestamp)}:41:${freq.isNew}|`
        })

        out = out.slice(0, -1)
        
        const count = (await query("SELECT count(*) FROM friend_reqs WHERE toID = ?", [req.body.accountID]))[0]['count(*)']
        return `${out}#${count}:${offset}:10`
    } else {
        const q = await query("SELECT * FROM friend_reqs LEFT JOIN accounts ON friend_reqs.toID = accounts.accountID WHERE fromID = ? LIMIT 10 OFFSET ?", [req.body.accountID, offset])
        if(q.length == 0) return -2
        
        let out = ''

        q.forEach((freq: any) => {
            out += `1:${freq.userName}:2:${freq.accountID}:9:${freq.icon}:10:${freq.color1}:11:${freq.color2}:14:${freq.iconType}:15:${freq.glow}:16:${freq.accountID}:32:${freq.freqID}:35:${freq.message}:37:${timeDifference(freq.timestamp)}:41:${freq.isNew}|`
        })

        out = out.slice(0, -1)
        
        const count = (await query("SELECT count(*) FROM friend_reqs WHERE fromID = ?", [req.body.accountID]))[0]['count(*)']

        Logger.event_get('Friend requests fetched')
        return `${out}#${count}:${offset}:10`
    }
}
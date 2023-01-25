import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyGJP } from '../../lib/tools'
import { query } from '../../lib/db'

type Body = {
    accountID: number,
    gjp: string,
    mS: number,
    frS: number,
    cS: number,
    yt: string,
    twitter: string,
    twitch: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp) return -1

    if(!/^[a-zA-Z0-9_-]*$/g.test(req.body.yt) || !/^[a-zA-Z0-9_-]*$/g.test(req.body.twitch) || !/^[a-zA-Z0-9_-]*$/g.test(req.body.twitter)) {
        return -1
    }

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    await query("UPDATE accounts SET messageState = ?, friendsState = ?, commentHistoryState = ?, youtube = ?, twitch = ?, twitter = ? WHERE accountID = ?", [req.body.mS ? req.body.mS : 0, req.body.frS ? req.body.frS : 0, req.body.cS ? req.body.cS : 0, req.body.yt ? req.body.yt : null, req.body.twitter ? req.body.twitter : null, req.body.twitch ? req.body.twitch : null, req.body.accountID])

    return 1
}
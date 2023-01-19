import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyGJPOrExit } from '../../lib/tools'
import { db } from '../../lib/db'

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

export default function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp) rep.send(-1)

    verifyGJPOrExit(req.body.accountID, req.body.gjp, rep)

    db.query("UPDATE accounts SET messageState = ?, friendsState = ?, commentHistoryState = ?, youtube = ?, twitch = ?, twitter = ? WHERE accountID = ?", [req.body.mS ? req.body.mS : 0, req.body.frS ? req.body.frS : 0, req.body.cS ? req.body.cS : 0, req.body.yt ? req.body.yt : null, req.body.twitter ? req.body.twitter : null, req.body.twitch ? req.body.twitch : null, req.body.accountID], (err, q) => {
        rep.send(1)
    })
}
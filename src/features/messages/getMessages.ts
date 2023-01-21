import { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../../lib/db'
import { encodeMessage, timeDifference, verifyGJPOrExit } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    page: number,
    getSent: number
}

export default function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.page) rep.send(-1)

    if(!req.body.getSent) req.body.getSent = 0

    verifyGJPOrExit(req.body.accountID, req.body.gjp, rep)

    const offset = req.body.page * 10

    if(req.body.getSent == 0) {
        db.query("SELECT *, messages.timestamp AS messageTimestamp FROM messages LEFT JOIN accounts ON messages.fromID = accounts.accountID WHERE toID = ? LIMIT 10 OFFSET ?", [req.body.accountID, offset], (err, q) => {
            if(q.length == 0) {
                rep.send(-2)
                return
            }

            let out = ''

            q.forEach((msg: any) => {
                out += `1:${msg.messageID}:2:${msg.fromID}:3:${msg.fromID}:4:${msg.subject}:5:${encodeMessage(Buffer.from(msg.body, 'base64').toString('ascii'))}:6:${msg.userName}:7:${timeDifference(msg.messageTimestamp)}:8:${msg.isNew}:9:0|`
            })

            out = out.slice(0, -1)

            db.query("SELECT count(*) FROM messages WHERE toID = ?", [req.body.accountID], (err, q1) => {
                rep.send(`${out}#${q1[0]['count(*)']}:${offset}:10`)
            })
        })
    } else {

    }
}
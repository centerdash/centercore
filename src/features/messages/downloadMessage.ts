import { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../../lib/db'
import { timeDifference, verifyGJPOrExit } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    messageID: number,
    isSender: number
}

export default function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.messageID) rep.send(-1)

    if(!req.body.isSender) req.body.isSender = 0

    verifyGJPOrExit(req.body.accountID, req.body.gjp, rep)

    db.query("SELECT * FROM messages WHERE messageID = ? AND (fromID = ? OR toID = ?)", [req.body.messageID, req.body.accountID, req.body.accountID], (err, q) => {
        if(q.length == 0) {
            rep.send(-1)
            return
        }

        const msg = q[0]

        if(req.body.isSender == 0) {
            db.query("UPDATE messages SET isRead = 1 WHERE messageID = ? LIMIT 1", [req.body.messageID], (err, q1) => {
                db.query("SELECT userName FROM accounts WHERE accountID = ?", [msg.fromID], (err, q2) => {
                    rep.send(`1:${msg.messageID}:2:${msg.fromID}:3:${msg.fromID}:4:${msg.subject}:5:${msg.body}:6:${q2[0].userName}:7:${timeDifference(msg.timestamp)}:8:${msg.isRead}`)
                })
            })
        } else {
            db.query("SELECT userName FROM accounts WHERE accountID = ?", [msg.fromID], (err, q2) => {
                rep.send(`1:${msg.messageID}:2:${msg.fromID}:3:${msg.fromID}:4:${msg.subject}:5:${msg.body}:6:${q2[0].userName}:7:${timeDifference(msg.timestamp)}:8:${msg.isRead}`)
            })
        }
    })
}
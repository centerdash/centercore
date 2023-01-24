import { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../../lib/db'
import { verifyGJPOrExit } from '../../lib/tools'

type Body = {
    targetAccountID: number,
    accountID: number,
    gjp: string
}

export default function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.targetAccountID) return rep.send(-1)

    if(req.body.accountID && req.body.gjp) {
        verifyGJPOrExit(req.body.accountID, req.body.gjp, rep)
    }

    db.query("SELECT count(*) FROM blocks WHERE fromID = ? AND toID = ?", [req.body.accountID, req.body.targetAccountID], (err, q8) => {
        if(q8[0]['count(*)'] > 0) {
            rep.send(-1)
            return
        }

        db.query("SELECT * FROM accounts WHERE accountID = ?", [req.body.targetAccountID], (err, q) => {
            if(q.length == 0) {
                rep.send(-1)
                return
            }
    
            const user = q[0]
            
            db.query("SELECT count(*) FROM accounts WHERE stars > ? AND stars > 0", [user.stars], (err, q1) => {
                const rank = q1[0]['count(*)'] + 1

                db.query("SELECT count(*) FROM accounts WHERE stars > ?", [user.stars], (err, q2) => {
                    const globalRank = q2[0]['count(*)'] + 1

                    if(req.body.accountID && req.body.gjp && req.body.accountID == req.body.targetAccountID) {
                        db.query("SELECT * FROM friend_reqs CROSS JOIN friends WHERE ((friend_reqs.fromID = ? OR friend_reqs.toID = ?) OR (friend_reqs.fromID = ? OR friend_reqs.toID = ?)) OR ((friends.user1 = ? OR friends.user2 = ?) OR (friends.user1 = ? OR friends.user2 = ?))", [user.accountID, req.body.targetAccountID, req.body.targetAccountID, user.accountID, user.accountID, req.body.targetAccountID, req.body.targetAccountID, user.accountID], (err, q4) => {
                            let friendstate = 0
                            
                            db.query("SELECT count(*) FROM friend_reqs WHERE fromID = ? AND toID = ?", [req.body.targetAccountID, req.body.accountID], (err, q5) => {
                                if(q5[0]['count(*)'] > 0) {
                                    friendstate = 3
                                }
    
                                db.query("SELECT count(*) FROM friend_reqs WHERE fromID = ? AND toID = ?", [req.body.accountID, req.body.targetAccountID], (err, q6) => {
                                    if(q6[0]['count(*)'] > 0) {
                                        friendstate = 4
                                    }
    
                                    db.query("SELECT count(*) FROM friends WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)", [req.body.accountID, req.body.targetAccountID, req.body.accountID, req.body.targetAccountID], (err, q7) => {
                                        if(q7[0]['count(*)'] > 0) {
                                            friendstate = 1
                                        }

                                        db.query("SELECT count(*) FROM friend_reqs WHERE toID = ? AND isNew = 1", [req.body.accountID], (err, q8) => {
                                            const freqs = q8[0]['count(*)']

                                            rep.send(`1:${user.userName}:2:${user.accountID}:3:${user.stars}:4:${user.demons}:6:${rank}:7:${user.accountID}:8:${user.cps}:9:${user.icon}:10:${user.color1}:11:${user.color2}:13:${user.coins}:14:${user.iconType}:15:${user.special}:16:${user.accountID}:17:${user.silverCoins}:18:${user.messageState}:19:${user.friendsState}:20:${user.youtube}:21:${user.cube}:22:${user.ship}:23:${user.ball}:24:${user.ufo}:25:${user.wave}:26:${user.robot}:28:${user.glow}:29:1:30:${globalRank}:31:${friendstate}:39:${freqs}:43:${user.spider}:44:${user.twitter}:45:${user.twitch}:46:${user.diamonds}:48:${user.explosion}:49:${user.modType}:50:${user.commentHistoryState}`)
                                        })
                                    })
                                })
                            })
                        })
                    } else {
                        rep.send(`1:${user.userName}:2:${user.accountID}:3:${user.stars}:4:${user.demons}:6:${rank}:7:${user.accountID}:8:${user.cps}:9:${user.icon}:10:${user.color1}:11:${user.color2}:13:${user.coins}:14:${user.iconType}:15:${user.special}:16:${user.accountID}:17:${user.silverCoins}:18:${user.messageState}:19:${user.friendsState}:20:${user.youtube}:21:${user.cube}:22:${user.ship}:23:${user.ball}:24:${user.ufo}:25:${user.wave}:26:${user.robot}:28:${user.glow}:29:1:30:${globalRank}:43:${user.spider}:44:${user.twitter}:45:${user.twitch}:46:${user.diamonds}:48:${user.explosion}:49:${user.modType}:50:${user.commentHistoryState}`)
                    }
                })
            })
        })
    })
}
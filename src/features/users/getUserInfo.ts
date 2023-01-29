import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { verifyGJP } from '../../lib/tools'
import Logger from '../../lib/logger'

type Body = {
    targetAccountID: number,
    accountID: number,
    gjp: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.targetAccountID) return -1

    if(req.body.accountID && req.body.gjp) {
        if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1
    }

    const q8 = await query("SELECT count(*) FROM blocks WHERE fromID = ? AND toID = ?", [req.body.accountID, req.body.targetAccountID])

    if(q8[0]['count(*)'] > 0) return -1

    const q = await query("SELECT * FROM accounts WHERE accountID = ?", [req.body.targetAccountID])

    if(q.length == 0) return -1

    const user = q[0]
    
    const q1 = await query("SELECT count(*) FROM accounts WHERE stars > ? AND stars > 10", [user.stars])

    const rank = q1[0]['count(*)'] + 1

    const q2 = await query("SELECT count(*) FROM accounts WHERE stars > ?", [user.stars])

    const globalRank = q2[0]['count(*)'] + 1

    const q3 = await query("SELECT count(*) FROM messages WHERE toID = ?", [req.body.accountID])
    const messages = q3[0]['count(*)']

    if(req.body.accountID && req.body.gjp && req.body.accountID == req.body.targetAccountID) {
        let friendstate = 0
        
        const q5 = await query("SELECT count(*) FROM friend_reqs WHERE fromID = ? AND toID = ?", [req.body.targetAccountID, req.body.accountID])
        if(q5[0]['count(*)'] > 0) friendstate = 3

        const q6 = await query("SELECT count(*) FROM friend_reqs WHERE fromID = ? AND toID = ?", [req.body.accountID, req.body.targetAccountID])
        if(q6[0]['count(*)'] > 0) friendstate = 4

        const q7 = await query("SELECT count(*) FROM friends WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)", [req.body.accountID, req.body.targetAccountID, req.body.accountID, req.body.targetAccountID])
        if(q7[0]['count(*)'] > 0) friendstate = 1

        const q8 = await query("SELECT count(*) FROM friend_reqs WHERE toID = ? AND isNew = 1", [req.body.accountID])
        const freqs = q8[0]['count(*)']
        
        Logger.event_get('User info fetched')
        return `1:${user.userName}:2:${user.accountID}:3:${user.stars}:4:${user.demons}:6:${rank}:7:${user.accountID}:8:${user.cps}:9:${user.icon}:10:${user.color1}:11:${user.color2}:13:${user.coins}:14:${user.iconType}:15:${user.special}:16:${user.accountID}:17:${user.silverCoins}:18:${user.messageState}:19:${user.friendsState}:20:${user.youtube}:21:${user.cube}:22:${user.ship}:23:${user.ball}:24:${user.ufo}:25:${user.wave}:26:${user.robot}:28:${user.glow}:29:1:30:${globalRank}:31:${friendstate}:38:${messages}:39:${freqs}:43:${user.spider}:44:${user.twitter}:45:${user.twitch}:46:${user.diamonds}:48:${user.explosion}:49:${user.modType}:50:${user.commentHistoryState}`
    } else {
        Logger.event_get('User info fetched')
        return `1:${user.userName}:2:${user.accountID}:3:${user.stars}:4:${user.demons}:6:${rank}:7:${user.accountID}:8:${user.cps}:9:${user.icon}:10:${user.color1}:11:${user.color2}:13:${user.coins}:14:${user.iconType}:15:${user.special}:16:${user.accountID}:17:${user.silverCoins}:18:${user.messageState}:19:${user.friendsState}:20:${user.youtube}:21:${user.cube}:22:${user.ship}:23:${user.ball}:24:${user.ufo}:25:${user.wave}:26:${user.robot}:28:${user.glow}:29:1:30:${globalRank}:43:${user.spider}:44:${user.twitter}:45:${user.twitch}:46:${user.diamonds}:48:${user.explosion}:49:${user.modType}:50:${user.commentHistoryState}`
    }
}
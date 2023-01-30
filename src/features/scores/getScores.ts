import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { verifyGJP } from '../../lib/tools'
import Logger from '../../lib/logger'

type Body = {
    accountID: string,
    gjp: string,
    type: string,
    count: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.count) return -1
    
    if(!req.body.type) req.body.type = 'top'

    let q
    switch(req.body.type) {
        case 'top':
            q = await query("SELECT * FROM accounts WHERE stars > 10 AND isActive = 1 AND isBanned = 0 ORDER BY stars DESC LIMIT 100")
            break

        case 'friends':
            if(!req.body.accountID || !req.body.gjp) return -1
            if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

            q = await query("SELECT * FROM friends LEFT JOIN accounts ON friends.user1 = accounts.accountID OR friends.user2 = accounts.accountID WHERE user1 = ? OR user2 = ? ORDER BY accounts.stars DESC LIMIT 100", [req.body.accountID, req.body.accountID])
            break

        case 'creators':
            q = await query("SELECT * FROM accounts WHERE isActive = 1 AND isBanned = 0 ORDER BY cps DESC LIMIT 100")
            break

        case 'relative':
            q = await query("SELECT * FROM accounts WHERE isActive = 1 AND isBanned = 0 ORDER BY stars DESC LIMIT 100")
            break
    }

    if(q.length == 0) return '1:No users in leaderboard:2:1:3:0:4:0:6:1:7:1:8:0:9:1:10:1:11:3:13:0:14:0:15:0:16:1:17:0:18:0:19:0:20::21:1:22:1:23:1:24:1:25:1:26:1:28:1:29:1:30:1:43:1:44::45::46:0:48:1:49:0:50:0'

    let out = ''
    let position = 1

    for(const user of q) {
        // const q1 = await query("SELECT count(*) FROM accounts WHERE stars > ? AND stars > 10", [user.stars])
        // const rank = user.stars > 10 ? q1[0]['count(*)'] + 1 : 0
    
        const q2 = await query("SELECT count(*) FROM accounts WHERE stars > ?", [user.stars])
        const globalRank = q2[0]['count(*)'] + 1

        out += `1:${user.userName}:2:${user.accountID}:3:${user.stars}:4:${user.demons}:6:${position}:7:${user.accountID}:8:${user.cps}:9:${user.icon}:10:${user.color1}:11:${user.color2}:13:${user.coins}:14:${user.iconType}:15:${user.special}:16:${user.accountID}:17:${user.silverCoins}:18:${user.messageState}:19:${user.friendsState}:20:${user.youtube}:21:${user.cube}:22:${user.ship}:23:${user.ball}:24:${user.ufo}:25:${user.wave}:26:${user.robot}:28:${user.glow}:29:1:30:${globalRank}:43:${user.spider}:44:${user.twitter}:45:${user.twitch}:46:${user.diamonds}:48:${user.explosion}:49:${user.modType}:50:${user.commentHistoryState}|`
        position++
    }

    out = out.slice(0, -1)

    return out
}
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
            q = await query("SELECT * FROM accounts WHERE isActive = 1 AND isBanned = 0 ORDER BY cps DESC LIMIT 100")
            break
    }

    let out = ''
    let position = 1

    q.forEach((user: any) => {
        out += `1:${user.userName}:2:${user.accountID}:3:${user.stars}:4:${user.demons}:6:${position}:7:${user.accountID}:8:${user.cps}:9:${user.icon}:10:${user.color1}:11:${user.color2}:13:${user.coins}:14:${user.iconType}:15:${user.special}:16:${user.accountID}:17:${user.silverCoins}:18:${user.messageState}:19:${user.friendsState}:20:${user.youtube}:21:${user.cube}:22:${user.ship}:23:${user.ball}:24:${user.ufo}:25:${user.wave}:26:${user.robot}:28:${user.glow}:29:1:30:${position}:43:${user.spider}:44:${user.twitter}:45:${user.twitch}:46:${user.diamonds}:48:${user.explosion}:49:${user.modType}:50:${user.commentHistoryState}|`
        position++
    })

    out = out.slice(0, -1)

    return out
}
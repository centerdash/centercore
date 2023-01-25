import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { verifyGJP } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    type: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp) return -1

    if(!req.body.type) req.body.type = 0

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    if(req.body.type == 0) {
        const q = await query("SELECT * FROM friends LEFT JOIN accounts ON (friends.user1 = accounts.accountID AND friends.user1 != ?) OR (friends.user2 = accounts.accountID AND friends.user2 != ?) WHERE user1 = ? OR user2 = ?", [req.body.accountID, req.body.accountID, req.body.accountID, req.body.accountID])

        if(q.length == 0) return -2
        
        let out = ''

        q.forEach((user: any) => {
            out += `1:${user.userName}:2:${user.accountID}:3:${user.stars}:4:${user.demons}:7:${user.accountID}:8:${user.cps}:9:${user.icon}:10:${user.color1}:11:${user.color2}:13:${user.coins}:14:${user.iconType}:15:${user.special}:16:${user.accountID}:17:${user.silverCoins}:18:${user.messageState}:19:${user.friendsState}:20:${user.youtube}:21:${user.cube}:22:${user.ship}:23:${user.ball}:24:${user.ufo}:25:${user.wave}:26:${user.robot}:28:${user.glow}:29:1:43:${user.spider}:44:${user.twitter}:45:${user.twitch}:46:${user.diamonds}:48:${user.explosion}:49:${user.modType}:50:${user.commentHistoryState}|`
        })

        out = out.slice(0, -1)

        return out
    } else {
        const q = await query("SELECT * FROM blocks LEFT JOIN accounts ON blocks.toID = accounts.accountID WHERE fromID = ?", [req.body.accountID])
        if(q.length == 0) return -2
        
        let out = ''

        q.forEach((user: any) => {
            out += `1:${user.userName}:2:${user.accountID}:3:${user.stars}:4:${user.demons}:7:${user.accountID}:8:${user.cps}:9:${user.icon}:10:${user.color1}:11:${user.color2}:13:${user.coins}:14:${user.iconType}:15:${user.special}:16:${user.accountID}:17:${user.silverCoins}:18:${user.messageState}:19:${user.friendsState}:20:${user.youtube}:21:${user.cube}:22:${user.ship}:23:${user.ball}:24:${user.ufo}:25:${user.wave}:26:${user.robot}:28:${user.glow}:29:1:43:${user.spider}:44:${user.twitter}:45:${user.twitch}:46:${user.diamonds}:48:${user.explosion}:49:${user.modType}:50:${user.commentHistoryState}|`
        })

        out = out.slice(0, -1)

        return out
    }
}
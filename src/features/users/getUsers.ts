import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import Logger from '../../lib/logger'

type Body = {
    str: string,
    page: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.str || !req.body.page) return -1

    let offset = req.body.page * 10

    const q = await query("SELECT * FROM accounts WHERE userName LIKE CONCAT('%', ?, '%') LIMIT 10 OFFSET ?", [req.body.str, offset])

    if(q.length == 0) return -1

    let out = ''

    q.forEach((user: any) => {
        out += `1:${user.userName}:2:${user.accountID}:3:${user.stars}:4:${user.demons}:7:${user.accountID}:8:${user.cps}:9:${user.icon}:10:${user.color1}:11:${user.color2}:13:${user.coins}:14:${user.iconType}:15:${user.special}:16:${user.accountID}:17:${user.silverCoins}:18:${user.messageState}:19:${user.friendsState}:20:${user.youtube}:21:${user.cube}:22:${user.ship}:23:${user.ball}:24:${user.ufo}:25:${user.wave}:26:${user.robot}:28:${user.glow}:29:1:43:${user.spider}:44:${user.twitter}:45:${user.twitch}:46:${user.diamonds}:48:${user.explosion}:49:${user.modType}:50:${user.commentHistoryState}|`
    })

    out = out.slice(0, -1)

    const count = (await query("SELECT count(*) FROM accounts WHERE userName LIKE CONCAT('%', ?, '%')", [req.body.str]))[0]['count(*)']

    Logger.event_get('Users fetched (user search)')
    return `${out}#${count}:${offset}:10`
}
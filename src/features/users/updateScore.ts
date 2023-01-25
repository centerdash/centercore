import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { verifyGJP } from '../../lib/tools'

type Body = {
    accountID: number,
    gjp: string,
    stars: number,
    diamonds: number,
    coins: number,
    userCoins: number,
    icon: number,
    iconType: number,
    special: number,
    color1: number,
    color2: number,
    accIcon: number,
    accShip: number,
    accBall: number,
    accBird: number,
    accDart: number,
    accRobot: number,
    accGlow: number,
    accSpider: number,
    accExplosion: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.stars || !req.body.diamonds || !req.body.coins || !req.body.userCoins || !req.body.icon || !req.body.iconType || !req.body.special || !req.body.color1 || !req.body.color2 || !req.body.accIcon || !req.body.accShip || !req.body.accBall || !req.body.accBird || !req.body.accDart || !req.body.accRobot || !req.body.accGlow || !req.body.accSpider || !req.body.accExplosion) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    await query("UPDATE accounts SET stars=?, diamonds=?, coins=?, silverCoins=?, icon=?, iconType=?, special=?, color1=?, color2=?, cube=?, ship=?, ball=?, ufo=?, wave=?, robot=?, glow=?, spider=?, explosion=? WHERE accountID = ?", [
        req.body.stars,
        req.body.diamonds,
        req.body.coins,
        req.body.userCoins,
        req.body.icon,
        req.body.iconType,
        req.body.special,
        req.body.color1,
        req.body.color2,
        req.body.accIcon,
        req.body.accShip,
        req.body.accBall,
        req.body.accBird,
        req.body.accDart,
        req.body.accRobot,
        req.body.accGlow,
        req.body.accSpider,
        req.body.accExplosion,
        req.body.accountID
    ])

    const q = await query("SELECT accountID FROM accounts WHERE accountID = ?", [req.body.accountID])

    return q[0].accountID
}
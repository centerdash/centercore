import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import Logger from '../../lib/logger'
import Crypto from '../../lib/crypto'

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    let q = await query("SELECT * FROM gauntlets ORDER BY gauntletID ASC")

    let out = ''
    let hash = ''

    q.forEach((gauntlet: any) => {
        out += `1:${gauntlet.gauntletID}:3:${gauntlet.level1},${gauntlet.level2},${gauntlet.level3},${gauntlet.level4},${gauntlet.level5}|`
        hash += `${gauntlet.gauntletID}${gauntlet.level1},${gauntlet.level2},${gauntlet.level3},${gauntlet.level4},${gauntlet.level5}`
    })

    let crypto = new Crypto()

    out = out.slice(0, -1)
    hash = crypto.genSolo2(hash)

    Logger.event_get('Gauntlets fetched')
    return `${out}#${hash}`
}
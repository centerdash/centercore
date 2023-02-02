import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import Logger from '../../lib/logger'
import Crypto from '../../lib/crypto'

type Body = {
    page: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.page) return -1
    
    const offset = Number(req.body.page) * 10

    let q = await query("SELECT * FROM mappacks LIMIT 10 OFFSET ?", [offset])

    // if(q.length == 0) return -2

    let out = ''
    let hash = ''

    q.forEach((pack: any) => {
        out += `1:${pack.mappackID}:2:${pack.name}:3:${pack.levels}:4:${pack.stars}:5:${pack.coins}:6:${pack.difficulty}:7:${pack.textColor}:8:${pack.barColor}|`
        hash += String(pack.mappackID)[0] + String(pack.mappackID)[String(pack.mappackID).length - 1] + pack.stars + pack.coins
    })

    let crypto = new Crypto()

    out = out.slice(0, -1)
    hash = crypto.genSolo2(hash)
    
    let count = (await query("SELECT count(*) FROM mappacks"))[0]['count(*)']

    Logger.event_get('Map packs fetched')
    return `${out}#${count}:${offset}:10#${hash}`
}
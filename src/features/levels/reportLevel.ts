import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'

type Body = {
    levelID: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.levelID) return -1
    
    await query("INSERT INTO reports (levelID) VALUES (?)", [req.body.levelID])
    return 1
}
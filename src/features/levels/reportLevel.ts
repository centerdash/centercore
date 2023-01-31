import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import Logger from '../../lib/logger'
import { getTimestamp } from '../../lib/tools'

type Body = {
    levelID: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.levelID) return -1
    
    await query("INSERT INTO reports (levelID, timestamp) VALUES (?, ?)", [req.body.levelID, getTimestamp()])
    
    Logger.event_create('Report created')
    return 1
}
import { FastifyRequest, FastifyReply } from 'fastify'
import Logger from '../../lib/logger'

type Body = {
    type: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.type) return -1

    Logger.event_get('Host fetched')
    return process.env.SERVER_OUT_HOST
}
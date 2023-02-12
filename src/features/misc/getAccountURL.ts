import { FastifyRequest, FastifyReply } from 'fastify'
import Logger from '../../lib/logger'

type Body = {
    type: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.type) return -1

    let host = `http://${req.headers.host}${process.env.SERVER_BASE_PATH}`

    Logger.event_get(`Host fetched (${host})`)
    return host
}
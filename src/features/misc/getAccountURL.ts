import { FastifyRequest, FastifyReply } from 'fastify'
import Logger from '../../lib/logger'

type Body = {
    type: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.type) return -1

    //TODO: make it better or not :/
    let host = `http://${process.env.SERVER_DOMAIN}:${process.env.SERVER_PORT}${process.env.SERVER_BASE_PATH}`

    Logger.event_get(`Host fetched (${host})`)
    return host
}
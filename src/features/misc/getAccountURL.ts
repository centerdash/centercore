import { FastifyRequest, FastifyReply } from 'fastify'
import Logger from '../../lib/logger'

type Body = {
    type: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.type) return -1

    Logger.event_get('Host fetched (getAccountURL.php)')
    return `http://${process.env.SERVER_HOST}${process.env.SERVER_PORT == '80' ? '' : `:${process.env.SERVER_PORT}`}${process.env.SERVER_BASE_PATH}`
}
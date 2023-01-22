import { FastifyRequest, FastifyReply } from 'fastify'

type Body = {
    type: number
}

export default function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.type) rep.send(-1)

    if(req.body.type == 1) {
        rep.send(`http://${process.env.SERVER_HOST}${process.env.SERVER_PORT == '80' ? '' : `:${process.env.SERVER_PORT}`}${process.env.SERVER_BASE_PATH}`)
    }
}
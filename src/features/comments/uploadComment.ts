import { FastifyRequest, FastifyReply } from 'fastify'
import { getTimestamp, verifyGJP } from '../../lib/tools'
import { query } from '../../lib/db'
import Logger from '../../lib/logger'

type Body = {
    accountID: string,
    gjp: string,
    comment: string,
    levelID: string,
    percent: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.comment || !req.body.levelID) return -1

    if(!req.body.percent) req.body.percent = '0'

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    const q = await query("INSERT INTO comments (levelID, authorID, comment, percent, timestamp) VALUES (?, ?, ?, ?, ?)", [req.body.levelID, req.body.accountID, req.body.comment, req.body.percent, getTimestamp()])

    Logger.event_create('Comment uploaded')
    return q.insertId
}
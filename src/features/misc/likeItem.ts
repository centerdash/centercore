import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyGJP } from '../../lib/tools'
import { query } from '../../lib/db'
import Logger from '../../lib/logger'

type Body = {
    accountID: number,
    gjp: string,
    itemID: number,
    type: number,
    like: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.itemID || !req.body.type) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    if(!req.body.like) req.body.like = 1

    if(req.body.type == 1) {
        if(req.body.like == 1) {
            await query("UPDATE levels SET likes = likes + 1 WHERE levelID = ? LIMIT 1", [req.body.itemID])
            Logger.event_update('Level liked')
            return 1
        } else {
            await query("UPDATE levels SET likes = likes - 1 WHERE levelID = ? LIMIT 1", [req.body.itemID])
            Logger.event_update('Level disliked')
            return 1
        }
    } else if(req.body.type == 2) {
        if(req.body.like == 1) {
            await query("UPDATE comments SET likes = likes + 1 WHERE commentID = ? LIMIT 1", [req.body.itemID])
            Logger.event_update('Comment liked')
            return 1
        } else {
            await query("UPDATE comments SET likes = likes - 1 WHERE commentID = ? LIMIT 1", [req.body.itemID])
            Logger.event_update('Comment disliked')
            return 1
        }
    } else if(req.body.type == 3) {
        if(req.body.like == 1) {
            await query("UPDATE acc_comments SET likes = likes + 1 WHERE accCommentID = ? LIMIT 1", [req.body.itemID])
            Logger.event_update('Account comment liked')
            return 1
        } else {
            await query("UPDATE acc_comments SET likes = likes - 1 WHERE accCommentID = ? LIMIT 1", [req.body.itemID])
            Logger.event_update('Account comment disliked')
            return 1
        }
    } else return -1
}
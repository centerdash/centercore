import { FastifyRequest, FastifyReply } from 'fastify'
import { getTimestamp, verifyGJP } from '../../lib/tools'
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

    const count = (await query("SELECT count(*) FROM likes WHERE fromID = ? AND targetID = ? AND type = ?", [req.body.accountID, req.body.itemID, req.body.type]))[0]['count(*)']
    if(count > 0) return -1

    if(req.body.type == 1) {
        if(req.body.like == 1) {
            await query("UPDATE levels SET likes = likes + 1 WHERE levelID = ? LIMIT 1", [req.body.itemID])
            Logger.event_update('Level liked')
        } else {
            await query("UPDATE levels SET likes = likes - 1 WHERE levelID = ? LIMIT 1", [req.body.itemID])
            Logger.event_update('Level disliked')
        }
    } else if(req.body.type == 2) {
        if(req.body.like == 1) {
            await query("UPDATE comments SET likes = likes + 1 WHERE commentID = ? LIMIT 1", [req.body.itemID])
            Logger.event_update('Comment liked')
        } else {
            await query("UPDATE comments SET likes = likes - 1 WHERE commentID = ? LIMIT 1", [req.body.itemID])
            Logger.event_update('Comment disliked')
        }
    } else if(req.body.type == 3) {
        if(req.body.like == 1) {
            await query("UPDATE acc_comments SET likes = likes + 1 WHERE accCommentID = ? LIMIT 1", [req.body.itemID])
            Logger.event_update('Account comment liked')
        } else {
            await query("UPDATE acc_comments SET likes = likes - 1 WHERE accCommentID = ? LIMIT 1", [req.body.itemID])
            Logger.event_update('Account comment disliked')
        }
    } else return -1

    await query("INSERT INTO likes (fromID, targetID, type, timestamp) VALUES (?, ?, ?, ?)", [req.body.accountID, req.body.itemID, req.body.type, getTimestamp()])
    return 1
}

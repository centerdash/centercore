import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyGJP } from '../../lib/tools'
import { query } from '../../lib/db'
import Logger from '../../lib/logger'

type Body = {
    accountID: number,
    gjp: string,
    commentID: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.commentID) return -1

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    await query("DELETE FROM acc_comments WHERE accCommentID = ? AND accountID = ? LIMIT 1", [req.body.commentID, req.body.accountID])
    
    Logger.event_delete('Account comment deleted')
    return 1
}
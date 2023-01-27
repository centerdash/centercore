import { FastifyRequest, FastifyReply } from 'fastify'
import { timeDifference, getModCommentColor } from '../../lib/tools'
import { query } from '../../lib/db'
import Logger from '../../lib/logger'

type Body = {
    userID: string,
    mode: string,
    page: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.userID || !req.body.page) return -1

    if(!req.body.mode) req.body.mode = '0'

    const offset = Number(req.body.page) * 10

    let q
    if(req.body.mode == '1') {
        q = await query("SELECT *, comments.timestamp AS commentTimestamp FROM comments LEFT JOIN accounts ON comments.authorID = accounts.accountID WHERE authorID = ? ORDER BY likes DESC LIMIT 10 OFFSET ?", [req.body.userID, offset])
    } else {
        q = await query("SELECT *, comments.timestamp AS commentTimestamp FROM comments LEFT JOIN accounts ON comments.authorID = accounts.accountID WHERE authorID = ? ORDER BY comments.timestamp DESC LIMIT 10 OFFSET ?", [req.body.userID, offset])
    }

    let out = ''

    q.forEach((comment: any) => {
        out += `1~${comment.levelID}~2~${comment.comment}~3~${comment.authorID}~4~${comment.likes}~6~${comment.commentID}~7~${comment.likes < -5 ? '1' : '0'}~8~${comment.authorID}~9~${timeDifference(comment.commentTimestamp)}~10~${comment.percent}~11~${comment.modType}~12~${getModCommentColor(comment.modType)}:1~${comment.userName}~9~${comment.icon}~10~${comment.color1}~11~${comment.color2}~14~${comment.iconType}~15~${comment.glow}~16~${comment.authorID}|`
    })

    out = out.slice(0, -1)

    const count = (await query("SELECT count(*) FROM comments WHERE authorID = ?", [req.body.userID]))[0]['count(*)']

    Logger.event_get('Comment history fetched')
    return `${out}#${count}:${offset}:10`
}
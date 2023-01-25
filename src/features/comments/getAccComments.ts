import { FastifyRequest, FastifyReply } from 'fastify'
import { timeDifference } from '../../lib/tools'
import { query } from '../../lib/db'

type Body = {
    accountID: number,
    page: number
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.page) return -1

    const offset = req.body.page * 10

    const q = await query("SELECT * FROM acc_comments WHERE accountID = ? ORDER BY timestamp DESC LIMIT 10 OFFSET ?", [req.body.accountID, offset])

    let out = ''

    q.forEach((comment: any) => {
        out += `2~${comment.comment}~3~${comment.accountID}~4~${comment.likes}~5~0~6~${comment.accCommentID}~7~${comment.likes < -5 ? '1' : '0'}~9~${timeDifference(comment.timestamp)}|`
    })

    out = out.slice(0, -1)

    const count = (await query("SELECT count(*) FROM acc_comments WHERE accountID = ?", [req.body.accountID]))[0]['count(*)']

    return `${out}#${count}:${offset}:10`
}
import { FastifyRequest, FastifyReply } from 'fastify'
import { getTimestamp } from '../../lib/tools'
import { query } from '../../lib/db'
import Logger from '../../lib/logger'

type Body = {
    songID: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.songID) return -1

    let q = await query("SELECT * FROM songs WHERE songID = ?", [req.body.songID])
    
    if(q.length == 0) return -1
    if(q[0].isBanned == 1) return -2

    const song = q[0]

    Logger.event_get('Song info fetched')
    return `1~|~${song.songID}~|~2~|~${song.name}~|~3~|~1~|~4~|~${song.author}~|~5~|~${song.size}~|~6~|~${song.youtube}~|~7~|~${song.authorYoutube}~|~8~|~1~|~9~|~1~|~10~|~${encodeURIComponent(song.url)}`
}
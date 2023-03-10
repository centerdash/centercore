import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { getTimestamp, timeDifference } from '../../lib/tools'
import { readFileSync } from 'fs'
import Crypto from '../../lib/crypto'
import XOR from '../../lib/XOR'
import zlib from 'node-gzip'
import Logger from '../../lib/logger'

type Body = {
    levelID: string,
    extras: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.levelID) return -1

    if(!req.body.extras) req.body.extras = '0'

    let dailyID = ''
    let appendix = ''
    let hash2Appendix = ''
    let q

    switch(req.body.levelID) {
        case '-1':
            q = await query("SELECT * FROM daily LEFT JOIN levels ON daily.levelID = levels.levelID WHERE assignTimestamp < ? AND weekly = 0 ORDER BY assignTimestamp DESC LIMIT 1", [getTimestamp()])
            if(q.length > 0) {
                dailyID = `:41:${q[0].dailyID}`
                appendix = `#${q[0].authorID}:${q[0].userName}:${q[0].authorID}`
                hash2Appendix = `,${q[0].dailyID}`
            }
            break

        case '-2':
            q = await query("SELECT * FROM daily LEFT JOIN levels ON daily.levelID = levels.levelID WHERE assignTimestamp < ? AND weekly = 1 ORDER BY assignTimestamp DESC LIMIT 1", [getTimestamp()])
            if(q.length > 0) {
                dailyID = `:41:${q[0].dailyID + 100001}`
                appendix = `#${q[0].authorID}:${q[0].userName}:${q[0].authorID}`
                hash2Appendix = `,${q[0].dailyID + 100001}`
            }
            break

        default:
            q = await query("SELECT * FROM levels WHERE levelID = ?", [req.body.levelID])
            hash2Appendix = ',0'
            appendix = `#${q[0].authorID}:${q[0].userName}:${q[0].authorID}`
            break
    }

    if(q.length == 0) return -1

    const lvl = q[0]
    let levelString

    try {
        levelString = readFileSync(`${__dirname}/../../../data/levels/${lvl.levelID}`).toString()
    } catch(e) {
        console.log(e)
        return -1
    }

    let xorPass = ''

    if(lvl.password != 0) {
        xorPass = Buffer.from(new XOR().cipher(String(lvl.password), 26364)).toString('base64')
    } else {
        xorPass = lvl.password
    }

    if(levelString.substring(0, 3) == 'kS1') {
        levelString = Buffer.from(await zlib.gzip(levelString)).toString('base64')
        levelString = levelString.replace('/', '_').replace('+', '-')
    }

    const hash1 = new Crypto().genSolo(levelString)
    const hash2 = new Crypto().genSolo2(`${lvl.authorID},${lvl.stars},${lvl.demonRate > 0 ? '1' : '0'},${lvl.levelID},${lvl.verifiedCoins},${lvl.featured},${lvl.password}${hash2Appendix}`)

    await query("UPDATE levels SET downloads = downloads + 1 WHERE levelID = ? LIMIT 1", [lvl.levelID])

    Logger.event_get('Level downloaded')
    return `1:${lvl.levelID}:2:${lvl.name}:3:${lvl.description}:4:${levelString}:5:${lvl.version}:6:${lvl.authorID}:8:${lvl.stars > 0 ? '10' : '0'}:9:${lvl.difficulty}:10:${lvl.downloads}:11:1:12:${lvl.song}:13:21:14:${lvl.likes}:15:${lvl.length}:17:${lvl.demonRate > 0 ? '1' : '0'}:43:${lvl.demonRate}:18:${lvl.stars}:19:${lvl.featured}:25:${lvl.autoRate}${req.body.extras == '1' ? `:26:${lvl.levelInfo}` : ''}:27:${xorPass}:28:${timeDifference(lvl.timestamp)}${lvl.updateTimestamp > 0 ? `:29:${timeDifference(lvl.updateTimestamp)}` : ''}:30:${lvl.original}:31:${lvl.twoPlayer}:35:${lvl.customSong}:36:${lvl.extraString}:37:${lvl.coins}:38:${lvl.verifiedCoins}:39:${lvl.requestedStars}:40:${lvl.ldm}${dailyID}:42:${lvl.epic}:45:${lvl.objects}:46:${lvl.wt}:47:${lvl.wt2}#${hash1}#${hash2}${appendix}`
}
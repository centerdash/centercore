import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { verifyGJP, getTimestamp } from '../../lib/tools'
import { writeFileSync } from 'fs'
import Logger from '../../lib/logger'

type Body = {
    accountID: string,
    gjp: string,
    userName: string,
    levelID: string,
    levelName: string,
    levelDesc: string,
    levelVersion: string,
    levelLength: string,
    audioTrack: string,
    password: string,
    original: string,
    twoPlayer: string,
    songID: string,
    objects: string,
    coins: string,
    requestedStars: string,
    unlisted: string,
    ldm: string,
    extraString: string,
    levelString: string,
    levelInfo: string,
    wt: string,
    wt2: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.userName || !req.body.levelID || !req.body.levelName || !req.body.levelVersion || !req.body.levelLength || !req.body.audioTrack || !req.body.password || !req.body.original || !req.body.twoPlayer || !req.body.songID || !req.body.objects || !req.body.coins || !req.body.unlisted || !req.body.ldm || !req.body.extraString || !req.body.levelString || !req.body.levelInfo) return -1

    if(!req.body.wt) req.body.wt = '0'
    if(!req.body.wt2) req.body.wt2 = '0'
    if(!/^[0-9]*$/g.test(req.body.levelID)) return -1
    if(!/^[a-zA-Z0-9 ]*$/g.test(req.body.levelName)) return -1
    if(!req.body.levelDesc) req.body.levelDesc = ''
    if(!req.body.requestedStars) req.body.requestedStars = '0'
    if(!req.body.levelID) req.body.levelID = '0'

    if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

    if(req.body.levelID == '0') {
        // rate limit
        const q1 = await query("SELECT timestamp FROM levels WHERE authorID = ? ORDER BY timestamp DESC LIMIT 1", [req.body.accountID])
        if(q1.length > 0) {
            let diff = getTimestamp() - q1[0].timestamp
            if(diff < 30) return -1
        }

        const q = await query("INSERT INTO levels (userName, authorID, timestamp, name, description, version, length, song, customSong, objects, password, original, twoPlayer, coins, requestedStars, unlisted, extraString, levelInfo, ldm, wt, wt2) VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
            req.body.userName,
            req.body.accountID,
            getTimestamp(),
            req.body.levelName,
            req.body.levelDesc,
            req.body.levelLength,
            req.body.audioTrack,
            req.body.songID,
            req.body.objects,
            req.body.password,
            req.body.original,
            req.body.twoPlayer,
            req.body.coins,
            req.body.requestedStars,
            req.body.unlisted,
            req.body.extraString,
            req.body.levelInfo,
            req.body.ldm,
            req.body.wt,
            req.body.wt2
        ])

        try {
            writeFileSync(`${__dirname}/../../../data/levels/${q.insertId}`, req.body.levelString)
        } catch(err) {
            console.log(err)
            return -1
        }

        return q.insertId
    } else {
        const q = await query("SELECT count(*), levelID FROM levels WHERE levelID = ? AND authorID = ?", [req.body.levelID, req.body.accountID])
        if(q[0]['count(*)'] == 0) return -1

        await query("UPDATE levels SET userName=?, authorID=?, updateTimestamp=?, name=?, description=?, version=?, length=?, song=?, customSong=?, objects=?, password=?, original=?, twoPlayer=?, coins=?, requestedStars=?, unlisted=?, extraString=?, levelInfo=?, ldm=?, wt=?, wt2=? WHERE levelID = ? LIMIT 1", [
            req.body.userName,
            req.body.accountID,
            getTimestamp(),
            req.body.levelName,
            req.body.levelDesc,
            req.body.levelVersion,
            req.body.levelLength,
            req.body.audioTrack,
            req.body.songID,
            req.body.objects,
            req.body.password,
            req.body.original,
            req.body.twoPlayer,
            req.body.coins,
            req.body.requestedStars,
            req.body.unlisted,
            req.body.extraString,
            req.body.levelInfo,
            req.body.ldm,
            req.body.wt,
            req.body.wt2,
            q[0].levelID
        ])
        
        try {
            writeFileSync(`${__dirname}/../../../data/levels/${q[0].levelID}`, req.body.levelString)
        } catch(err) {
            console.log(err)
            return -1
        }

        Logger.event_update('Level updated')
        return q[0].levelID
    }
}
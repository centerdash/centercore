import { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../../lib/db'
import { verifyGJPOrExit, getTimestamp } from '../../lib/tools'
import { writeFileSync } from 'fs'

type Body = {
    accountID: number,
    gjp: string,
    userName: string,
    levelID: number,
    levelName: string,
    levelDesc: string,
    levelVersion: number,
    levelLength: number,
    audioTrack: number,
    password: number,
    original: number,
    twoPlayer: number,
    songID: number,
    objects: number,
    coins: number,
    requestedStars: number,
    unlisted: number,
    ldm: number,
    extraString: string,
    levelString: string,
    levelInfo: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {
    if(!req.body.accountID || !req.body.gjp || !req.body.userName || !req.body.levelID || !req.body.levelName || !req.body.levelDesc || !req.body.levelVersion || !req.body.levelLength || !req.body.audioTrack || !req.body.password || !req.body.original || !req.body.twoPlayer || !req.body.songID || !req.body.objects || !req.body.coins || !req.body.requestedStars || !req.body.unlisted || !req.body.ldm || !req.body.extraString || !req.body.levelString || !req.body.levelInfo) return rep.send(-1)

    await verifyGJPOrExit(req.body.accountID, req.body.gjp, rep)

    if(req.body.levelID == 0) {
        db.query("SELECT timestamp FROM levels WHERE authorID = ? ORDER BY timestamp DESC LIMIT 1", [req.body.accountID], (err, q1) => {
            if(q1.length > 0) {
                let diff = getTimestamp() - q1[0].timestamp
                if(diff < 30) {
                    rep.send(-1)
                    return
                }
            }

            db.query("INSERT INTO levels (userName, authorID, timestamp, name, description, length, song, customSong, objects, password, original, twoPlayer, coins, requestedStars, unlisted, extraString, levelInfo, ldm) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
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
                req.body.ldm
            ], (err, q) => {
                try {
                    writeFileSync(`${__dirname}/../../../data/levels/${q.insertId}`, req.body.levelString)
                } catch(err) {
                    rep.send(-1)
                    return
                }
                rep.send(q.insertId)
            })
        })
    } else {
        db.query("SELECT count(*), levelID FROM levels WHERE levelID = ? AND authorID = ?", [req.body.levelID, req.body.accountID], (err, q) => {
            if(q.length == 0) {
                rep.send(-1)
                return
            }

            db.query("UPDATE levels SET userName=?, authorID=?, updateTimestamp=?, name=?, description=?, length=?, song=?, customSong=?, objects=?, password=?, original=?, twoPlayer=?, coins=?, requestedStars=?, unlisted=?, extraString=?, levelInfo=?, ldm=? WHERE levelID = ? LIMIT 1", [
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
                q[0].levelID
            ], (err, q1) => {
                rep.send(q[0].levelID)
            })
        })
    }
}
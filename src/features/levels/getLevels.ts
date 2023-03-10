import { FastifyRequest, FastifyReply } from 'fastify'
import { query } from '../../lib/db'
import { getTimestamp, verifyGJP } from '../../lib/tools'
import { createHash } from 'crypto'
import Logger from '../../lib/logger'

type Body = {
    type: string,
    str: string,
    diff: string,
    len: string,
    page: string,
    uncompleted: number,
    onlyCompleted: number,
    featured: number,
    original: number,
    twoPlayer: number,
    coins: number,
    epic: number,
    song: string,
    customSong: number,
    star: number,
    noStar: number,
    demonFilter: string,
    accountID: string,
    gjp: string,
    local: string,
    gauntlet: string
}

export default async function handler(req: FastifyRequest<{ Body: Body }>, rep: FastifyReply) {    
    if(!req.body.type) req.body.type = 'gauntlet'
    if(!req.body.diff) req.body.diff = '-'
    if(!req.body.len) req.body.len = '-'
    if(!req.body.uncompleted) req.body.uncompleted = 0
    if(!req.body.onlyCompleted) req.body.onlyCompleted = 0
    if(!req.body.featured) req.body.featured = 0
    if(!req.body.original) req.body.original = 0
    if(!req.body.twoPlayer) req.body.twoPlayer = 0
    if(!req.body.coins) req.body.coins = 0
    if(!req.body.epic) req.body.epic = 0

    const offset = Number(req.body.page) * 10

    let filters: string[] = []

    if(!req.body.local) req.body.local = '0'

    if(req.body.type == '5') {
        if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1
    } else filters.push("unlisted = 0")

    if(req.body.featured == 1) filters.push("featured = 1")
    if(req.body.epic == 1) filters.push("epic = 1")
    if(req.body.original == 1) filters.push("original = 1")
    if(req.body.twoPlayer == 1) filters.push("twoPlayer = 1")
    if(req.body.coins > 0) filters.push("coins > 0")
    if(req.body.star) filters.push("stars > 0")
    if(req.body.noStar) filters.push("stars = 0")
    if(req.body.len != '-' && /^\d{1}(,\d{1})*$/.test(req.body.len)) filters.push(`length IN (${req.body.len})`)
    if(req.body.song) {
        if(req.body.customSong) {
            req.body.song == '0' ? filters.push("customSong != 0 AND song = 0") : filters.push(`customSong = ${req.body.song.replace(/^[0-9]$/, '')}`)
        } else {
            filters.push(`song = ${req.body.song.replace(/^[0-9]$/, '')}`)
        }
    }
    if(req.body.diff != '-') {
        switch(req.body.diff) {
            case '-1':
                filters.push("stars = 0")
                break
            case '-2':
                if(req.body.demonFilter) {
                    switch(req.body.demonFilter) {
                        case '1':
                            filters.push("demonRate = 1")
                            break
                        case '2':
                            filters.push("demonRate = 2")
                            break
                        case '3':
                            filters.push("demonRate = 3")
                            break
                        case '4':
                            filters.push("demonRate = 4")
                            break
                        case '5':
                            filters.push("demonRate = 5")
                            break
                    }
                } else {
                    filters.push("demonRate > 0")
                }
                break
            case '-3':
                filters.push("autoRate = 1")
                break
            default:
                if(/^\d{1}(,\d{1})*$/.test(req.body.diff)) filters.push(`difficulty IN (${req.body.diff})`)
                break
        }
    }

    let sql = ""
    let props: any[] = []
    let countsql = ""
    let countprops: any[] = []

    switch(req.body.type) {
        case '15':
        case '0': // search without filters
            if(req.body.str) {
                sql = "SELECT * FROM levels WHERE name LIKE CONCAT('%', ?, '%') OR levelID = ? AND (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ") ORDER BY likes DESC LIMIT 10 OFFSET ?"
                props = [req.body.str, req.body.str, offset]
                countsql = "SELECT count(*) FROM levels WHERE name LIKE CONCAT('%', ?, '%') OR levelID = ? AND (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ")"
                countprops = [req.body.str, req.body.str]
            } else {
                sql = "SELECT * FROM levels WHERE (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ") LIMIT 10 OFFSET ?"
                props = [offset]
                countsql = "SELECT count(*) FROM levels WHERE AND (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ")"
                countprops = [req.body.str, req.body.str]
            }
            break

        case '1': // most downloaded
            sql = "SELECT * FROM levels WHERE (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ") ORDER BY downloads DESC LIMIT 10 OFFSET ?"
            props = [offset]
            countsql = "SELECT count(*) FROM levels WHERE (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ")"
            countprops = []
            break
        
        case '2': // most liked & filter search
            sql = "SELECT * FROM levels WHERE (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ") ORDER BY likes DESC LIMIT 10 OFFSET ?"
            props = [offset]
            countsql = "SELECT count(*) FROM levels WHERE (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ")"
            countprops = []
            break

        case '3': // trending
            const timestamp = getTimestamp() - (7 * 24 * 60 * 60)

            sql = "SELECT * FROM levels WHERE (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ") AND timestamp > ? ORDER BY likes DESC LIMIT 10 OFFSET ?"
            props = [timestamp, offset]
            countsql = "SELECT count(*) FROM levels WHERE (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ") AND timestamp > ?"
            countprops = [timestamp]
            break

        case '4': // recent
            sql = "SELECT * FROM levels WHERE (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ") ORDER BY timestamp DESC LIMIT 10 OFFSET ?"
            props = [offset]
            countsql = "SELECT count(*) FROM levels WHERE (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ")"
            countprops = []
            break
        
        case '5': // user levels
            if(req.body.local == '1') {
                if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1
                
                sql = "SELECT * FROM levels WHERE authorID = ? ORDER BY timestamp DESC LIMIT 10 OFFSET ?"
                props = [req.body.str, offset]
                countsql = "SELECT count(*) FROM levels WHERE authorID = ?"
                countprops = [req.body.str]
            } else {
                sql = "SELECT * FROM levels WHERE authorID = ? ORDER BY timestamp DESC LIMIT 10 OFFSET ?"
                props = [req.body.str, offset]
                countsql = "SELECT count(*) FROM levels WHERE authorID = ?"
                countprops = [req.body.str]
            }
            break

        case '6': // featured
            sql = "SELECT * FROM levels WHERE (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ") AND featured = 1 ORDER BY rateTimestamp DESC LIMIT 10 OFFSET ?"
            props = [offset]
            countsql = "SELECT count(*) FROM levels WHERE (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ") AND featured = 1"
            countprops = []
            break
        
        case '7': // magic
            sql = "SELECT * FROM levels WHERE (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ") AND objects > 9999 ORDER BY likes DESC LIMIT 10 OFFSET ?"
            props = [offset]
            countsql = "SELECT count(*) FROM levels WHERE (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ") AND objects > 9999"
            countprops = []
            break
        
        case '19':
        case '10': // map pack
            if(!/^\d+(?:,\d+)*$/.test(req.body.str)) return -1

            sql = "SELECT * FROM levels WHERE levelID IN (" + req.body.str + ")"
            props = []
            countsql = "SELECT count(*) FROM levels WHERE levelID IN (" + req.body.str + ")"
            countprops = []
            break

        case '11': // awarded
            sql = "SELECT * FROM levels WHERE (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ") AND stars > 0 ORDER BY rateTimestamp DESC, timestamp LIMIT 10 OFFSET ?"
            props = [offset]
            countsql = "SELECT count(*) FROM levels WHERE (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ") AND stars > 0"
            countprops = []
            break

        case '12': // followed
            if(req.body.str == '') return '###0:0:10#f5da5823d94bbe7208dd83a30ff427c7d88fdb99'
            if(!/^\d+(?:,\d+)*$/.test(req.body.str)) return -1

            sql = "SELECT * FROM levels WHERE authorID IN (" + req.body.str + ") AND (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ") ORDER BY timestamp DESC LIMIT 10 OFFSET ?"
            props = [offset]
            countsql = "SELECT count(*) FROM levels WHERE authorID IN (" + req.body.str + ") AND (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ")"
            countprops = []
            break

        case '13': // friends
            if(!(await verifyGJP(req.body.accountID, req.body.gjp))) return -1

            let friends = await query("SELECT * FROM friends LEFT JOIN accounts ON (friends.user1 = accounts.accountID AND friends.user1 != ?) OR (friends.user2 = accounts.accountID AND friends.user2 != ?) WHERE user1 = ? OR user2 = ?", [req.body.accountID, req.body.accountID, req.body.accountID, req.body.accountID])
            let frstr = ''

            friends.forEach((friend: any) => {
                if(friend.user1 != req.body.accountID)
                    frstr += `${friend.user1},`
                else if(friend.user2 != req.body.accountID)
                    frstr += `${friend.user2},`
            })

            frstr = frstr.slice(0, -1)

            if(frstr == '') return '###0:0:10#f5da5823d94bbe7208dd83a30ff427c7d88fdb99'
            if(!/^\d+(?:,\d+)*$/.test(frstr)) return -1

            sql = "SELECT * FROM levels WHERE authorID IN (" + frstr + ") AND (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ") ORDER BY timestamp DESC LIMIT 10 OFFSET ?"
            props = [offset]
            countsql = "SELECT count(*) FROM levels WHERE authorID IN (" + frstr + ") AND (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ")"
            countprops = []
            break

        case '16': // hall of fame
            sql = "SELECT * FROM levels WHERE (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ") AND epic = 1 ORDER BY rateTimestamp DESC LIMIT 10 OFFSET ?"
            props = [offset]
            countsql = "SELECT count(*) FROM levels WHERE (" + (filters.length > 0 ? filters.join(') AND (') : '1') + ") AND epic = 1"
            countprops = []
            break

        case 'gauntlet': // gauntlet
            let q = await query("SELECT * FROM gauntlets WHERE gauntletID = ?", [req.body.gauntlet])
            if(q.length == 0) return -1

            let levels = q.map((g: any) => { return `${g.level1},${g.level2},${g.level3},${g.level4},${g.level5}` })

            sql = "SELECT * FROM levels WHERE levelID IN (" + levels[0] + ") ORDER BY stars DESC"
            props = []
            countsql = "SELECT count(*) FROM levels WHERE levelID IN (" + levels[0] + ")"
            countprops = []
            break

        default:
            return -1
    }

    const q = await query(sql, props)

    let levels = ''
    let users = ''
    let songs = ''
    let hash = ''

    for(let lvl of q) {
        levels += `1:${lvl.levelID}:2:${lvl.name}:5:${lvl.version}:6:${lvl.authorID}:8:10:9:${lvl.difficulty}:10:${lvl.downloads}:12:${lvl.song}:13:21:14:${lvl.likes}:17:${lvl.demonRate > 0 ? 1 : 0}:43:${lvl.demonRate > 0 ? lvl.demonRate : 0}:25:${lvl.autoRate}:18:${lvl.stars}:19:${lvl.featured}:42:${lvl.epic}:45:${lvl.objects}:3:${lvl.description}:15:${lvl.length}:30:${lvl.original}:31:${lvl.twoPlayer}:37:${lvl.coins}:38:${lvl.verifiedCoins}:39:${lvl.requestedStars}:46:1:47:2:40:${lvl.ldm}${req.body.gauntlet ? `:44:${req.body.gauntlet}` : ''}:35:${lvl.customSong}|`
        users += `${lvl.authorID}:${lvl.userName}:${lvl.authorID}|`
        if(lvl.customSong != 0) {
            let song = await query("SELECT * FROM levels LEFT JOIN songs ON levels.customSong = songs.songID WHERE levelID = ?", [lvl.levelID])
            if(song.length > 0) {
                songs += `1~|~${song[0].songID}~|~2~|~${song[0].name}~|~3~|~0~|~4~|~${song[0].author}~|~5~|~${song[0].size}~|~6~|~${song[0].youtube}~|~7~|~${song[0].authorYoutube}~|~8~|~1~|~10~|~${encodeURIComponent(song[0].url)}~:~`
            }
        }
        hash += String(lvl.levelID)[0] + String(lvl.levelID)[String(lvl.levelID).length - 1] + lvl.stars + lvl.verifiedCoins
    }

    levels = levels.slice(0, -1)
    users = users.slice(0, -1)
    songs = songs.slice(0, -3)

    const count = (await query(countsql, countprops))[0]['count(*)']

    Logger.event_get('Levels fetched')
    return `${levels}#${users}#${songs}#${count}:${offset}:10#${createHash('sha1').update(hash + 'xI25fpAapCQg').digest('hex')}`
}
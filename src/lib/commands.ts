import { getDifficulty, getTimestamp, verifyGJP, calculateCps } from './tools'
import { query } from './db'
import Logger from './logger'
import { unlinkSync } from 'fs'

export default class Commands {
    static async doCommand(comment: string, levelID: number | string, accountID: number | string, gjp: string): Promise<string | boolean> {
        if(!(await verifyGJP(accountID, gjp))) return false
        let modType = (await query("SELECT modType FROM accounts WHERE accountID = ?", [accountID]))[0].modType
        
        const baseCommand = /^![a-zA-Z]*$/g
        const argumentCommand = /^![a-zA-Z]* [a-zA-Z0-9]*$/g
        const numberArgumentCommand = /^![a-zA-Z]* [0-9]*$/g

        const isBaseCommand = baseCommand.test(comment)
        const isArgumentCommand = argumentCommand.test(comment)
        const isNumberArgumentCommand = numberArgumentCommand.test(comment)

        if(!isBaseCommand && !isArgumentCommand && !isNumberArgumentCommand) return false

        if(comment.startsWith('!rate') && isNumberArgumentCommand && (modType == 1 || modType == 2)) {
            let stars = comment.split(' ')[1]
            let diff = getDifficulty(Number(stars))

            if(stars == '10') {
                await query("UPDATE levels SET stars = 10, demonRate = 3, autoRate = 0, difficulty = ?, rateTimestamp = ? WHERE levelID = ?", [diff, getTimestamp(), levelID])
            } else if(stars == '0') {
                await query("UPDATE levels SET stars = 0, demonRate = 0, autoRate = 0, difficulty = ?, rateTimestamp = 0 WHERE levelID = ?", [diff, levelID])
            } else if(stars == '1') {
                await query("UPDATE levels SET stars = 1, demonRate = 0, autoRate = 1, difficulty = ?, rateTimestamp = ? WHERE levelID = ?", [diff, getTimestamp(), levelID])
            } else {
                await query("UPDATE levels SET stars = ?, demonRate = 0, autoRate = 0, difficulty = ?, rateTimestamp = ? WHERE levelID = ?", [stars, diff, getTimestamp(), levelID])
            }

            await calculateCps()

            Logger.event_update('Level rated')
            return 'Level rated!'
        } else if(comment.startsWith('!featured') && isNumberArgumentCommand && (modType == 1 || modType == 2)) {
            let featured = comment.split(' ')[1]

            if(featured == '0') {
                await query("UPDATE levels SET featured = 0 WHERE levelID = ?", [levelID])
            } else if(featured == '1') {
                await query("UPDATE levels SET featured = 1 WHERE levelID = ?", [levelID])
            } else return false

            await calculateCps()

            Logger.event_update('Feature changed')
            return 'Featured changed!'
        } else if(comment.startsWith('!epic') && isNumberArgumentCommand && (modType == 2)) {
            let epic = comment.split(' ')[1]

            if(epic == '0') {
                await query("UPDATE levels SET epic = 0 WHERE levelID = ?", [levelID])
            } else if(epic == '1') {
                await query("UPDATE levels SET epic = 1 WHERE levelID = ?", [levelID])
            } else return false

            await calculateCps()

            Logger.event_update('Epic changed')
            return 'Epic changed!'
        } else if(comment.startsWith('!daily') && isBaseCommand && (modType == 2)) {
            let count = (await query("SELECT count(*) FROM daily WHERE levelID = ? AND weekly = 0", [levelID]))[0]['count(*)']
            if(count > 0) return false

            let q = await query("SELECT assignTimestamp FROM daily WHERE assignTimestamp >= ? AND weekly = 0 ORDER BY assignTimestamp DESC LIMIT 1", [Math.floor(new Date().setHours(24, 0, 0, 0) / 1000)])
            let timestamp

            if(q.length == 0) {
                timestamp = Math.floor(new Date().setHours(24, 0, 0, 0) / 1000)
            } else {
                timestamp = q[0].assignTimestamp + 86400
            }

            await query("INSERT INTO daily (levelID, weekly, assignTimestamp) VALUES (?, 0, ?)", [levelID, timestamp])

            Logger.event_create('Level added to daily queue')
            return 'Level added to daily queue!'
        } else if(comment.startsWith('!weekly') && isBaseCommand && (modType == 2)) {
            let count = (await query("SELECT count(*) FROM daily WHERE levelID = ? AND weekly = 1", [levelID]))[0]['count(*)']
            if(count > 0) return false
            
            let q = await query("SELECT assignTimestamp FROM daily WHERE assignTimestamp >= ? AND weekly = 1 ORDER BY assignTimestamp DESC LIMIT 1", [Math.floor(new Date().setDate(new Date().getDate() + (1 + 7 - new Date().getDay()) % 7) / 1000)])
            let timestamp

            if(q.length == 0) {
                timestamp = Math.floor(new Date().setDate(new Date().getDate() + (1 + 7 - new Date().getDay()) % 7) / 1000)
            } else {
                timestamp = q[0].assignTimestamp + 604800
            }

            await query("INSERT INTO daily (levelID, weekly, assignTimestamp) VALUES (?, 1, ?)", [levelID, timestamp])

            Logger.event_create('Level added to weekly queue')
            return 'Level added to weekly queue!'
        } else if(comment.startsWith('!demon') && isArgumentCommand && (modType == 1 || modType == 2)) {
            let demon = comment.split(' ')[1]

            if(demon == 'easy') {
                await query("UPDATE levels SET demonRate = 3 WHERE levelID = ?", [levelID])
            } else if(demon == 'medium') {
                await query("UPDATE levels SET demonRate = 4 WHERE levelID = ?", [levelID])
            } else if(demon == 'hard') {
                await query("UPDATE levels SET demonRate = 2 WHERE levelID = ?", [levelID])
            } else if(demon == 'insane') {
                await query("UPDATE levels SET demonRate = 5 WHERE levelID = ?", [levelID])
            } else if(demon == 'extreme') {
                await query("UPDATE levels SET demonRate = 6 WHERE levelID = ?", [levelID])
            }

            Logger.event_update('Demon changed')
            return 'Demon changed!'
        } else if(comment.startsWith('!delete') && isBaseCommand && (modType == 2)) {
            try {
                unlinkSync(`${__dirname}/../../data/levels/${levelID}`)
            } catch(err) {
                console.log(err)
                return false
            }

            await query("DELETE FROM levels WHERE levelID = ? LIMIT 1", [levelID])

            Logger.event_delete('Level deleted by moderator')
            return 'Level deleted!'
        }

        return false
    }
}
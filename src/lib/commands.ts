import { getDifficulty, verifyGJP } from './tools'
import { query } from './db'

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
                await query("UPDATE levels SET stars = 10, demonRate = 3, autoRate = 0, difficulty = ? WHERE levelID = ?", [diff, levelID])
            } else if(stars == '0') {
                await query("UPDATE levels SET stars = 0, demonRate = 0, autoRate = 0, difficulty = ? WHERE levelID = ?", [diff, levelID])
            } else if(stars == '1') {
                await query("UPDATE levels SET stars = 1, demonRate = 0, autoRate = 1, difficulty = ? WHERE levelID = ?", [diff, levelID])
            } else {
                await query("UPDATE levels SET stars = ?, demonRate = 0, autoRate = 0, difficulty = ? WHERE levelID = ?", [stars, diff, levelID])
            }

            return 'Level rated!'
        } else if(comment.startsWith('!featured') && isNumberArgumentCommand && (modType == 1 || modType == 2)) {
            let featured = comment.split(' ')[1]

            if(featured == '0') {
                await query("UPDATE levels SET featured = 0 WHERE levelID = ?", [levelID])
            } else if(featured == '1') {
                await query("UPDATE levels SET featured = 1 WHERE levelID = ?", [levelID])
            } else return false

            return 'Featured changed!'
        } else if(comment.startsWith('!epic') && isNumberArgumentCommand && (modType == 2)) {
            let epic = comment.split(' ')[1]

            if(epic == '0') {
                await query("UPDATE levels SET epic = 0 WHERE levelID = ?", [levelID])
            } else if(epic == '1') {
                await query("UPDATE levels SET epic = 1 WHERE levelID = ?", [levelID])
            } else return false

            return 'Epic changed!'
        }

        return false
    }
}
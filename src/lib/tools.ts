import { compareSync } from 'bcrypt'
import { query } from './db'
import XOR from './XOR'

/**
 * @returns time difference in relative format between current time and previous
 */
export function timeDifference(previous: number): string {
    let perMinute = 60
    let perHour = perMinute * 60
    let perDay = perHour * 24
    let perMonth = perDay * 30
    let perYear = perDay * 365

    let elapsed = (Date.now() / 1000) - previous

    if(elapsed < perMinute) {
        return Math.round(elapsed) + ' seconds'
    }

    else if(elapsed < perHour) {
        return Math.round(elapsed/perMinute) + ' minutes'
    }

    else if(elapsed < perDay ) {
        return Math.round(elapsed/perHour) + ' hours'
    }

    else if(elapsed < perMonth) {
        return Math.round(elapsed/perDay) + ' days'
    }

    else if(elapsed < perYear) {
        return Math.round(elapsed/perMonth) + ' months'
    }

    else {
        return Math.round(elapsed/perYear) + ' years'
    }
}

/**
 * @returns current timestamp
 */
export function getTimestamp(): number {
    return Math.floor(Date.now() / 1000)
}

/**
 * @returns random number between min and max
 */
export function random(min: number, max: number): number {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is inclusive and the minimum is inclusive
}

/**
 * @returns random string with selected length
 */
export function generateString(length: number = 10): string {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
    const charactersLength = characters.length
    let counter = 0
    while(counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
      counter += 1
    }
    return result
}

/**
 * decodes GJP
 * @returns decoded password
 */
export function decodeGJP(gjp: string): string {
    return new XOR().cipher(Buffer.from(gjp.replace(/_/g, '/').replace(/-/g, '+'), 'base64').toString('utf8'), 37526)
}

/**
 * verify GJP of user
 * @returns true or false
 */
export async function verifyGJP(accountID: number | string, gjp: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        const q = await query("SELECT password FROM accounts WHERE accountID = ?", [accountID])
        if(q.length == 0) return resolve(false)

        if(compareSync(decodeGJP(gjp), q[0].password)) return resolve(true)
        else return resolve(false)
    })
}

/**
 * get moderator color for comments
 * @returns color like 'r,g,b'
 */
export function getModCommentColor(modType: number): string {
    if(modType == 0) return '0,0,0'
    if(modType == 1) return '52,250,160'
    if(modType == 2) return '98,249,255'
    else return '0,0,0'
}

/**
 * get difficulty from stars
 * @returns difficulty
 */
export function getDifficulty(stars: number): number {
    if(stars == 0) return 0
    if(stars == 1) return 50
    if(stars == 2) return 10
    if(stars == 3) return 20
    if(stars == 4 || stars == 5) return 30
    if(stars == 6 || stars == 7) return 40
    if(stars == 8 || stars == 9 || stars == 10) return 50
    return 0
}
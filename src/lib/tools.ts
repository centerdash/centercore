import { FastifyReply } from 'fastify'
import { compareSync } from 'bcrypt'
import { query } from './db'
import XOR from './XOR'

/**
 * @returns time difference in relative format between current time and previous
 */
export function timeDifference(previous: number) {
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
        return Math.round(elapsed/perHour ) + ' hours'
    }

    else if(elapsed < perMonth) {
        return Math.round(elapsed/perDay) + ' days'
    }

    else if(elapsed < perYear) {
        return Math.round(elapsed/perMonth) + ' months'
    }

    else {
        return Math.round(elapsed/perYear ) + ' years'
    }
}

/**
 * @returns current timestamp
 */
export function getTimestamp() {
    return Math.floor(Date.now() / 1000)
}

/**
 * @returns random number between min and max
 */
export function random(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is inclusive and the minimum is inclusive
}

/**
 * @returns random string with selected length
 */
export function generateString(length: number = 10) {
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
export function decodeGJP(gjp: string) {
    return new XOR().cipher(Buffer.from(gjp.replace(/_/g, '/').replace(/-/g, '+'), 'base64').toString('utf8'), 37526)
}

/**
 * verify GJP of user
 * @returns true or false
 */
export async function verifyGJP(accountID: number | string, gjp: string) {
    return new Promise(async (resolve, reject) => {
        const q = await query("SELECT password FROM accounts WHERE accountID = ?", [accountID])
        if(q.length == 0) return resolve(false)

        if(compareSync(decodeGJP(gjp), q[0].password)) return resolve(true)
        else return resolve(false)
    })
}
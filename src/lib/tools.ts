import { FastifyReply } from 'fastify'
import { compareSync } from 'bcrypt'
import { db } from './db'
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
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
    for(let i = 0; i < characters.length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
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
 * verify GJP of user and return -1 to FastifyReply if GJP was wrong
 * @returns true or -1 to FastifyReply
 */
export function verifyGJPOrExit(accountID: number, gjp: string, rep: FastifyReply) {
    return new Promise((resolve, reject) => {
        db.query("SELECT password FROM accounts WHERE accountID = ?", [accountID], (err, q) => {
            if(q.length == 0) return rep.send(-1)
    
            if(compareSync(decodeGJP(gjp), q[0].password)) return resolve(true)
            else return rep.send(-1)
        })
    })
}

/**
 * encode GD message
 * @returns encoded message
 */
export function encodeMessage(msg: string) {
    return Buffer.from(new XOR().cipher(msg, 14251)).toString('base64')
}
import { compareSync } from 'bcrypt'
import { FastifyReply } from 'fastify'
import { db } from './db'
import XOR from './XOR'

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
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
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
 * verify GJP of user
 * @returns true or false
 */
export function verifyGJP(accountID: number, gjp: string) {
    return new XOR().cipher(Buffer.from(gjp.replace(/_/g, '/').replace(/-/g, '+'), 'base64').toString('utf8'), 37526)
}

/**
 * verify GJP of user and return -1 to FastifyReply if GJP was wrong
 * @returns true or -1 to FastifyReply
 */
export function verifyGJPOrExit(accountID: number, gjp: string, rep: FastifyReply) {
    if(verifyGJP(accountID, gjp)) return true
    else return rep.send(-1)
}
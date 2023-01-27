import { createConnection } from 'mysql'
import Logger from './logger'
import dotenv from 'dotenv'
dotenv.config()

export async function testConnection() {
    return new Promise((resolve, reject) => {
        const db = createConnection({
            host: process.env.MYSQL_HOST,
            port: Number(process.env.MYSQL_PORT),
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        })

        db.connect(err => {
            if(err) throw err

            Logger.log('Connected to MySQL')
            resolve(true)
        })

        db.end()
    })
}

export async function query(query: string, values: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
        const db = createConnection({
            host: process.env.MYSQL_HOST,
            port: Number(process.env.MYSQL_PORT),
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        })
        
        db.connect(err => {
            if(err) {
                console.log(err)
                reject(err)
            }
        })
    
        db.query(query, values, (err, q) => {
            if(err) {
                console.log(err)
                reject(err)
            }

            resolve(q)
        })
    })
}

import { createConnection } from 'mysql'
import dotenv from 'dotenv'
dotenv.config()

export const db = createConnection({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
})

db.connect(err => {
    if(err) throw err
    
    console.log('Connected to MySQL')
})
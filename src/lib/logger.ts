import colors from 'cli-color'
import { config } from 'dotenv'
config()

export default class Logger {
    static log(text: string) {
        let time = new Date().toLocaleTimeString()
        console.log(`[${time} log] ` + text)
    }

    static event(text: string) {
        if(process.env.LOG_EVENTS == '1') {
            let time = new Date().toLocaleTimeString()
            console.log(`[${time} event] ` + text)
        }
    }
    static event_create(text: string) {
        if(process.env.LOG_EVENTS == '1') {
            let time = new Date().toLocaleTimeString()
            console.log(colors.green(`[${time} event] ` + text))
        }
    }
    static event_delete(text: string) {
        if(process.env.LOG_EVENTS == '1') {
            let time = new Date().toLocaleTimeString()
            console.log(colors.red(`[${time} event] ` + text))
        }
    }
    static event_update(text: string) {
        if(process.env.LOG_EVENTS == '1') {
            let time = new Date().toLocaleTimeString()
            console.log(colors.yellow(`[${time} event] ` + text))
        }
    }
    static event_get(text: string) {
        if(process.env.LOG_EVENTS == '1') {
            let time = new Date().toLocaleTimeString()
            console.log(colors.cyan(`[${time} event] ` + text))
        }
    }
}
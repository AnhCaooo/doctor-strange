import dotenv from 'dotenv'
import { Config } from 'models/config'


export function loadConfig(): Config {
    dotenv.config()
    return {
        supabase: {
            jwt_token: process.env.SUPBASE_JWT_SECRET || '',
        }
    }
}
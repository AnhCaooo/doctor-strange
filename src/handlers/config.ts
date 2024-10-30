import dotenv from 'dotenv'
import { Config } from 'models/config'

dotenv.config()

export const config: Config = {
    supabase: {
        jwt_token: process.env.SUPBASE_JWT_SECRET || '',
    }
}
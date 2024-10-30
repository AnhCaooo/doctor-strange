export interface Config {
    supabase: Supabase
}


interface Supabase {
    jwt_token: string;
}
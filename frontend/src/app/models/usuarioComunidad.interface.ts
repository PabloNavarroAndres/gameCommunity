export interface UsuarioComunidad {
    user_email: string;
    community_id:   number;
    isCreator:  number;
    isAdmin?:  number;
    username?: string;
    password?: string;
    profile_picture?: string;
    total_games?:  number;
}


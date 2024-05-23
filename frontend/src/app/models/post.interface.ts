export interface Post {
    post_id?: number;
    content: string;
    votes?: number;
    user_email: string;
    community_id: number;
    liked_by?: string[];
    profile_picture?: string;
    username?: string;
}


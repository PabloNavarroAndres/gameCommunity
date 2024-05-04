export interface User {
    email:            string;
    username:         string;
    password:         string;
    profile_picture?: string;
    total_games?:     number;
    finished_games?:  number;
    desired_games?:   number;
    isAdmin?:         number;
}

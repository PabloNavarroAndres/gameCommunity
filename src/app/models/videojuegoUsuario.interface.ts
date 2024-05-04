export interface VideojuegoUsuario {
    game_id: number;
    user_email: string;
    title?: string;
    image?: string;
    status?: string;
    personal_comment?: string;
    rating?: number;
    mostrarDetalles?: boolean;
}

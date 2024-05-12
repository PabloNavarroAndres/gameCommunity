export interface VideojuegoUsuario {
    game_id: number;
    user_email: string;
    title?: string;
    image?: string;
    status?: string | null;
    personal_comment?: string | null;
    rating?: number | null;
    mostrarDetalles?: boolean;
}

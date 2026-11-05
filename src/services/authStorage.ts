const TOKEN_KALITI = "sartaroshxona_token";

export function tokenniSaqlash(token: string): void{
    localStorage.setItem(TOKEN_KALITI, token);
}

export function tokenniOqish(): string | null {
    return localStorage.getItem(TOKEN_KALITI);
}

export function tokenniTozalash(): void {
    localStorage.removeItem(TOKEN_KALITI);
}
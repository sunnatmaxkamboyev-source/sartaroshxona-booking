const TOKEN_KALITI = "sartaroshxona_token";

export function tokenniSaqlash(token: string): void {
  try {
    localStorage.setItem(TOKEN_KALITI, token);
  } catch (xato) {
    console.error("Tokenni saqlashda xato:", xato);
  }
}

export function tokenniOqish(): string | null {
  try {
    return localStorage.getItem(TOKEN_KALITI);
  } catch {
    return null;
  }
}

export function tokenniTozalash(): void {
  try {
    localStorage.removeItem(TOKEN_KALITI);
  } catch (xato) {
    console.error("Tokenni tozalashda xato:", xato);
  }
}
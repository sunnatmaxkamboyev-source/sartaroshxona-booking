import { sorovYuborish } from "./api";

export async function kirish(login: string, parol: string) {
  return sorovYuborish("/auth/kirish", {
    method: "POST",
    body: JSON.stringify({ login, parol }),
  });
}
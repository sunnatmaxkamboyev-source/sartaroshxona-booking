import type { Usta } from "../booking/types";

const KALIT = "sartaroshxona_usta";

export const STANDART_USTA: Usta = {
  ism: "Jasur Aliyev",
  lavozim: "Bosh sartarosh",
  avatarUrl: "",
};

export function ustaniSaqlash(usta: Usta): boolean {
  try {
    window.localStorage.setItem(KALIT, JSON.stringify(usta));
    return true;
  } catch (xato) {
    console.error("Usta ma'lumotini saqlashda xato:", xato);
    return false;
  }
}

export function ustaniOqish(): Usta {
  try {
    const xom = window.localStorage.getItem(KALIT);
    if (!xom) return STANDART_USTA;

    const parsed = JSON.parse(xom);
    return {
      ism: parsed.ism ?? STANDART_USTA.ism,
      lavozim: parsed.lavozim ?? STANDART_USTA.lavozim,
      avatarUrl: parsed.avatarUrl ?? "",
    };
  } catch (xato) {
    console.error("Usta ma'lumotini o'qishda xato:", xato);
    return STANDART_USTA;
  }
}
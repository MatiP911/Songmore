# https://songmore.netlify.app/

# Instrukcje

1. zainstalować git (https://git-scm.com/downloads)
    1+. zainstalować git cli (https://cli.github.com/)
2. Zainstalować pnpm (https://pnpm.io/installation)
3. zainstalować node.js (https://nodejs.org/en)
4. `git clone https://github.com/MatiP911/Songmore`
5. `git checkout dev`
6. `pnpm install`
7. trzeba stworzyć nowy plik `.env` i skopiować do niego zawartość `.env.example`   
`cp .env.example .env` (nie testowałem)
8. `pnpm exec next telemetry disable`
9. `pnpm run dev`

---

# Todo

- [] Dodać funkcjonalność wyszukiwania piosenke
    - [x] Dodaj funkcjonalnosc wyszukiwania
    - [x] pomijac to co w nawiasach by pominąć wszelkie remasterd i from i jakieś teksty samych piosenek
    - [] Wystarczy strzelić w poprawny tytuł piosenki i nadal akceptuje (nie zwraca uwagi na autora)
- [] Ulepszyć UI (bądź też zrobić od nowa)
   - [x] Ustandaryzować bloczki z poprzednimi strzałami (teraz przesuwa UI)
   - [] Dodać screen wygrania
- [] Dodać funkcjonalność wyboru playlist
   - [x] Oddzielną stronę wyboru
   - [] Inny system dla muzyki klasycznej - losowanie autora i wybór losowego utworu z `top_track`
   - [x] Możliwość wyboru customowej playlisty
   - [] Dodać opcje pobierania piosenek z wielu playlist
   - [] Osobny plik z danymi na gatunki i playlisty
- [] Dodać SEED do funkcji losowania piosenek, żeby móc grać też z kimś równolegle (np w formie linku)
- [] Dodać tryb(?) z rundami i podsumowaniem jak poszło
- [] Dodać slider głośności

- Naprawiać bugi (raczej tutaj już zakładka issue w github)

---

To zostawiam bo może sie przyda

# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

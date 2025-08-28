# https://songmore.netlify.app/

## deploying for dev
> prerequsits git, [pnpm](https://pnpm.io/installation), [node.js](https://nodejs.org/en)

```
git clone https://github.com/MatiP911/Songmore
git checkout dev
pnpm install
pnpm exec next telemetry disable #optional
pnpm run dev
```


# Todo
- [] Dodać funkcjonalność wyszukiwania piosenke
    - [x] Dodaj funkcjonalnosc wyszukiwania
    - [x] pomijac to co w nawiasach by pominąć wszelkie remasterd i from i jakieś teksty samych piosenek
    - [] Wystarczy strzelić w poprawny tytuł piosenki i nadal akceptuje (nie zwraca uwagi na autora)
- [] Ulepszyć UI (bądź też zrobić od nowa)
   - [x] Ustandaryzować bloczki z poprzednimi strzałami (teraz przesuwa UI)
   - [x] Dodać screen wygrania
- [] Dodać funkcjonalność wyboru playlist
   - [x] Oddzielną stronę wyboru
   - [] Inny system dla muzyki klasycznej - losowanie autora i wybór losowego utworu z `top_track`
   - [x] Możliwość wyboru customowej playlisty
   - [] Dodać opcje pobierania piosenek z wielu playlist
   - [] Osobny plik z danymi na gatunki i playlisty
- [x] Dodać SEED do funkcji losowania piosenek, żeby móc grać też z kimś równolegle (np w formie linku)
   - [] Dodać -coś- żeby po wysłaniu linku wybrany byl odpowiedni gatunek (nowy parametr? zakodować w seedzie?)
- [] Dodać tryb(?) z rundami i podsumowaniem jak poszło
- [x] Dodać slider głośności

- Naprawiać bugi (raczej tutaj już zakładka issue w github)
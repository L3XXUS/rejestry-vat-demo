# Rejestry i VAT — demo prototype

Przeprojektowany ekran „Obszary księgowe" oraz „Rejestry i VAT" (sprzedaż / zakupy).
React + TypeScript + Vite, bez zewnętrznych bibliotek UI. Dane wyłącznie demonstracyjne.

## Uruchomienie
```
npm install
npm run dev      # tryb deweloperski
npm run build    # build produkcyjny do dist/
```

## Stany demo
Przełącznik „Stan" w prawym dolnym rogu: **Dane / Pusto / Błąd** (albo `?state=empty`, `?state=error`).

## Gdzie co jest ukryte
- Filtry (rodzaj operacji, kod JPK V7, etykiety, serie dokumentów) → przycisk „Filtry"
- Rok / miesiąc → selektor okresu
- Pobierz (CSV), Drukuj, Etykiety, Kolumny i widok → menu „Akcje"
- Szczegóły wiersza i akcje (Podgląd, KSeF, Kopiuj ID, PDF, etykiety) → strzałka przy wierszu

## Adaptacja
- desktop: menu boczne (do zwinięcia), tabela
- tablet: wąski pasek z ikonami
- telefon (iPhone SE): dolna nawigacja, karty zamiast tabeli, okna jako arkusze od dołu

## Deploy (Vercel)
Import repozytorium z GitHub → framework Vite wykrywa się sam
(build: `npm run build`, output: `dist`). Zmienne środowiskowe nie są potrzebne.

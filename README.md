# Your English Coach Theme

WordPress theme dla Your English Coach. Nowoczesny build system oparty na Vite i Sass, umożliwiający szybki development z live deploy.

## 📋 Wymagania

- **Node.js**: 16.x lub wyżej (testowane na 16.13.2)
- **npm**: 8+
- **WordPress**: 5.0+
- **SFTP**: skonfigurowany dla live deploy (opcjonalnie)

### Uwaga o wersjach
- Projekt używa **Vite 4.5.14** dla kompatybilności z Node 16
- Vite 8+ wymaga Node 20.19+ lub 22.12+

## 🚀 Instalacja

```bash
npm install
```

## 💻 Development (Live Editing)

### 1. Uruchom Vite watch mode:
```bash
npm run dev
```

Vite będzie obserwować zmiany w `src/scss/` i `src/js/`, automatycznie budując do `dist/`.

Output:
```
VITE v4.5.14  ready in 287 ms

  ➜  Local:   http://127.0.0.1:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### 2. Uploaduj zmiany na serwer (SFTP):

- `Cmd+Shift+P` → `SFTP: Upload Project`
- Selectuj folder `dist/` lub użyj `SFTP: Upload Folder`

Terminal `npm run dev` pozostaw otwarty w tle.

### 3. Odśwież WordPress:
- Otwórz stronę w przeglądarce
- `Cmd+R` (lub F5) aby załadować nowe CSS/JS

---

**Workflow podsumowanie:**
```
1. Edytujesz src/scss/main.scss lub src/js/main.js
          ↓
2. Vite automatycznie buduje do dist/
          ↓
3. SFTP uploaduje dist/ na serwer
          ↓
4. Odświeżasz stronę w przeglądarce
```

## 🏗️ Production build

```bash
npm run build
```

Fiksuje i zoptymalizuje wszystkie asseты do `dist/` — gotowe do deployment.

## 📁 Struktura projektu

```
.
├── src/
│   ├── js/
│   │   └── main.js           # Główny plik JavaScript
│   └── scss/
│       └── main.scss         # Główne style (Sass)
├── dist/                     # 📤 Build output (uploaduj to na serwer)
│   ├── js/
│   │   └── main.js
│   └── assets/
│       └── main.css
├── functions.php             # WordPress hook'i (enqueue assetów)
├── header.php                # Nagłówek tematu
├── footer.php                # Stopka tematu
├── index.php                 # Główny template
├── style.css                 # Metadane tematu
├── vite.config.js            # Konfiguracja Vite
└── package.json              # Zależności Node
```

## ⚙️ Konfiguracja

### Vite Config (`vite.config.js`)
- Build output: `dist/`
- Entry point: `src/js/main.js`
- CSS output: `dist/assets/main.css`

### WordPress Enqueue (`functions.php`)
```php
wp_enqueue_style('yec-main-css', '/dist/assets/main.css', [], filemtime(...));
wp_enqueue_script('yec-main-js', '/dist/js/main.js', [], filemtime(...), true);
```

Funkcja `filemtime()` zapewnia cache busting — WordPress załaduje nową wersję po każdej budowie.

## 🆘 Troubleshooting

### „CustomEvent is not defined"
- Wynika z Node < 20 i Vite 8+
- **Rozwiązanie**: Projekt używa Vite 4.5.14 — problem nie powinien się pojawić

### Zmiany nie widać na stronie
1. Sprawdź czy `npm run dev` uruchomiony
2. Sprawdź czy `dist/` uploadowany na serwer (SFTP)
3. Ośwież cache przeglądarki: `Cmd+Shift+R` (hard refresh)
4. Sprawdź console: `F12` → Console czy brak błędów

### SFTP nie uploaduje
- Sprawdź czy `.vscode/extensions` ma skonfigurowaną konfigurację SFTP
- Użyj `SFTP: Edit Configuration` i sprawdź host, username, password
- Testuj: `SFTP: Connect` przed uploadem

## 📚 Dodatkowe zasoby

- [Vite docs](https://vitejs.dev/)
- [Sass docs](https://sass-lang.com/documentation)
- [WordPress Theme Development](https://developer.wordpress.org/themes/)

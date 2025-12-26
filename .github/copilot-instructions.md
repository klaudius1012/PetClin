# PetHosp AI Coding Guidelines

## Overview

PetHosp is a veterinary hospital management system built with Node.js/Express backend and vanilla JavaScript frontend. It uses file-based JSON storage instead of a database for simplicity.

## Architecture

- **Backend**: Express server (`JS/server.js`) serves static files and provides a PUT endpoint for updating `DATA/tutores.json`.
- **Frontend**: HTML pages (`home.html`, `login.html`, `cadastro_tutor.html`) with client-side routing via JavaScript.
- **Data**: JSON files in `DATA/` directory (e.g., `tutores.json` array of tutor objects).
- **Auth**: Mock users in `JS/auth.js`, session-based via `sessionStorage`.
- **Structure**: Separate folders for CSS, JS, DATA, img. Server serves from `JS/` directory root.

## Key Workflows

- **Start Server**: `npm start` (runs `node JS/server.js`), access at `http://localhost:3000/home.html`.
- **Add/Edit Tutors**: Use `cadastro_tutor.html` form, validates CPF uniqueness, sends PUT to `/DATA/tutores.json`.
- **View Data**: Fetch `DATA/tutores.json` via client-side `fetch()` for display.
- **Debug**: Use browser dev tools; no build step, direct file editing.

## Conventions

- **Language**: Portuguese (UI text, variable names like `tutores`, `nome`).
- **Data Format**: Tutor objects: `{nome, cpf, endereco, bairro, cidade, telefone, nascimento}`.
- **Auth Check**: Always check `obterUsuarioLogado()` in JS files for protected pages.
- **File Paths**: Static assets referenced relatively (e.g., `CSS/home.css`).
- **Error Handling**: Basic try/catch for fetch, console.error logging.

## Examples

- **Loading Tutors**: `const tutores = await fetch('DATA/tutores.json').then(r => r.json());`
- **Saving Data**: `fetch('/DATA/tutores.json', {method: 'PUT', body: JSON.stringify(data)});`
- **View Switching**: Use `classList.add('hidden')` to toggle article elements in `home.html`.

Reference: `JS/home.js` for view management, `JS/cadastro.js` for form handling.

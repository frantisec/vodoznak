# Technologie - Vodoznak

**Poslední aktualizace:** 2024-12-19

## Frontend Framework
- **React**: ^19.2.0
  - Hlavní framework pro UI komponenty
  - Používá React Hooks (useState, useEffect, useRef, useImperativeHandle)
  
- **React DOM**: ^19.2.0
  - Rendering React komponent do DOM

## Routing
- **React Router DOM**: ^7.9.6
  - Client-side routing
  - Používá BrowserRouter, Routes, Route
  - Navigace mezi `/` a `/arandur`

## Build Tools
- **Vite**: ^7.2.2
  - Build tool a dev server
  - Rychlý HMR (Hot Module Replacement)
  
- **@vitejs/plugin-react**: ^5.1.0
  - Vite plugin pro React podporu

## UI Libraries
- **react-rnd**: ^10.5.2
  - Drag & resize funkcionalita pro vodoznak
  - Umožňuje uživateli přesouvat a měnit velikost vodoznaku
  - Zachovává aspect ratio

## Development Tools
- **ESLint**: ^9.39.1
  - Linting kódu
  - Konfigurace v eslint.config.js
  
- **@eslint/js**: ^9.39.1
  - ESLint JavaScript konfigurace

- **eslint-plugin-react-hooks**: ^7.0.1
  - Pravidla pro React Hooks

- **eslint-plugin-react-refresh**: ^0.4.24
  - Podpora pro React Fast Refresh

- **globals**: ^16.5.0
  - Globální proměnné pro ESLint

- **TypeScript types**: 
  - @types/react: ^19.2.2
  - @types/react-dom: ^19.2.2
  - Type definice pro TypeScript podporu

## Analytics & Monitoring
- **@vercel/speed-insights**: ^1.2.0
  - Monitoring výkonu aplikace na Vercel

## Web APIs
- **Canvas API**
  - Export obrázků v plné kvalitě
  - Vykreslování vodoznaku na canvas
  - Používá getContext('2d')
  
- **FileReader API**
  - Načítání souborů z uživatelského zařízení
  - Konverze na Data URL (base64)
  - Asynchronní zpracování

- **Font Loading API**
  - Načítání custom fontů (Grenze Gotisch)
  - document.fonts.ready pro Arandur vodoznak

## Styling
- **CSS Custom Properties**
  - CSS proměnné pro theming
  - Arandur brand colors
  
- **CSS Grid & Flexbox**
  - Layout a positioning

## Deployment
- **Vercel**
  - Hosting platforma
  - Konfigurace v vercel.json
  - SPA routing rewrite rules

## Fonts
- **Inter**: Sans-serif font pro UI
- **Grenze Gotisch**: Serif font pro Arandur branding
  - Načítá se přes @font-face nebo Google Fonts


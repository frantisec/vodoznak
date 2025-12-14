# Architektura projektu - Vodoznak

**Poslední aktualizace:** 2025-12-14

## Struktura projektu

```
Vodoznak/
├── src/
│   ├── pages/
│   │   ├── Home.jsx          # Standardní režim s vlastním vodoznakem
│   │   └── Arandur.jsx       # Arandur mód s přednastaveným logem
│   ├── components/
│   │   ├── ImageUploader.jsx # Komponenta pro nahrávání obrázků
│   │   ├── WatermarkEditor.jsx # Editor s drag & resize funkcionalitou
│   │   └── CornerWatermarkEditor.jsx # Editor pro corner mód s pevnými pozicemi
│   ├── styles/
│   │   └── index.css         # Kompletní styling (glassmorphism design)
│   ├── assets/
│   │   └── react.svg         # React logo asset
│   ├── App.jsx               # Hlavní routing komponenta
│   ├── App.css               # Základní App styly
│   └── main.jsx              # Entry point aplikace
├── public/                   # Statické assets
│   ├── *.svg, *.png          # Ikony a obrázky pro Arandur vodoznak
│   └── vite.svg
├── dist/                     # Build output
├── docs/                     # Dokumentace
├── .cursorrules              # Cursor AI pravidla
├── vercel.json               # Vercel konfigurace
├── vite.config.js            # Vite konfigurace
├── eslint.config.js          # ESLint konfigurace
├── package.json              # Dependencies a scripts
└── README.md                 # Hlavní dokumentace
```

## Komponenty

### App.jsx
**Účel:** Hlavní routing komponenta  
**Závislosti:** react-router-dom  
**Routes:**
- `/` → Home komponenta
- `/arandur` → Arandur komponenta

### Home.jsx
**Účel:** Standardní režim aplikace  
**Workflow:**
1. Uživatel nahraje hlavní fotografii
2. Uživatel nahraje vlastní vodoznak (PNG/SVG/JPEG)
3. WatermarkEditor umožní úpravu pozice a velikosti
4. Export výsledku

**State management:**
- `baseImage` - Data URL hlavní fotografie
- `watermarkImage` - Data URL vodoznaku

**Komponenty:**
- ImageUploader (2x - pro foto a vodoznak)
- WatermarkEditor

### Arandur.jsx
**Účel:** Speciální mód pro Arandur branding  
**Funkce:**
- Drag & drop nahrávání fotografie
- Volba módu (Text/Corner)
- Volba barvy textu (bílá/černá) - pouze v text módu
- Automatické generování Arandur vodoznaku (text mód)
- Corner mód s 5 vodoznaky na pevných pozicích
- Rychlý export

**State management:**
- `baseImage` - Data URL fotografie
- `watermarkMode` - 'text' nebo 'corner'
- `textColor` - 'white' nebo 'black' (pouze v text módu)
- `isDragging` - stav drag & drop
- `showDownloadSuccess` - notifikace o stažení

**Refs:**
- `fileInputRef` - reference na file input
- `watermarkEditorRef` - reference na WatermarkEditor nebo CornerWatermarkEditor pro imperativní volání

**Komponenty:**
- WatermarkEditor (text mód)
- CornerWatermarkEditor (corner mód)

### ImageUploader.jsx
**Účel:** Univerzální komponenta pro nahrávání obrázků  
**Props:**
- `onUpload` - callback s Data URL
- `label` - text tlačítka
- `accept` - přijatelné MIME typy

**Funkce:**
- FileReader API pro načítání
- Konverze na Data URL
- Validace typu souboru

### WatermarkEditor.jsx
**Účel:** Hlavní editor komponenta s drag & resize  
**Props:**
- `baseImage` - Data URL hlavní fotografie (required)
- `watermarkImage` - Data URL vodoznaku (optional, pro standardní režim)
- `textColor` - 'white' nebo 'black' (pro Arandur mód)
- `onReset` - callback pro reset
- `ref` - pro imperativní volání download metody

**Funkce:**
- Drag & resize pomocí react-rnd
- Zachování aspect ratio (načteno z PNG souboru)
- Automatické umístění do levého dolního rohu
- Canvas API export v plné kvalitě
- Jednotný přístup pro všechny vodoznaky (PNG obrázky)

**Watermark zdroje:**
- Standardní režim: uživatelem nahraný vodoznak (`watermarkImage` prop)
- Arandur mód: PNG soubory `/arandur-light.png` nebo `/arandur-dark.png` podle `textColor`

**State management:**
- `watermarkState` - pozice a velikost vodoznaku
- `watermarkAspectRatio` - poměr stran načtený z PNG souboru

**Refs:**
- `baseImageRef` - reference na img element pro naturalWidth/Height
- `watermarkRef` - reference na watermark img element
- `watermarkImageRef` - ref pro synchronizaci watermarkImage prop
- `positionInitializedRef` - flag pro inicializaci pozice

**Export logika:**
1. Vytvoří canvas s naturalWidth/Height základní fotografie
2. Vykreslí základní fotografii
3. Vypočítá scale faktor mezi zobrazenou a skutečnou velikostí
4. Načte vodoznak PNG (buď nahraný nebo Arandur)
5. Vykreslí vodoznak pomocí `ctx.drawImage()` s proper scaling
6. Exportuje jako PNG

### CornerWatermarkEditor.jsx
**Účel:** Editor pro corner mód s automatickým umístěním 5 vodoznaků  
**Props:**
- `baseImage` - Data URL hlavní fotografie (required)
- `onReset` - callback pro reset
- `ref` - pro imperativní volání download metody

**Funkce:**
- Automatické umístění 5 vodoznaků na pevné pozice:
  - `logo-TL.png` → levý horní roh
  - `star-TR.png` → pravý horní roh
  - `helmet-BL.png` → levý spodní roh
  - `tree-BR.png` → pravý spodní roh
  - `napis.png` → vycentrován na spodek
- Použití původní velikosti PNG souborů pro rohové vodoznaky, napis.png se škáluje na 30% šířky základního obrázku
- Canvas API export v plné kvalitě se všemi vodoznaky

**State management:**
- `watermarkSizes` - velikosti a aspect ratio jednotlivých vodoznaků
- `baseImageSize` - zobrazená velikost základní fotografie

**Refs:**
- `baseImageRef` - reference na img element pro naturalWidth/Height

**Export logika:**
1. Vytvoří canvas s naturalWidth/Height základní fotografie
2. Vykreslí základní fotografii
3. Vypočítá scale faktor mezi zobrazenou a skutečnou velikostí
4. Načte všechny 5 vodoznaků paralelně
5. Vykreslí každý vodoznak na správné pozici pomocí `ctx.drawImage()` s proper scaling
6. Exportuje jako PNG

## Routing
- `/` - Standardní režim (Home.jsx)
- `/arandur` - Arandur mód (Arandur.jsx)
- SPA routing přes React Router
- Vercel rewrite rules pro SPA

## Styling architektura

### CSS Custom Properties
Definovány v `:root`:
- Barvy (bg, surface, border, text)
- Stíny (shadow-sm, shadow-md)
- Border radius
- Arandur brand colors

### Komponenty styling
- `.arandur-*` - Arandur mód specifické styly
- `.upload-*` - Upload komponenty
- `.editor-*` - Editor workspace
- `.react-rnd` - Drag & resize styly

### Design systém
- Glassmorphism efekt
- Responzivní breakpoints
- Smooth transitions
- Hover states

## Data flow

### Standardní režim:
```
User → ImageUploader → FileReader → Data URL → Home state → WatermarkEditor → Canvas → Download
```

### Arandur mód:
**Text mód:**
```
User → Drag & Drop → FileReader → Data URL → Arandur state → WatermarkEditor → Canvas (s PNG vodoznakem) → Download
```

**Corner mód:**
```
User → Drag & Drop → FileReader → Data URL → Arandur state → CornerWatermarkEditor → Canvas (s 5 PNG vodoznaky) → Download
```

**Poznámka:** 
- Text mód používá připravené PNG soubory (`arandur-light.png`, `arandur-dark.png`) místo dynamického generování
- Corner mód používá 5 PNG souborů (`logo-TL.png`, `star-TR.png`, `helmet-BL.png`, `tree-BR.png`, `napis.png`) umístěných na pevné pozice
- Oba módy zajišťují konzistenci mezi preview a exportem

## Bezpečnost
- Vše se zpracovává lokálně v prohlížeči
- Žádné odesílání dat na server
- FileReader API pro lokální načítání
- Canvas API pro lokální export


# Kontext a rozhodnutí - Vodoznak

**Poslední aktualizace:** 2024-12-14

## Důležitá rozhodnutí

### Proč Canvas API pro export?
**Rozhodnutí:** Použití Canvas API místo jednoduchého overlay  
**Důvod:**
- Umožňuje export v původním rozlišení fotografie
- Vše se zpracovává lokálně v prohlížeči (bezpečnost a rychlost)
- Žádné odesílání dat na server
- Plná kontrola nad kvalitou výstupu

**Implementace:**
- Vytvoření canvas s naturalWidth/Height základní fotografie
- Výpočet scale faktoru mezi zobrazenou a skutečnou velikostí
- Proper scaling vodoznaku při exportu

### Proč react-rnd pro drag & resize?
**Rozhodnutí:** Použití react-rnd knihovny  
**Důvod:**
- Poskytuje robustní drag & resize funkcionalitu
- Zachovává aspect ratio vodoznaku automaticky
- Smooth uživatelské rozhraní
- Snadná integrace s React

**Alternativy zvažované:**
- Vlastní implementace (příliš komplexní)
- react-draggable + react-resizable (více komponent)

### Proč dva režimy (Standardní vs Arandur)?
**Rozhodnutí:** Oddělení standardního režimu a Arandur módu  
**Důvod:**
- Standardní režim: maximální flexibilita pro různé vodoznaky
- Arandur mód: rychlá práce s brandingem, přednastavené hodnoty
- Různé UX flow pro různé use cases
- Snadnější údržba a rozvoj

**Implementace:**
- Dva samostatné routes (`/` a `/arandur`)
- Sdílená WatermarkEditor komponenta s podmíněnou logikou
- Různé UI pro každý režim

### Proč Data URL místo File objektů?
**Rozhodnutí:** Ukládání obrázků jako Data URL v state  
**Důvod:**
- Snadné zobrazení v `<img>` elementech
- Kompatibilita s Canvas API
- Jednoduchý state management
- Žádná potřeba FileReader po načtení

**Nevýhody:**
- Větší velikost v paměti (base64 encoding)
- Ale pro tento use case přijatelné

### Proč forwardRef v WatermarkEditor?
**Rozhodnutí:** Použití forwardRef pro imperativní download  
**Důvod:**
- Arandur mód potřebuje volat download z parent komponenty
- Lepší než prop drilling callbacks
- Standardní React pattern pro imperativní API

### Proč PNG soubory pro Arandur vodoznak?
**Rozhodnutí:** Použití připravených PNG souborů místo dynamického generování  
**Důvod:**
- Konzistence mezi preview a exportem (pixel-perfect)
- Jednodušší kód - jednotný přístup pro všechny vodoznaky
- Správný poměr stran načtený přímo z obrázku
- Snadná změna vodoznaku v budoucnu (stačí vyměnit PNG)

**Implementace:**
- `/arandur-light.png` - bílý text pro tmavé pozadí
- `/arandur-dark.png` - černý text pro světlé pozadí
- Výběr podle `textColor` prop
- Zobrazení i export používají stejný PNG soubor

**Předchozí řešení (odstraněno):**
- HTML/CSS s `transform: scale()` pro preview
- Canvas API s ručním kreslením textu a obrázků pro export
- Způsobovalo vizuální nekonzistenci

### Proč automatické umístění do levého dolního rohu?
**Rozhodnutí:** Inicializace pozice vodoznaku automaticky  
**Důvod:**
- Standardní umístění vodoznaku
- Uživatel může přesunout, ale má rozumnou výchozí pozici
- Lepší UX než umístění na (0,0)

**Implementace:**
- useEffect sleduje načtení baseImage
- Výpočet pozice na základě výšky obrázku
- Respektuje padding v Arandur módu

## Historie změn

### 2024-12-14
- Sjednocení Arandur vodoznaku pomocí PNG souborů
- Odstranění HTML/CSS a canvas generování vodoznaku
- Zajištění konzistence mezi preview a exportem
- Oprava zachování poměru stran při změně velikosti

### 2024-12-19
- Inicializace dokumentační struktury
- Vytvoření automatických dokumentačních pravidel
- Zdokumentování současného stavu projektu


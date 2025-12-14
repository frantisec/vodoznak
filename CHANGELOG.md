# Changelog

Všechny významné změny v projektu budou zdokumentovány v tomto souboru.

Formát je založen na [Keep a Changelog](https://keepachangelog.com/cs/1.0.0/),
a tento projekt se drží [Semantic Versioning](https://semver.org/lang/cs/).

## [Unreleased]

### Added
- Corner mód v Arandur módu - automatické umístění 5 vodoznaků na pevné pozice (logo-TL.png, star-TR.png, helmet-BL.png, tree-BR.png, napis.png) - 2025-12-14 19:40
- Nová komponenta CornerWatermarkEditor.jsx pro corner mód - 2025-12-14 19:40
- Výběr módu (Text/Corner) v Arandur módu - 2025-12-14 19:40

### Changed
- Corner mód - rohové vodoznaky se zobrazují v původní velikosti PNG souborů, napis.png se škáluje na 30% šířky základního obrázku - 2025-12-14 19:46

### Fixed
- Oprava inicializace pozice vodoznaku v WatermarkEditor - vodoznak se nyní správně umístí do levého dolního rohu i když se načte před základním obrázkem nebo když se změní textColor před načtením základního obrázku - 2025-12-14 19:50

### Changed
- Arandur.jsx - přidán výběr mezi text a corner módem - 2025-12-14 19:40
- CSS styly - přidány styly pro mode selector - 2025-12-14 19:40

## [0.1.0] - 2024-12-14

### Changed
- Sjednocení Arandur vodoznaku - použití PNG souborů (arandur-light.png, arandur-dark.png) místo HTML/CSS a canvas generování - 2024-12-14 18:30
- Konzistence mezi preview a exportem vodoznaku v Arandur módu - 2024-12-14 18:30
- Zjednodušení WatermarkEditor.jsx - jednotný přístup pro všechny vodoznaky - 2024-12-14 18:30
- Odstranění paddingu pro Arandur mód - vodoznak se nyní zobrazuje přímo bez vnitřního odsazení - 2024-12-14 18:30

### Fixed
- Vodoznak v Arandur módu nyní odpovídá nahranému PNG souboru - 2024-12-14 18:30
- Správný poměr stran při změně velikosti vodoznaku - načítá se z PNG souboru - 2024-12-14 18:30

## [0.0.0] - 2024-12-19

### Added
- Standardní režim s vlastním vodoznakem - 2024-12-19
- Arandur mód s přednastaveným logem - 2024-12-19
- Drag & resize funkcionalita pro vodoznak - 2024-12-19
- Export v plné kvalitě pomocí Canvas API - 2024-12-19
- Responzivní design s glassmorphism UI - 2024-12-19
- Routing mezi standardním a Arandur režimem - 2024-12-19
- Volba barvy textu v Arandur módu (bílá/černá) - 2024-12-19
- Drag & drop nahrávání v Arandur módu - 2024-12-19
- Automatické umístění vodoznaku do levého dolního rohu - 2024-12-19
- Notifikace o úspěšném stažení - 2024-12-19
- Zachování původního rozlišení při exportu - 2024-12-19
- Podpora PNG, SVG, JPEG formátů pro vodoznaky - 2024-12-19
- Vercel deployment konfigurace - 2024-12-19

### Documentation
- Vytvoření dokumentační struktury (`docs/`) - 2024-12-19 14:30
- Automatická dokumentační pravidla (`.cursorrules`) - 2024-12-19 14:30
- STATUS.md - aktuální stav projektu - 2024-12-19 14:30
- TECHNOLOGY.md - použité technologie - 2024-12-19 14:30
- ARCHITECTURE.md - architektura projektu - 2024-12-19 14:30
- CONTEXT.md - kontext a rozhodnutí - 2024-12-19 14:30
- CHANGELOG.md - historie změn - 2024-12-19 14:30


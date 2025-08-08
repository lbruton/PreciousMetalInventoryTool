# LLM Development Guide — Precious Metals Inventory Tool

> **CRITICAL**: Keep all documentation in sync with code updates.  
>  
> **LLM INSTRUCTION**: After any code change, verify and update these files:  
> ```  
> docs/README.md      — User guidance, features, installation, contribution  
> docs/LLM.md         — This AI assistant guide (you are here)  
> docs/CHANGELOG.md   — Version history with dates and notes  
> docs/STATUS.md      — Current status and feature coverage  
> docs/STRUCTURE.md   — Project folder and file organization  
> docs/VERSIONING.md  — Version management strategy  
> ```

---

## 1. Purpose

Provide AI assistants (LLMs) a concise, up-to-date overview of the **Precious Metals Inventory Tool v3.1.10** to guide development, documentation, and QA tasks.

## 2. Project Snapshot

- **App Type**: Client-side web application (no backend)  
- **Metals**: Silver, Gold, Platinum, Palladium  
- **Key Features**:  
  - Manual spot-price overrides (Add/Reset with Save/Cancel popups)  
  - Inventory management (storage locations, optional notes, collectable flag)  
  - Multi-format import/export (CSV, JSON, Excel, PDF, HTML)  
  - **Comprehensive backup ZIP system** with all data formats and restoration guides
  - Responsive & accessible UI (mobile-first, ARIA, keyboard support)  
  - Modular JS architecture (constants, state, events, utils, inventory)  
- **Version**: 3.1.10 (file cleanup and maintenance)
- **Last Updated**: August 8, 2025  

## 3. Project Structure

PreciousMetalInventoryTool/
├── app/
│   ├── index.html
│   ├── css/styles.css
│   └── js/
│       ├── constants.js      # APP_VERSION, storage keys, configs
│       ├── state.js          # Global state & DOM caching
│       ├── events.js         # UI event listeners
│       ├── utils.js          # Helper functions
│       ├── inventory.js      # CRUD operations, import/export, backup ZIP
│       ├── search.js         # Search and filtering
│       ├── sorting.js        # Table sorting
│       ├── pagination.js     # Pagination controls
│       ├── charts.js         # Chart.js integration
│       ├── theme.js          # Dark/light theme
│       ├── spot.js           # Spot price management
│       ├── detailsModal.js   # Analytics modal
│       └── init.js           # Application initialization
├── docs/
│   ├── CHANGELOG.md
│   ├── STRUCTURE.md
│   ├── VERSIONING.md
│   ├── STATUS.md
│   ├── LLM.md               # (this file)
│   └── README.md
└── sample.csv

## 4. Architecture & Design

- **Modular Design**: One JS module per responsibility  
- **State Management**: `state.js` caches DOM and tracks app data  
- **Event-Driven**: `events.js` handles all UI interactions  
- **Data Storage**: LocalStorage persists inventory and overrides  
- **Styling**: Responsive CSS with mobile-first breakpoints  
- **Accessibility**: ARIA labels, keyboard navigation, focus management  
- **Versioning**: Single source of truth in `constants.js`  

## 5. Core Considerations

1. **Spot-Price Overrides**  
   - Handlers: `addSpotPrice()`, `resetSpotPrice()` in `events.js`  
   - Persistence: LocalStorage + API sync cache in `importExport.js`  
2. **Data Integrity & Migration**  
   - Default values for new fields  
   - Seamless LocalStorage migrations  
3. **Performance**  
   - Efficient DOM reuse in `renderTable()` for large inventories  
4. **UI Consistency**  
   - Popup and table styling align with existing design  
   - Follow utility-class conventions (e.g., Tailwind-like)  
5. **Import/Export Schema**  
   - Ensure all fields (notes, storage, overrides) are serialized/deserialized  

## 6. v3.1.x Family Highlights

- **v3.1.10 - Project Maintenance**:
  - Removed orphaned backup and debug files for cleaner project structure
  - Streamlined codebase by eliminating unused development artifacts
  - Enhanced maintainability through file cleanup

- **v3.1.9 - UI Consistency**:
  - Added `--info` CSS variable for theming
  - Clear Cache button styling improvements across themes

- **v3.1.8 - Backup System**:
  - Comprehensive ZIP backup functionality with restoration guides
  - Multiple export formats in single archive

---

*End of LLM Development Guide.*
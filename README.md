# Vakantie Planner

Persoonlijke reisgids met echte weersdata, AI-tips op basis van het weer, en navigatie.

## Functies
- **Weer**: Actuele data via Open-Meteo (gratis, geen API key nodig)
- **AI Tips**: Weersgerichte reistips + chatbot via Claude (Anthropic)
- **Navigatie**: OpenStreetMap + Google Maps deep links

## Deployen naar Netlify

### 1. Repository aanmaken
Upload deze bestanden naar een GitHub repository (of gebruik Netlify CLI).

### 2. Netlify verbinden
- Ga naar [netlify.com](https://netlify.com) → "Add new site" → "Import from Git"
- Kies je repository
- Build command: *(leeg laten)*
- Publish directory: `.`

### 3. API Key instellen
- Ga in Netlify naar: **Site settings → Environment variables**
- Voeg toe: `ANTHROPIC_API_KEY` = jouw Anthropic API key
- Haal je key op via: [console.anthropic.com](https://console.anthropic.com)

### 4. Deployen
Klik "Deploy site" — klaar! 🎉

## Bestandsstructuur
```
vakantie-app/
├── index.html                    # Frontend
├── netlify.toml                  # Netlify config
├── netlify/
│   └── functions/
│       └── tips.js               # Serverless function (Claude API)
└── README.md
```

## Lokaal testen
Installeer Netlify CLI:
```bash
npm install -g netlify-cli
netlify dev
```
Maak een `.env` bestand aan:
```
ANTHROPIC_API_KEY=sk-ant-...
```

# Beyond the Report — PhD Research Website (V3)

A professor-focused website for Imen Zarai's proposed doctoral research with Prof. Dr. Christian Kruse.

## What's different
- Research alignment with Prof. Kruse's verified fields and DiNaOpt4KMU / WILMA work
- One accessible SME energy example and adjustable illustrative prediction uncertainty
- Click-through five-step architecture
- Detailed interactive 36-month Gantt roadmap
- Realistic research questions and evaluation criteria
- Personal academic background and a concise request for a meeting about a **funded** doctoral research position
- Mobile responsive and no build process needed

## Vercel upload
1. Extract the ZIP.
2. In Vercel, create a **new project** (Other / no framework) and deploy the project folder, or add its files to a GitHub repo and connect that repo to Vercel.
3. Vercel settings: Framework Preset = Other, Output Directory = blank/default, Build Command = blank/default.
4. Your homepage is `index.html`. No environment variables or backend required.

## Locally
Open `index.html` directly in a browser or serve locally with `python -m http.server 8000`.

## Source accuracy
Primary public project and professor information linked inside the site:
- https://www.w-hs.de/service/informationen-zur-person/person/kruse/
- https://www.w-hs.de/win/forschungsprojekt-dinaopt4kmu/wilma-tool-fuer-die-durchfuehrung-einer-doppelten-wesentlichkeitsanalyse/
- https://www.w-hs.de/win/forschungsprojekt-dinaopt4kmu/neuigkeiten/

The forecast visualization is explicitly a concept illustration, not empirical model output. Any proposed collaboration, PhD supervision, SME data access or funding is unconfirmed.

## Files
- `index.html` — content and semantics
- `style.css` — responsive visual design
- `script.js` — interactions and Gantt chart

## V3: scientific value and app demonstrator
- `upgrade.css` adds the fully responsive EcoPilot AI application and comparison sections.
- `prototype.js` powers 5 interactive screens (Overview, Predictive AI, Data Quality, Explainability, Decision Lab).
- Scenario selectors modify synthetic energy forecasts and the sample uncertainty display. This is **front-end simulation only**, not a trained model or measured economic benefit.
- A before/after research comparison and three testable contributions explain novelty, evaluation and potential SME value.
- No API key, database, login or backend is required. The frontend can deploy as a static site.

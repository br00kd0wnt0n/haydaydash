# Hay Day: Player Value & Growth Dashboard

A strategic campaign planning dashboard for Supercell's Hay Day mobile game. Built for pitch presentations, this tool models player value, campaign ROI, and channel allocation scenarios.

## Features

- **Strategy Focus Selection**: Choose between three strategic approaches:
  - 🌾 Welcome Back to the Farm (Lapsed Reactivation)
  - ⚖️ Balanced Harvest (Mixed Approach)
  - 🌱 New Neighbors (New Player Acquisition)

- **Interactive Campaign Planning**:
  - Budget slider (€500K - €2M)
  - Channel allocation with linked sliders
  - Regional split (US, Germany, Rest of World)
  - Campaign timing toggle (June Birthday vs Steady State)

- **Real-time Projections**:
  - Campaign projection chart with scenarios
  - Player value calculator with ROI
  - Channel efficiency breakdown
  - Social growth forecast

- **Scenario Comparison**: Side-by-side comparison of all three strategies

- **AI Strategy Assessment**: AI-powered recommendations (requires OpenAI API key)

- **Under the Hood**: Full transparency on data sources, assumptions, and formulas

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite build tool
- Tailwind CSS
- Recharts for data visualization

### Backend
- FastAPI (Python)
- SQLAlchemy + PostgreSQL
- OpenAI API integration

## Quick Start

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn app:app --reload
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
DATABASE_URL=postgresql://user:password@host:port/database
OPENAI_API_KEY=sk-...  # Optional
```

## Deployment

### Railway

1. Connect your repository to Railway
2. Add PostgreSQL database
3. Set environment variables:
   - `DATABASE_URL` (auto-populated by Railway)
   - `OPENAI_API_KEY` (optional)

The `railway.json` configuration handles the build and deployment automatically.

### Docker

```bash
docker build -t hayday-dashboard .
docker run -p 8000:8000 hayday-dashboard
```

## Project Structure

```
hayday-dashboard/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InputPanel/      # Strategy, budget, channel controls
│   │   │   ├── OutputPanel/     # Charts, calculator, AI assessment
│   │   │   ├── ScenarioComparison/
│   │   │   ├── UnderTheHood/    # Data sources, formulas
│   │   │   └── shared/          # Card, Tooltip, SliderInput
│   │   ├── hooks/               # useCalculations, useAIAssessment
│   │   ├── data/                # defaults, tooltips
│   │   ├── types/               # TypeScript interfaces
│   │   └── utils/               # calculations
│   └── package.json
├── backend/
│   ├── routes/                  # API endpoints
│   ├── services/                # AI service
│   ├── models/                  # Database models, schemas
│   └── app.py                   # FastAPI application
├── Dockerfile
├── railway.json
└── README.md
```

## Data Sources

The dashboard uses three categories of data:

- 🟢 **Supercell Data**: Confirmed metrics (341M downloads, ~$10M monthly revenue)
- 🔵 **Industry Standard**: Mobile gaming benchmarks (retention rates, CPI)
- 🟣 **Ralph Methodology**: Proprietary campaign assumptions

All assumptions are editable in the "Under the Hood" section.

## License

Proprietary - For pitch presentation purposes only.

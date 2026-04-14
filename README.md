# Optimized Railway Routing System

Full-stack project using:
- Frontend: React + Tailwind CSS + Framer Motion + Google Maps
- Backend: FastAPI
- Database: SQLite (SQL)

## 1) Backend Setup (Start Here)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python seed_data.py
uvicorn app.main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`

API endpoint:
- `GET /route?source=Delhi&destination=Mumbai`
- `GET /stations`
- `GET /routes`

Response includes:
- `routes` array with:
  - shortest path
  - alternative path (if available)
  - distance, travel time, and fare per route

Example `GET /route` response shape:

```json
{
  "source": "Delhi",
  "destination": "Mumbai",
  "routes": [
    {
      "route_type": "shortest",
      "path": ["Delhi", "Jaipur", "Mumbai"],
      "total_distance_km": 1420.0,
      "estimated_time_hours": 23.67,
      "estimated_fare": 2485.0
    }
  ]
}
```

## 2) Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
copy .env.example .env

npm run dev
```

Frontend runs at: `http://127.0.0.1:5173`

## Project Structure

```text
backend/
  app/
    routers/
      route.py
    services/
      dijkstra.py
      routing_service.py
    database.py
    main.py
    models.py
    schemas.py
  requirements.txt
  seed_data.py
frontend/
  src/
    App.jsx
    index.css
    main.jsx
    components/
      Navbar.jsx
      Sidebar.jsx
      SearchPanel.jsx
      RouteCard.jsx
      MapView.jsx
      HowItWorks.jsx
    pages/
      Login.jsx
    data/
      stations.js
  index.html
  package.json
  .env.example
```

## Notes

- Dijkstra logic is isolated in `backend/app/services/dijkstra.py`.
- Graph is built from SQL tables (`stations`, `routes`).
- Routes are treated as bidirectional edges.
- You can switch to PostgreSQL later by updating `DATABASE_URL` in `backend/app/database.py`.
- Frontend uses Google Maps markers + polyline to visualize route stations.

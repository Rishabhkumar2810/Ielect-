# iElect — Full-Stack Online Voting (Neon Edition)

## Prereqs
- Node 18+
- MongoDB running locally (mongodb://127.0.0.1:27017)

## 1) Backend
```bash
cd server
copy .env.example .env   # (Windows)  OR  cp .env.example .env  (Mac/Linux)
# open .env and confirm MONGO_URI + JWT_SECRET
npm install
npm run dev
```

## 2) Frontend
```bash
cd ../client
npm install
npm run dev
```
Open http://localhost:3000

## Flow
1. Register an **admin** and login
2. Create an election (start time = now - 5 min, end time = later today)
3. Add nominees via DB or your existing nominee creation flow, then **Assign** in Admin
4. Login as **voter** → see Active Elections → Vote
5. Admin → Results (aggregated with chart)

## Notes
- Axios interceptor auto-sends JWT from localStorage.
- Vite proxy forwards `/api` to `http://localhost:5000`.
- Votes stored in `votes` collection and reflected on nominee `votes` count.

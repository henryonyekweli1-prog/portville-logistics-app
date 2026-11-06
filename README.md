# Portville Logistics Limited
1. `cp .env.example .env.local` and fill in the values
2. `npm install && npm run dev`
3. Make an admin: register normally, then set that user's `role` to `"admin"` in MongoDB.

Flow: vendor creates order, submits payment, admin confirms, rider accepts (API returns 403 until confirmed).

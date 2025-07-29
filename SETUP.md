# Setting Up Open Sensing with Your Own Sensors

This guide explains how to fork the Open Sensing dashboard and connect it to your own environmental sensors and database.

---

## Overview

**Open Sensing** is an open-source, modular dashboard for real-time environmental monitoring. You can use it to:

* Collect and visualize your own sensor data
* Display values on an interactive map
* View trends, download datasets, and support community projects

---

## 1. Fork and Clone the Repository

1. Fork this repo on GitHub:

   ```
   https://github.com/scalable-design-participation-lab/open-sensing-frontend
   ```

2. Clone your forked version:

   ```bash
   git clone https://github.com/YOUR-USERNAME/open-sensing-frontend.git
   cd open-sensing-frontend
   ```

---

## 2. Set Up Environment Variables

Copy the `.env.example` file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
MAPBOX_ACCESS_TOKEN=your_mapbox_token

DB_HOST=your_postgres_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

---

## 3. Install Dependencies

Using Yarn:

```bash
yarn install
```

Or npm:

```bash
npm install
```

---

## 4. Run the Development Server

```bash
yarn dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 5. Connect Your Own Sensors

### TODO
---

## 6. Database Schema 

### TODO
---

## 7. Customizing the Dashboard

To configure what appears in the UI:

* `components/MapDashboard.vue`: Map display, sensor icons
* `components/SensorDetail.vue`: Sensor detail view + charts
* `constants/metrics.ts`: Define your own sensor metrics and labels
* `stores/`: Add filtering logic in Pinia stores

---

## 8. Optional: Deploy on Vercel

To share your dashboard publicly:

1. Push your forked repo to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Link your repo
4. Add your `.env` secrets via Vercel's dashboard
5. Deploy

Nuxt 3 works out-of-the-box with Vercel.


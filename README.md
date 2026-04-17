# Clinic PPM

Clinic PPM is a React Native and Expo clinic management app backed by an Express and MongoDB API. The project includes role-based flows for doctor, nurse, lab, and pharmacy staff, along with modules for appointments, patients, vitals, medicines, procedures, templates, and PDF generation.

## Stack

- Expo 54
- React Native 0.81
- React 19
- React Navigation
- Express 5
- MongoDB and Mongoose

## What the app includes

- Login and role-based navigation for clinic staff
- Doctor dashboard and clinic workspace
- Appointment booking and editing
- Patient registration and history
- Vitals tracking
- Prescription templates and medicine helpers
- Procedures and lab-related screens
- PDF generation endpoint for printable documents

## Project layout

```text
clinicppm.site/
  app/
    components/
      commons/         Shared UI pieces and modals
      loaders/         Splash and loading UI
      navbars/         Side and bottom navigation
    constants/         Theme and domain constants
    pages/
      ClinicDashboardPage.js
      screens/         Role dashboards and feature screens
    utils/             Client API and domain helpers
  assets/              Static assets
  scripts/             Local utility scripts
  server/
    src/
      config/          Environment and DB setup
      controllers/     Route handlers
      models/          Mongo models
      routes/          API route definitions
      seed/            Default seeded state
    index.js           Express server entry
  App.js               Native navigation entry point
  index.js             Expo entry
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create or update `.env` with values for your local or hosted backend:

```env
MONGODB_URI=your-mongodb-connection-string
PORT=4000
EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:4000/api
```

Notes:

- `MONGODB_URI` should point to your MongoDB deployment.
- `PORT` controls the Express API port.
- `EXPO_PUBLIC_API_BASE_URL` is the base URL used by the Expo app.
- If you test on a physical phone, replace `127.0.0.1` with your computer's LAN IP.

### 3. Start the API

```bash
npm run server
```

The API exposes:

- `GET /` basic server status
- `GET /api/health` health check
- `GET /api/state` fetch clinic state
- `PUT /api/state/:collection` replace one collection of clinic data
- `POST /api/state/reset` reset seeded clinic data
- `POST /api/pdf/html-to-pdf` generate a PDF from HTML

### 4. Start the Expo app

```bash
npm start
```

Useful variants:

```bash
npm run android
npm run ios
npm run web
```

## Development notes

- The main native navigation entry is [App.js](/C:/Users/Nihan%20Ali/Projects/Cursor/clinicppm.site/App.js).
- Most feature implementation lives under [app/pages](/C:/Users/Nihan%20Ali/Projects/Cursor/clinicppm.site/app/pages) and [app/components](/C:/Users/Nihan%20Ali/Projects/Cursor/clinicppm.site/app/components).
- The client API helpers are under [app/utils](/C:/Users/Nihan%20Ali/Projects/Cursor/clinicppm.site/app/utils).
- The Express backend starts from [server/index.js](/C:/Users/Nihan%20Ali/Projects/Cursor/clinicppm.site/server/index.js).
- The project currently contains ongoing worktree changes in app screens and navigation files, so treat local UI behavior as active development rather than frozen documentation.

## Scripts

- `npm start` starts Expo
- `npm run server` starts the Express API
- `npm run android` builds and runs Android
- `npm run ios` builds and runs iOS
- `npm run web` starts the web target
- `npm run lint` runs lint checks
- `npm run reset-project` runs the local reset utility

## Troubleshooting

- If the mobile app cannot reach the API, verify `EXPO_PUBLIC_API_BASE_URL`.
- If the server fails at startup, confirm MongoDB is reachable from `MONGODB_URI`.
- If Android native dependencies behave oddly after package changes, reinstall dependencies and rebuild the native app.

## License

This repository does not currently declare a license.

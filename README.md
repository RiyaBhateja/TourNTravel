# TourNTravel

Stop planning and start exploring with TourNTravel, an intelligent itinerary engine powered by robust Google Cloud architecture. It instantly analyzes your unique constraints to deliver a secure, interactive, and completely personalized travel experience.

## Features
- **Dynamic Itinerary Generation:** Constraint-aware engine that builds personalized day-by-day plans.
- **Interactive UI:** Glassmorphism aesthetic, progressive web app (PWA) capabilities, and a responsive dashboard.
- **Security & Privacy:** Built-in GDPR compliance banners and strict Content Security Policies (CSP).
- **Google Services:** Integrates Google Maps, Firebase Analytics, and Google Cloud Run.

## Deployment
This application is fully containerized and can be deployed serverlessly using Google Cloud Run:
```bash
gcloud run deploy tourntravel --source . --region us-central1 --allow-unauthenticated
```

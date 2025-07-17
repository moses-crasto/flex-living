# Flex Living Dashboard

A modern Next.js 13 application featuring a properties listing and reviews dashboard with integrated backend APIs.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Tech Stack](#tech-stack)  
- [Features](#features)  
- [Setup and Running Locally](#setup-and-running-locally)  
- [API Endpoints](#api-endpoints)  
- [Design and Implementation Details](#design-and-implementation-details)  
- [Future Improvements](#future-improvements)  
---

## Project Overview

Flex Living Dashboard is a full-stack web application built with Next.js 13, showcasing properties with guest reviews. The app fetches property data and reviews from API routes within the same app, filters approved reviews, and displays them responsively.

---

## Tech Stack

- **Next.js 13 (App Router)** – React framework with server-side rendering and API routes  
- **TypeScript** – Static typing for safer, scalable code  
- **React** – UI library for building components  
- **Tailwind CSS** – Utility-first CSS framework for styling  
- **Google Fonts** – Custom fonts integrated with Next.js font optimization  
- **API Routes** – Backend REST APIs built-in Next.js under `src/app/api`  
- **React Hooks** – State management and side effects handling

---

## Features

- Responsive properties listing with 3 cards per row on desktop  
- Guest reviews filtered by approval status  
- Dynamic data fetching with loading states  
- Review approval via API endpoints  
- Custom fonts with Google Fonts integration  
- Clean and modern UI with Tailwind CSS  

---

## Setup and Running Locally

### Prerequisites

- Node.js v18+  
- npm

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/moses-crasto/flex-living-dashboard.git
   cd flex-living-dashboard
   
2. Install dependencies:
npm install

3. Run the development server:
npm run dev

4. Open http://localhost:3000/dashboard and http://localhost:3000/properties to view the app.

### API Endpoints
GET /api/properties
Returns all properties in JSON format.

GET /api/reviews/hostaway
Returns all guest reviews related to Hostaway.

POST /api/reviews/[id]/approve
Approves a review by its ID.

### Design and Implementation Details
API & Data Handling:
Using Next.js API routes under src/app/api enables full-stack development inside a single project. The frontend fetches properties and reviews, then filters reviews client-side based on approved status.

Responsive Layout:
CSS Grid with Tailwind classes ensures 3 properties per row on larger screens and single column on smaller devices.

Fonts & Styling:
Google Fonts are integrated via Next.js font optimization APIs, enabling efficient font loading and usage across the app.

Conditional Rendering:
The app gracefully handles loading states and empty data scenarios, showing user-friendly messages such as "No published reviews yet."

###Future Improvements
Add pagination for properties and reviews

Enable review submission from users

Implement user authentication for managing properties and reviews

Improve accessibility and SEO

Add unit and integration tests

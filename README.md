# Flowship Logistics — Enterprise Supply Chain Intelligence Platform

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Production-2ea88b?style=for-the-badge&logo=vercel)](https://flowship-logistics.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-132238?style=for-the-badge&logo=github)](https://github.com/iamHeroXD/flowship-logistics)
[![Next.js 14](https://img.shields.io/badge/Next.js-14%20App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**Live Production URL**: [https://flowship-logistics.vercel.app](https://flowship-logistics.vercel.app)  
**GitHub Repository**: [https://github.com/iamHeroXD/flowship-logistics](https://github.com/iamHeroXD/flowship-logistics)

An enterprise-grade, full-stack logistics and supply chain management platform built with **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, and modern telematics architecture. 

Flowship Logistics matches refined operational aesthetics with a unified multi-modal freight backend supporting 5 distinct user roles: **Customer**, **Dispatcher**, **Driver**, **Admin**, and **Super Admin**.

---

## 🚀 Key Highlights & Architectural Features

### 1. Visual Reference Fidelity & Refined Operational Design
- **Palettes**: Deep Navy Charcoal (`#132238`), Muted Teal (`#1e3a47`), Mint Accent (`#2ea88b`), and Soft Ice Surfaces (`#f0f6f8`).
- **Signature Organic Pebble Cards**: Custom asymmetrical curved surfaces for logistics services and KPI statistics.
- **Interactive Telematics Hero Widget**: Live search, discrete progress milestones, origin/destination tags, and real-time status badges.
- **Organic CTA Banner**: High-conversion pill container with responsive actions.

### 2. Core Operational Engines
- **Strict Shipment Lifecycle State Machine**:
  $$\text{PENDING} \longrightarrow \text{ASSIGNED} \longrightarrow \text{PICKED\_UP} \longrightarrow \text{IN\_TRANSIT} \longrightarrow \text{OUT\_FOR\_DELIVERY} \longrightarrow \text{DELIVERED}$$
  - Illegal transitions (e.g. `DELIVERED` → `PENDING`) are rejected.
  - Automatically records timestamped `ShipmentEvent` records with GPS coordinates and actor attribution.
- **Dynamic Pricing Engine**:
  - Distance (km) + Gross mass (kg) + Volumetric weight ($L \times W \times H / 5000$) + Service tier multipliers + Zone tariffs + Fuel surcharges.
- **Automated & Manual Fleet Dispatch**:
  - Heuristic pairing matching closest available driver with vehicle payload capacity.
- **Electronic Proof of Delivery (POD)**:
  - HTML5 canvas signature pad, recipient identification, and timestamped geolocations.
- **CSV/Excel Bulk Order Engine**:
  - Ingestion dropzone, column validation, row-by-row pre-checks, error reporting, and batch commit.
- **Deterministic Invoice Generation**:
  - Auto-generated commercial invoices (`INV-2026-XXXX`) with line items, tax rate, and print/PDF download.

### 3. Role-Based Systems & Portals
- **Customer Portal (`/dashboard`)**: Overview KPIs, 6-Step Shipment Wizard, Tracking, Invoices, Corporate Wallet, and Profile Settings.
- **Driver Portal (`/driver`)**: Mobile-first cockpit, one-tap duty toggle (`AVAILABLE`/`BUSY`/`OFFLINE`), turn-by-turn navigation links, stop milestones, and digital POD capture.
- **Dispatcher Operations Hub (`/dispatcher`)**: Live dispatch board, unassigned freight queue, fleet radar map, and route sequencing.
- **Admin Command Center (`/admin`)**: Universal shipment ledger with administrative state overrides, driver roster, vehicle maintenance, warehouses, SKU inventory control, and immutable audit logs.

### 4. Global Enterprise Support
- **Multi-Currency**: Instant conversion and formatting for USD ($), EUR (€), GBP (£), NGN (₦), and INR (₹).
- **Multi-Language**: Localization dictionaries for English (EN), Spanish (ES), French (FR), and German (DE).
- **REST API Specs**: Interactive `/api-docs` page with cURL snippets and request/response payloads.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router, Server & Client Components, Route Handlers)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS & PostCSS
- **Icons**: Lucide React
- **Data Persistence**: Atomic, file-backed persistent JSON database (`src/server/db/`) with pre-seeded datasets and clean repository abstraction.
- **Auth**: JWT session tokens with bcryptjs hashing.

---

## 🏁 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Production Build & Smoke Test
```bash
npm run build
npm start
```

---

## 👥 Demo Accounts (1-Click Login Available)

| Role | Email | Password | Default Portal |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@flowship.com` | `password123` | `/dashboard` |
| **Dispatcher** | `dispatcher@flowship.com` | `password123` | `/dispatcher` |
| **Driver** | `driver@flowship.com` | `password123` | `/driver` |
| **Admin** | `admin@flowship.com` | `password123` | `/admin` |
| **Super Admin** | `superadmin@flowship.com` | `password123` | `/admin` |

*A global demo role-switcher bar is also present at the top of the interface for instant persona previewing.*

---

## 📄 License
© 2026 Flowship Logistics. All rights reserved.

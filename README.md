# CloudiFi

CloudiFi is a Next.js + Prisma + Mikrotik Hotspot billing system scaffold.

This repository now includes a `backend/` folder containing a Laravel 11 backend for ISP billing, router monitoring, MTN MoMo collection, and Africa's Talking SMS.

## Features

- Mobile Money payment webhook
- Auto-voucher generation using payer phone as username
- SMS delivery of voucher codes
- Prisma schema for users, payments, vouchers, and Mikrotik devices
- API routes for payment event handling

## Setup

1. Copy `.env.example` to `.env` and update values.
2. Run `npm install`.
3. Run `npx prisma generate`.
4. Run `npx prisma migrate dev --name init`.
5. Run `npm run dev`.

## Environment variables

- `DATABASE_URL` - Prisma SQLite or PostgreSQL connection string
- `SMS_PROVIDER_API_KEY` - your SMS provider API key
- `SMS_PROVIDER_FROM` - sender name for SMS messages
- `SMS_PROVIDER_URL` - SMS provider HTTP endpoint
- `MTN_COLLECTION_URL` - MTN Collection request-to-pay base URL
- `MTN_COLLECTION_API_KEY` - MTN Collection API bearer token
- `MTN_COLLECTION_SUBSCRIPTION_KEY` - MTN Collection subscription key
- `MTN_COLLECTION_ENVIRONMENT` - MTN target environment (`sandbox` or `production`)
- `MTN_COLLECTION_CALLBACK_URL` - callback URL for payment status updates
- `MIKROTIK_HOST`, `MIKROTIK_PORT`, `MIKROTIK_USER`, `MIKROTIK_PASSWORD` - Mikrotik API credentials
- `EMAIL_API_URL` - email provider HTTP endpoint
- `EMAIL_API_KEY` - email provider API token

## API Endpoints

- `POST /api/mtn/request` - initiate MTN request-to-pay for a voucher
- `POST /api/mtn/callback` - MTN callback URL for payment status updates
- `POST /api/payment` - generic payment webhook receiver
- `POST /api/mikrotik/user` - manual MikroTik hotspot user creation
- `POST /api/router/heartbeat` - MikroTik heartbeat from routers
- `POST /api/router/check` - check router health and notify resellers
- `POST /api/data-usage` - record data usage sessions for a voucher/customer
- `POST /api/auth/signup` - register customer email and send verification code
- `POST /api/auth/verify` - verify customer email with a 5-digit code
- `POST /api/auth/resend` - resend email verification code

## Auth pages

- `/auth/signup` - customer email signup page
- `/auth/verify` - customer email verification page

## Reseller dashboard

- Reseller dashboard is available at `/reseller`
- Shows site and router status with `online`, `warning`, and `offline`
- Alerts are sent by email and SMS when a router changes to warning/offline


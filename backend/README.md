# CloudiFi Laravel Backend

This folder contains the Laravel 11 backend for the CloudiFi ISP billing, monitoring, and auto-config system.

## Install

1. cd backend
2. composer install
3. cp .env.example .env
4. Set database, MTN, Africa's Talking, router, and mail credentials
5. php artisan key:generate
6. php artisan migrate
7. php artisan queue:work (optional for async notifications)
8. php artisan serve

## API Endpoints

- POST /api/payment/initiate
- POST /api/mtn/callback
- POST /api/router/heartbeat
- POST /api/router/check
- POST /api/data-usage
- POST /api/auth/signup
- POST /api/auth/verify
- POST /api/auth/resend
- GET /api/reseller/dashboard

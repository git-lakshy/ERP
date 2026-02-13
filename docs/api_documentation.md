# API Documentation Outline

## Overview
The Sellable ERP Platform uses a RESTful API architecture. All endpoints are protected by Supabase Auth and require a valid JWT.

## Base URL
`https://api.your-platform.com/v1`

## Authentication
- **POST /auth/login**: Login with email and password.
- **POST /auth/register**: Create a new account and organization.
- **POST /auth/logout**: Invalidate the current session.

## Organization Management
- **GET /organizations/me**: Get current organization details.
- **PATCH /organizations/me**: Update organization settings.
- **GET /organizations/users**: List all users in the organization.

## Inventory Module
- **GET /inventory/products**: List all products (supports pagination and filtering).
- **POST /inventory/products**: Create a new product.
- **GET /inventory/products/:id**: Get product details and stock history.
- **PATCH /inventory/products/:id**: Update product details.
- **DELETE /inventory/products/:id**: Archive a product.

### Stock Operations
- **POST /inventory/products/:id/adjust**: Adjust stock levels (IN/OUT/ADJUSTMENT).
  - Request Body: `{ "type": "IN", "quantity": 50, "notes": "Restock" }`

## Security
- All requests must include `Authorization: Bearer <JWT>`.
- Multi-tenancy is enforced at the database level using Supabase RLS policies.
- RBAC is checked at the API gateway level based on the `User.role` field.

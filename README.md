# 🎫 Support Ticket Dashboard

A full-stack, real-time support ticket management dashboard built with **Next.js 15**, **TailwindCSS v4**, **Iconsax**, **Framer Motion**, and **Express.js**.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher

---

### 1. Run Backend Server

```bash
cd ticket-server
npm install
npm run dev
```

The Express backend server will start at **`http://localhost:3001`**.

> **Note**: Seed credentials will be output in the server logs:
> - **Agent**: `agent@support.com` / `agent123`
> - **Admin**: `admin@support.com` / `admin123`
> - **Guest**: `guest@example.com` / `guest123`

---

### 2. Run Frontend Dashboard

In a separate terminal window:

```bash
cd ticket-ui
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

### 3. Run Automated Tests

To execute the Vitest test suite for component unit testing:

```bash
cd ticket-ui
npm test
```

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Key Details |
|---|---|---|
| **Frontend Framework** | **Next.js 15** (App Router) | Server & Client Components, Route Handlers, React 19 |
| **Styling** | **TailwindCSS v4** | Pure utility classes, custom theme configuration, responsive layout |
| **Icons** | **Iconsax React** | Standardized vector icons using `variant="Linear"` and `currentColor` |
| **Animations** | **Framer Motion** | Animated ticket row transitions, layout shifts, dynamic badge pulses |
| **Theme** | **next-themes** | Dark/Light theme toggle with persistent user preference |
| **Real-time** | **Server-Sent Events (SSE)** | Live auto-refresh of tickets when updates occur on the server |
| **Backend Server** | **Express.js (TypeScript)** | Modular REST API with Bearer token authentication & SSE broadcaster |
| **Testing** | **Vitest + React Testing Library** | Unit & integration tests for badges, filters, and UI components |

---

## 🔑 Key Features & Enhancements

- ⚡ **Optimistic UI Updates**: Instant feedback on ticket status updates, agent assignments, and comment additions before server confirmation.
- 🎨 **Tailwind CSS System**: Fully refactored from legacy global CSS to clean, responsive Tailwind utilities.
- 🌙 **Dark & Light Mode**: Seamless dark mode support powered by CSS variables and `next-themes`.
- 📊 **Real-Time SSE Stream**: Subscribes to backend SSE stream at `/api/tickets/stream` to auto-reflect new tickets and updates across sessions.
- 🔍 **Channel Navigation & Filtering**: Filter tickets by channels (**Web**, **Email**, **Messaging**) and status filters (**Open**, **Pending**, **Closed**).
- 🔐 **Role-Based Views**: Differentiates agent/admin access from guest user views.

---

## 🧪 Testing Coverage

The frontend suite uses **Vitest** and **React Testing Library**:

- `tests/Badge.test.tsx`: Tests `Badge`, `StatusBadge`, and `ChannelBadge` rendering, label matching, Tailwind color classes, and size variants.
- `tests/TicketFilterBar.test.tsx`: Tests search input handling, status filter dropdown selection, and search parameter callbacks.

Run tests:
```bash
cd ticket-ui
npm test
```

---

## 📡 Backend API Testing & cURL Examples

A ready-to-use Postman Collection is available in the root directory: [`postman_collection.json`](file:///c:/Users/hp/Desktop/Ticket%20Dashboard/postman_collection.json). Import it into Postman to test all endpoints.

### 1. Health Check
```bash
curl -X GET http://localhost:3001/health
```

### 2. Login (Get Bearer Token)
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "agent@support.com", "password": "agent123"}'
```
*Returns:* `{"token": "<YOUR_TOKEN>", "user": {...}}`

### 3. List Tickets (Paginated & Filtered)
```bash
curl -X GET "http://localhost:3001/api/tickets?page=1&limit=10&channel=web,email"
```

### 4. Search Tickets
```bash
curl -X GET "http://localhost:3001/api/tickets?search=login"
```

### 5. Create Ticket
```bash
curl -X POST http://localhost:3001/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "title": "Unable to reset password",
    "body": "The password reset link sends a 404 error page.",
    "channel": "web",
    "userEmail": "user@example.com",
    "userName": "Jane Smith"
  }'
```

### 6. Update Ticket Status / Agent
```bash
curl -X PATCH http://localhost:3001/api/tickets/ticket-1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "status": "pending",
    "assignedAgentId": "usr-1"
  }'
```

### 7. Add Comment to Ticket
```bash
curl -X POST http://localhost:3001/api/tickets/ticket-1/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "body": "Investigating the link generation in auth service."
  }'
```

---

## 📁 Repository Structure

```
Ticket Dashboard/
├── postman_collection.json    # Postman v2.1.0 collection for API testing
├── README.md                  # Project documentation
├── ticket-server/             # Express + TypeScript backend
│   ├── src/
│   │   ├── data/              # In-memory store & seed data
│   │   ├── middleware/        # Bearer token auth middleware
│   │   ├── routes/            # Auth and Ticket API endpoints
│   │   └── utils/             # SSE event broadcast stream
│   └── package.json
└── ticket-ui/                 # Next.js 15 frontend
    ├── app/                   # App Router pages & layouts
    ├── components/            # UI, Ticket, Layout, and Motion components
    ├── lib/                   # API client, SSE subscriber, and types
    ├── tests/                 # Vitest component test suites
    └── package.json
```

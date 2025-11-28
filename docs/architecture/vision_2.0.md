# Architecture Vision 2.0: The AI-Native Enterprise

**Author**: Principal Software Architect  
**Date**: 2025-11-28  
**Version**: 2.0 (Draft)

## 1. Executive Summary

We are shifting **AstraCore Cloud** from a traditional microservices ERP to an **AI-Native Operating System for Business**. 

The goal is to move beyond "forms and grids" to **"conversations and insights"**. Users shouldn't just *enter* data; they should *collaborate* with the system.

## 2. Frontend Architecture: "Consumer-Grade Enterprise"

We will build a **Premium, High-Performance Web Client** that rivals the best consumer apps (Linear, Arc, Airbnb) in fluidity and aesthetics.

### 2.1 Technology Stack
*   **Framework**: **Next.js 14 (App Router)**. Why? Server Components (RSC) for data fetching efficiency, SEO, and edge caching.
*   **Language**: **TypeScript** (Strict Mode).
*   **Styling**: **Tailwind CSS** + **Shadcn/UI**. For a bespoke, accessible, and premium design system.
*   **Animations**: **Framer Motion**. Micro-interactions are critical for "wow" factor (e.g., smooth layout transitions, entry animations).
*   **State Management**:
    *   **Server State**: **TanStack Query (React Query)**. Caching, optimistic updates, and background re-fetching.
    *   **Client State**: **Zustand**. Minimalist global store for UI state (sidebar toggle, theme, chat open).
*   **Real-time**: **Socket.io** or **SSE (Server-Sent Events)** for live updates (notifications, chat streaming).

### 2.2 Design Philosophy
*   **Glassmorphism & Depth**: Subtle blurs, multi-layered depth, and noise textures to create a "tactile" feel.
*   **Command-First UX**: A global `Cmd+K` command palette to navigate anywhere or perform actions ("Create Invoice", "Search Customer") without touching the mouse.
*   **Dark Mode Native**: Designed for dark mode first, with high-contrast accents.

## 3. AI Copilot Integration: "The Brain"

The AI is not a chatbot in the corner; it is the **Orchestrator**.

### 3.1 The "Omnipresent" Copilot
*   **Context-Aware**: The chat knows what page you are on. If you are on "Invoice #123", asking "Send this" understands context.
*   **Generative UI**: The AI doesn't just return text; it returns **Interactive Components**.
    *   *User*: "Show me sales for last quarter."
    *   *AI*: Renders a **Recharts** graph directly in the chat stream.
*   **Action Execution**: The AI can call API endpoints (Tool Use).
    *   *User*: "Create an invoice for Acme Corp for $500."
    *   *AI*: Calls `POST /api/v1/invoices` and shows the result.

### 3.2 Architecture
```mermaid
graph TD
    User[User (React UI)] <-->|WebSocket/SSE| BFF[BFF / API Gateway]
    BFF <-->|REST/gRPC| BillingService[Billing Service]
    BFF <-->|REST| AICore[AI Orchestrator (Python)]
    AICore <-->|RAG| VectorDB[(Vector DB)]
    AICore <-->|LLM| OpenAI[LLM Provider]
```

## 4. Implementation Roadmap

### Phase 9: Frontend Foundation
1.  **Initialize Next.js Monorepo**: Set up the shell.
2.  **Design System**: Implement "Astra UI" (Tailwind tokens, typography, base components).
3.  **Core Layout**: Sidebar, Header, Command Palette (`cmdk`).
4.  **Auth Integration**: Connect to Keycloak/Ory.

### Phase 10: The "Billing" Experience
1.  **Dashboard**: High-level metrics (Revenue, Outstanding).
2.  **Invoice List**: Data Grid with filtering/sorting (TanStack Table).
3.  **Invoice Creator**: A "Notion-like" editing experience for invoices, not a boring form.

### Phase 11: AI Chat Integration
1.  **Chat Interface**: Floating panel or sidebar.
2.  **Streaming Response**: Markdown rendering + Component streaming.
3.  **Tool Usage**: Connect AI to `BillingController` APIs.

## 5. Future Vision (Post-MVP)
*   **Voice Mode**: "Hey Astra, what's my cash flow?"
*   **Predictive UX**: The UI pre-fetches data it thinks you'll need next.
*   **Multi-Modal**: Upload a PDF invoice, and the AI parses it into the system.

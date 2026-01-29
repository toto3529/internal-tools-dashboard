# Internal Tools Management Dashboard

Technical test – Frontend

Application for internal IT administrators to monitor, manage and analyze SaaS tools usage and costs across departments.

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- npm / pnpm / yarn

### Installation & Run

Install dependencies and start the development server using your preferred package manager.

```bash
npm install
```

```bash
npm run dev
```

The application runs locally and consumes the provided JSON Server API:  
https://tt-jsonserver-01.alt-tools.tech/

---

## 🏗️ Architecture

The project is structured around three main pages (Dashboard, Tools, Analytics) sharing a common layout and a unified design system.

src/  
├── components/  
│ ├── ui/ Reusable design system components (cards, badges, pagination, tables)  
│ ├── dashboard/ Dashboard-specific components (KPIs, recent tools)  
│ ├── AppLayout.tsx Shared layout wrapper  
│ └── Header.tsx Global navigation and search  
├── pages/ Dashboard, Tools, Analytics  
├── hooks/ Data fetching and local logic (lists, filters, analytics)  
├── utils/ Helpers (API layer, formatting, types)  
├── styles/ Design tokens and shared UI constants  
├── App.tsx Application root component  
└── main.tsx Application entry point

Architecture principles:

- Clear separation between pages, UI components, and business logic
- Page-specific components isolated from the shared design system
- Local state for UI concerns (filters, sorting, pagination)
- Shared hooks and utilities to avoid duplication

---

## 🎨 Design System Evolution

The design system was built progressively, starting from a solid visual foundation and extended consistently across the application.

A dark theme was defined as the primary visual reference, with a strong focus on clarity, contrast, and readability. Core UI components were identified early and reused throughout the project, including cards, tables, status badges, buttons, and dropdowns.

As new features and pages were added, the design system was extended through composition rather than introducing new styles. Spacing, typography, colors, and interaction patterns were kept strictly consistent to ensure a cohesive user experience across all screens.

The resulting design system is intentionally structured to be extensible and ready to support additional views such as analytics and data visualization, without requiring visual refactoring.

---

## 🔗 Navigation & User Journey

The user journey follows a clear and progressive flow across the application:

Dashboard:

- Global KPIs providing a high-level overview
- Recent tools snapshot for quick monitoring

Tools:

- Full tools catalog
- Advanced filtering, sorting, and management capabilities

Analytics:

- Dedicated entry point for cost and usage analysis
- Designed to extend the existing dashboard insights

Navigation is handled via React Router, using a shared header and a contextual search that adapts to each page.

---

## 📊 Data Integration Strategy

All data is retrieved from the provided JSON Server API and handled through a centralized data-fetching strategy.

The application relies on a dedicated data layer built with TanStack Query to manage:

- Server state caching
- Loading and error states
- Consistent data access across pages

Strategy by page:

- Dashboard uses aggregated and limited datasets for high-level insights
- Tools page consumes full datasets with local filtering, sorting, and pagination
- Analytics is designed to derive and visualize data from existing endpoints

This approach ensures predictable data flows, minimizes unnecessary network requests, and keeps UI components focused on presentation rather than data management.

---

## 📱 Progressive Responsive Design

A mobile-first approach is applied across the application, with progressive adaptations based on screen size and page context.

Mobile:

- Card-based layouts prioritizing readability
- Stacked content to fit narrow viewports
- Touch-friendly interactions and controls

Tablet:

- Hybrid layouts combining cards and denser content
- Increased data density while preserving clarity
- Progressive disclosure of secondary information

Desktop:

- Full tables and grid-based layouts
- Advanced interactions and navigation
- Complete feature set available

Responsive behavior is consistent across all pages, while allowing each view (Dashboard, Tools, Analytics) to adapt its layout to its specific content and usage patterns.

---

## 🧪 Testing Strategy

Given the limited timeframe of the technical test, no automated test suite was implemented.

Quality and reliability were ensured through:

- Manual testing across all breakpoints (mobile, tablet, desktop)
- Validation of key user flows (navigation, filtering, sorting, bulk actions)
- Strong component reuse to reduce regression risks
- Clear separation of concerns to keep logic testable

The project structure and component architecture allow easy future integration of unit and integration tests (e.g. with Jest, React Testing Library or Cypress).

---

## ⚡ Performance Optimizations

Several performance-oriented decisions were applied to keep the application responsive and predictable:

- Local pagination, sorting and filtering to avoid unnecessary network requests
- Memoization (`useMemo`) for derived datasets and computed views
- Scoped state management to limit component re-renders
- Lightweight and predictable component hierarchy to reduce rendering complexity

These optimizations are sufficient for a 3-page dashboard application and provide a solid base for future scalability.

---

## 🎯 Design Consistency Approach

After the initial design foundation, no additional mockups were used.

Visual consistency is maintained by:

- Strict reuse of the existing design system components
- Identical spacing, typography, color palette, and interaction patterns across pages
- Avoiding ad-hoc or page-specific styling during feature development
- Extending functionality through composition rather than visual changes

This approach ensures a cohesive user experience across the application, even as features evolve without new visual references.

---

## 📈 Data Visualization Philosophy

Data visualization is planned as an extension of the existing design system rather than a standalone feature.

Charting choices are guided by:

- Reuse of the existing color palette to maintain visual consistency
- Clear and readable representations over visual complexity
- Charts designed to complement tabular data, not replace it
- Interaction patterns aligned with the rest of the UI (hover states, legends, spacing)

For implementation, a lightweight and declarative charting library such as Recharts or Chart.js would be appropriate, as they integrate well with React and allow easy styling to match the current design system.

---

## 🔮 Next Steps / Complete App Vision

To evolve this project into a more complete internal SaaS, the next steps can be approached progressively, in realistic stages.

Short-term improvements would focus on consolidating existing features, such as completing the Analytics page with clear charts and insights, and strengthening tool management workflows with full CRUD operations and more robust bulk actions.

Mid-term evolutions would aim at improving scalability and reliability, including server-side pagination and filtering, better data handling strategies, and the introduction of automated tests and basic CI checks to secure future developments.

Long-term perspectives would move the application closer to production readiness, with features such as role-based access control, audit logs, export capabilities (CSV/PDF), real-time updates, and overall UX and accessibility enhancements.

This progressive roadmap allows the application to grow while preserving design consistency, code quality, and a maintainable architecture.

---

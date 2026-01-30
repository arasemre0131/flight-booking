<!--
Sync Impact Report
==================
Version change: 0.0.0 → 1.0.0 (Initial creation)
Modified principles: N/A (new file)
Added sections:
  - Core Principles (5 principles)
  - Technology Constraints
  - Development Workflow
  - Governance
Removed sections: None
Templates requiring updates:
  - .speckit-tools/templates/plan-template.md: ⚠ pending (constitution check already present)
  - .speckit-tools/templates/spec-template.md: ✅ no changes needed
  - .speckit-tools/templates/tasks-template.md: ✅ no changes needed
Follow-up TODOs: None
-->

# Tripma Flight Booking Constitution

## Core Principles

### I. Design-First Development

All UI implementation MUST follow the Figma design reference exactly. Deviations from design require explicit justification.

- Components MUST match Figma colors, spacing, and typography
- Design assets located in `frontend/design/images/`
- Reference: [Tripma Figma](https://www.figma.com/community/file/911320742349428744)

### II. Component-Based Architecture

All features MUST be built as Angular 17+ standalone components.

- Components MUST be self-contained and reusable
- Each component handles its own styling (SCSS)
- Components MUST be independently testable
- Prefer composition over inheritance

### III. Type Safety

All data structures MUST have TypeScript interfaces defined.

- Interfaces MUST be defined in `models/` directory
- No `any` type unless explicitly justified
- API contracts MUST have corresponding TypeScript types
- Form data MUST use typed reactive forms

### IV. Responsive Design

All UI components MUST work on both desktop and mobile viewports.

- Mobile-first approach: design for mobile, enhance for desktop
- Breakpoint: 768px for mobile/desktop transition
- Touch targets MUST be minimum 44px
- No horizontal scrolling on mobile

### V. Simplicity (YAGNI)

Implementations MUST be minimal and focused on current requirements.

- No speculative features or over-engineering
- Prefer simple solutions over complex abstractions
- Maximum 400 lines per spec/feature implementation
- Mock data for frontend development until backend integration

## Technology Constraints

The following technology stack is fixed for this project:

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Angular | 17+ |
| Backend | Node.js + Express | Latest LTS |
| Database | MongoDB | Latest |
| Language | TypeScript | 5.x |
| Styling | SCSS | - |
| Containerization | Docker | 3 containers |

Additional constraints:
- All components MUST be standalone (no NgModules)
- All code and comments MUST be in English
- Frontend uses mock data until backend is ready

## Development Workflow

### Speckit Workflow

All features follow the speckit-driven development process:

1. `/speckit.specify` - Create feature specification
2. `/speckit.clarify` - Resolve ambiguities
3. `/speckit.plan` - Design implementation approach
4. `/speckit.tasks` - Generate actionable task list
5. `/speckit.analyze` - Validate consistency
6. `/speckit.implement` - Execute implementation

### Branching Strategy

- Each feature gets its own branch: `NNN-feature-name`
- Branches created from latest completed feature branch
- Merge to main handled manually by project owner

## Governance

This constitution establishes the non-negotiable standards for the Tripma flight booking project.

- All implementations MUST comply with Core Principles
- Violations require explicit justification in plan.md
- Constitution amendments require version bump and documentation
- Simplicity principle takes precedence when principles conflict

**Version**: 1.0.0 | **Ratified**: 2025-01-30 | **Last Amended**: 2025-01-30

# Tasks: Passenger Information Form

**Input**: Design documents from `/specs/006-passenger-info/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested - implementation only

**Organization**: Tasks grouped by user story for independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/app/` prefix for all Angular files

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create data models and services that all user stories depend on

- [x] T001 [P] Create Passenger interface in frontend/src/app/models/passenger.model.ts
- [x] T002 [P] Create EmergencyContact and BookingDraft interfaces in frontend/src/app/models/booking.model.ts
- [x] T003 Create BookingService with signal-based state management in frontend/src/app/services/booking.service.ts
- [x] T004 Add /passenger-info route to frontend/src/app/app.routes.ts

---

## Phase 2: User Story 1 - Enter Passenger Details (Priority: P1) 🎯 MVP

**Goal**: Traveler can enter personal information with proper form fields for each passenger

**Independent Test**: Navigate to passenger info page, fill in passenger details form, verify form accepts valid input

### Implementation for User Story 1

- [x] T005 [P] [US1] Generate passenger-form component scaffold: ng generate component components/passenger-form --standalone --skip-tests
- [x] T006 [US1] Implement passenger-form.ts with reactive form, input for passengerIndex and passengerType, form controls for firstName, middleName (optional), lastName, suffix (optional), dateOfBirth in frontend/src/app/components/passenger-form/passenger-form.ts
- [x] T007 [US1] Create passenger-form.html template with labeled form fields, required field indicators (asterisks), date input for DOB in frontend/src/app/components/passenger-form/passenger-form.html
- [x] T008 [US1] Style passenger-form.scss with form layout, input styling, section headers per Figma in frontend/src/app/components/passenger-form/passenger-form.scss
- [x] T009 [P] [US1] Generate passenger-info page scaffold: ng generate component pages/passenger-info --standalone --skip-tests
- [x] T010 [US1] Implement passenger-info.ts with dynamic passenger form generation based on search criteria (adults + children count) in frontend/src/app/pages/passenger-info/passenger-info.ts
- [x] T011 [US1] Create passenger-info.html with two-column layout, passenger form sections labeled (Passenger 1, Passenger 2, etc.) in frontend/src/app/pages/passenger-info/passenger-info.html
- [x] T012 [US1] Style passenger-info.scss with two-column grid (form left, sidebar right), responsive mobile stack at 768px in frontend/src/app/pages/passenger-info/passenger-info.scss

**Checkpoint**: Form displays with correct fields for each passenger based on search criteria

---

## Phase 3: User Story 2 - View Selected Flight Summary (Priority: P1)

**Goal**: Traveler sees selected flight details in sidebar to confirm correct trip before entering info

**Independent Test**: Navigate to passenger info page, verify flight summary displays with correct route, times, airline, and total price

### Implementation for User Story 2

- [x] T013 [P] [US2] Generate flight-summary component scaffold: ng generate component components/flight-summary --standalone --skip-tests
- [x] T014 [US2] Implement flight-summary.ts with inputs for selectedFlight, returnFlight (optional), and totalPrice, display computed values in frontend/src/app/components/flight-summary/flight-summary.ts
- [x] T015 [US2] Create flight-summary.html with flight details (route, departure/arrival times, airline logo, price breakdown), show both outbound and return flight if round-trip in frontend/src/app/components/flight-summary/flight-summary.html
- [x] T016 [US2] Style flight-summary.scss matching sidebar design from 005-search-sidebar in frontend/src/app/components/flight-summary/flight-summary.scss
- [x] T017 [US2] Integrate flight-summary into passenger-info page sidebar, pass selected flight from BookingService in frontend/src/app/pages/passenger-info/passenger-info.ts
- [x] T018 [US2] Update passenger-info.html to include flight-summary in sidebar section in frontend/src/app/pages/passenger-info/passenger-info.html

**Checkpoint**: Flight summary displays in sidebar with correct flight details and total price

---

## Phase 4: User Story 3 - Validate and Submit (Priority: P1)

**Goal**: Form validates input and prevents submission with errors, navigates to seat selection on success

**Independent Test**: Submit with empty/invalid fields → see errors; submit valid form → navigate to seat selection

### Implementation for User Story 3

- [x] T019 [US3] Add email and phone form controls with validators to passenger-form.ts (required for primary adult only) in frontend/src/app/components/passenger-form/passenger-form.ts
- [x] T020 [US3] Add email validation (Validators.email) and phone validation (pattern) to passenger-form in frontend/src/app/components/passenger-form/passenger-form.ts
- [x] T021 [US3] Add error message display to passenger-form.html for each field (required, invalid format) in frontend/src/app/components/passenger-form/passenger-form.html
- [x] T022 [US3] Style error messages in passenger-form.scss (red text, proper spacing) in frontend/src/app/components/passenger-form/passenger-form.scss
- [x] T023 [US3] Add form validity tracking to passenger-info.ts, aggregate validity from all passenger forms in frontend/src/app/pages/passenger-info/passenger-info.ts
- [x] T024 [US3] Add "Save and continue" button to passenger-info.html, disabled when form invalid in frontend/src/app/pages/passenger-info/passenger-info.html
- [x] T025 [US3] Implement form submission: save passengers to BookingService, navigate to /seat-selection in frontend/src/app/pages/passenger-info/passenger-info.ts
- [x] T026 [US3] Add conditional email/phone fields for primary adult only (hide for children and non-primary adults) in frontend/src/app/components/passenger-form/passenger-form.html

**Checkpoint**: Form validates all required fields, shows errors, and navigates on valid submission

---

## Phase 5: User Story 4 - Emergency Contact Information (Priority: P2)

**Goal**: Traveler can provide emergency contact information (optional section)

**Independent Test**: Fill emergency contact section, verify data is captured; leave empty, verify form still submits

### Implementation for User Story 4

- [x] T027 [P] [US4] Generate emergency-contact-form component scaffold: ng generate component components/emergency-contact-form --standalone --skip-tests
- [x] T028 [US4] Implement emergency-contact-form.ts with reactive form for name and phone fields in frontend/src/app/components/emergency-contact-form/emergency-contact-form.ts
- [x] T029 [US4] Create emergency-contact-form.html with labeled fields, optional section header in frontend/src/app/components/emergency-contact-form/emergency-contact-form.html
- [x] T030 [US4] Style emergency-contact-form.scss matching passenger-form styling in frontend/src/app/components/emergency-contact-form/emergency-contact-form.scss
- [x] T031 [US4] Integrate emergency-contact-form into passenger-info page below passenger forms in frontend/src/app/pages/passenger-info/passenger-info.ts
- [x] T032 [US4] Update passenger-info.html to include emergency-contact-form section in frontend/src/app/pages/passenger-info/passenger-info.html
- [x] T033 [US4] Update form submission to include emergency contact data in BookingService in frontend/src/app/pages/passenger-info/passenger-info.ts

**Checkpoint**: Emergency contact section displays, data saves with booking when filled

---

## Phase 6: Polish & Edge Cases

**Purpose**: Handle edge cases and improve user experience

- [x] T034 Add data persistence to BookingService for back navigation and page refresh (use session storage backup to retain form data) in frontend/src/app/services/booking.service.ts
- [x] T035 Handle child passenger edge case: adjust form to not require email for children, use parent info in frontend/src/app/components/passenger-form/passenger-form.ts
- [x] T036 Add form data pre-fill for logged-in users (placeholder for future auth integration) in frontend/src/app/pages/passenger-info/passenger-info.ts
- [x] T037 Verify responsive layout at 768px breakpoint, adjust styles if needed in frontend/src/app/pages/passenger-info/passenger-info.scss
- [x] T038 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup (T001-T004)
- **User Story 2 (Phase 3)**: Depends on Setup; can run parallel with US1
- **User Story 3 (Phase 4)**: Depends on US1 completion (extends passenger-form)
- **User Story 4 (Phase 5)**: Depends on US1 completion (integrates into page)
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

```
Setup (T001-T004)
    │
    ├──► US1 (T005-T012) ──► US3 (T019-T026)
    │         │                    │
    │         └──────► US4 (T027-T033)
    │
    └──► US2 (T013-T018) ─────────────────────┐
                                              │
                                              ▼
                                       Polish (T034-T038)
```

### Parallel Opportunities

**Phase 1 (Setup)**:
- T001 and T002 can run in parallel (different model files)

**Phase 2 (US1)**:
- T005 and T009 can run in parallel (different component scaffolds)

**Phase 3 (US2)**:
- T013 can start while US1 is in progress (independent component)

**Phase 5 (US4)**:
- T027 can run in parallel with US3 tasks (different component)

---

## Parallel Example: Setup Phase

```bash
# Launch model creation in parallel:
Task: "Create Passenger interface in frontend/src/app/models/passenger.model.ts"
Task: "Create EmergencyContact and BookingDraft interfaces in frontend/src/app/models/booking.model.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: US1 - Enter Passenger Details (T005-T012)
3. Complete Phase 3: US2 - Flight Summary Sidebar (T013-T018)
4. Complete Phase 4: US3 - Validation and Submit (T019-T026)
5. **STOP and VALIDATE**: Test full form flow with validation
6. Deploy/demo if ready

### Full Feature Delivery

1. Complete MVP (Phases 1-4)
2. Add Phase 5: US4 - Emergency Contact (T027-T033)
3. Add Phase 6: Polish & Edge Cases (T034-T038)
4. Final validation with quickstart.md checklist

---

## Summary

| Phase | User Story | Tasks | Priority |
|-------|------------|-------|----------|
| 1 | Setup | T001-T004 (4) | - |
| 2 | US1: Enter Passenger Details | T005-T012 (8) | P1 🎯 MVP |
| 3 | US2: View Flight Summary | T013-T018 (6) | P1 |
| 4 | US3: Validate and Submit | T019-T026 (8) | P1 |
| 5 | US4: Emergency Contact | T027-T033 (7) | P2 |
| 6 | Polish | T034-T038 (5) | - |

**Total Tasks**: 38
**MVP Scope**: Phases 1-4 (26 tasks)
**Parallel Opportunities**: 8 tasks marked [P]

---

## Notes

- All file paths use `frontend/src/app/` prefix
- Angular CLI commands included for component generation
- Reactive Forms with built-in validators (no external dependencies)
- No test tasks included (not requested in spec)
- US1-US3 are all P1 priority (core functionality)
- US4 is P2 (enhancement)

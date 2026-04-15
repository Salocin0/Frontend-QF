# Skill Registry - QuickFood

## Project Context
- **Stack**: React 19, Bootstrap 5, SCSS, Jest+MSW testing
- **Architecture**: Component-based con hooks
- **Testing**: Jest, React Testing Library, MSW

## Available Skills (User-level)

| Skill | Trigger | Description |
|-------|---------|-------------|
| sdd-init | "sdd init", "iniciar sdd" | Initialize SDD context |
| sdd-explore | "/sdd-explore" | Explore and investigate ideas |
| sdd-propose | "/sdd-new", "/sdd-propose" | Create change proposal |
| sdd-spec | "/sdd-spec" | Write specifications |
| sdd-design | "/sdd-design" | Create technical design |
| sdd-tasks | "/sdd-tasks" | Break down into tasks |
| sdd-apply | "/sdd-apply" | Implement tasks |
| sdd-verify | "/sdd-verify" | Validate implementation |
| sdd-archive | "/sdd-archive" | Archive completed change |
| skill-creator | "create skill", "new skill" | Create new AI skills |
| go-testing | Go tests, Bubbletea | Go testing patterns (NOT USED) |

## Project Conventions
- Components in `src/components/`
- Hooks custom en `src/components/Hooks/`
- SCSS partials en `src/components/sass/partials/`
- Tests en `src/__tests__/`
- Mock services en `src/__mocks__/`
## Application rules
- Use distinct TanStack content routes with shared site chrome in the root layout, so information stays concise and independently shareable.
- Keep this prototype's booking in URL search state with a sample summary; no persistent storage or real submission is implied.
- Keep editable sample itinerary data in a shared client-safe module and mark unconfirmed details in the UI.
- Prebundle React, its renderer, and shared UI dependencies together in Vite to prevent mixed optimizer generations during preview updates.

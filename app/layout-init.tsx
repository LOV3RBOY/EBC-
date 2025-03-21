// Add this to your existing app/layout.tsx

import { initialize } from "./actions/init"

// Call this in your layout component
initialize().catch(console.error)


import { $ } from 'bun';

await $`bun scripts/build-stripe.ts`
await $`bun scripts/build-auth.ts`

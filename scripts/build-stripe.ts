import { $ } from 'bun';

await $`rm -rf dist/stripe-service`
await $`bun build --compile --minify --sourcemap --bytecode --target=bun-linux-x64 ./apps/stripe-service/index.ts --outfile dist/stripe-service`
await $`echo 'BUILD COMPLETED'`

await    $`cd apps/stripe-service && bun build --compile --minify --sourcemap --bytecode --target=bun-linux-x64 index.ts --outfile dist/stripe-service`
await    $`echo 'BUILD COMPLETED'`

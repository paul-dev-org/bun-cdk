import { $ } from 'bun';

await    $`rm -rf dist/auth-service`
await    $`bun build --compile --minify --sourcemap --bytecode --target=bun-linux-x64 ./apps/auth-service/index.ts --outfile dist/auth-service`
await    $`echo 'BUILD COMPLETED'`

await    $`cd apps/auth-service && bun build --compile --minify --sourcemap --bytecode --target=bun-linux-x64 index.ts --outfile dist/auth-service`
await    $`echo 'BUILD COMPLETED'`

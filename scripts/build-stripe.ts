import { $ } from 'bun';

await Promise.all([
    $`rm -rf dist/stripe-service`,
    $`bun build --compile --minify --sourcemap --bytecode --target=bun-linux-x64 ./apps/stripe-service/index.ts --outfile dist/stripe-service`,
    $`echo 'BUILD COMPLETED'`
])
import { $ } from 'bun';

await Promise.all([
    $`rm -rf dist/auth-service`,
    $`bun build --compile --minify --sourcemap --bytecode --target=bun-linux-x64 ./apps/auth-service/index.ts --outfile dist/auth-service`,
    $`echo 'BUILD COMPLETED'`
])
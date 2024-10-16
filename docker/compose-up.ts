import { $ } from 'bun';

await Promise.all([
    $`docker compose -f compose.yaml up`
])
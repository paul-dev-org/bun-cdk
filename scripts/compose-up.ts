import { $ } from 'bun';

await $`docker compose -f docker/compose.yaml up`

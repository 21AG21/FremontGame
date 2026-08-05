import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Pinned to the town's own timezone, and deliberately one that is
    // behind UTC. Half the day-arithmetic bugs this suite exists to
    // catch are invisible when the machine running the tests is on UTC,
    // which is what CI runners default to.
    env: { TZ: 'America/Los_Angeles' },
    include: ['src/**/*.test.js', 'scripts/**/*.test.mjs'],
    // Node by default. The pools and the day arithmetic have no DOM and
    // booting one for them costs about half a second each; the focus
    // trap is the one file that needs it, and asks by docblock.
    environment: 'node',
  },
})

# companion-surface-mirabox-stream-dock

Companion surface plugin for Mirabox Stream Dock devices and their OEM/clone rebrands. This repo (`justindanielsjr/companion-surface-mirabox-stream-dock`) is a fork of `bitfocus/companion-surface-mirabox-stream-dock`.

## Adding a new device model

Each device is a `StreamDockModelDefinition` in `src/models/`. A clone/rebrand of an existing device is added by spreading the existing definition and overriding `productName` + `usbIds` (see `src/models/Ajazz-AKP153.ts` for the pattern). New files must be registered in `src/models/list.ts` (both the import and the `AllModels` array).

`companion/manifest.json`'s `usbIds` is auto-generated from `AllModels` — never hand-edit it. Regenerate with:
```
yarn build   # runs tsc, then tools/update-usb-ids.mts
```

`companion/HELP.md` documents each device family under a heading; when a clone shares a layout, its name gets appended to the existing heading rather than getting a new section.

## Local dev environment notes

- `yarn install` requires `node` on PATH and corepack able to fetch `yarn@4.12.0` from `repo.yarnpkg.com`. If that fetch is blocked (e.g. sandboxed/proxied environments), `npm install` works as a fallback and produces an equivalent `node_modules` — just don't commit the resulting `package-lock.json` or `yarn.lock` diff (both are gitignored/should stay untouched; `git checkout -- yarn.lock` if it gets modified).
- The pre-commit hook (husky + lint-staged) shells out to `yarn lint:raw --fix`, which needs the same corepack yarn fetch — it will fail in network-restricted environments even when the code is fine. Verify manually first (`npx eslint`, `npx prettier --check`, `npx tsc -p tsconfig.build.json`) before using `--no-verify` in that situation.

## Testing against real Companion + hardware

This can only be verified on a machine with the physical device attached — not a cloud/sandboxed session.

- **Dev mode**: Companion launcher → cog icon → Settings → Advanced → Developer → enable "Developer Modules" → set "Developer modules path" to the *parent* folder containing this repo (not the repo folder itself). Companion hot-reloads `dist/main.js` on rebuild; enable the module under Modules → Surfaces.
- **Packaged install** (for handing off to another user without a build toolchain): `yarn package` produces a single `<manifest-id>-<version>.tgz` in the repo root. The other user imports it via Companion → Modules → "Import module package" (don't extract the tgz).
  - If an official release of this module is also installed, Companion can default to using that release build instead of the freshly imported one — the imported dev/custom build has to be explicitly selected/enabled (per-surface-instance module version picker) before its device support actually takes effect. Symptom: the device is detected, but the surface stays blank/unresponsive because it's still running the official build's model list.
- Always fully close the Mirabox/VSDinside creator software before connecting the device — it will otherwise grab the HID device before Companion can.

## Device status

### VSDinside M18 (added, PR #1: https://github.com/justindanielsjr/companion-surface-mirabox-stream-dock/pull/1)

- `src/models/VSDinside-M18.ts` — clones `M18V3Definition` (5x3 LCD grid + 3 non-LCD buttons at row 3) with `usbIds: [{ vendorId: 0x5548, productIds: [0x1000] }]`.
- Confirmed on real hardware: detected correctly, all 15 LCD tiles and all 3 non-LCD buttons work, behavior matches the OEM M18V3 exactly. No layout differences found.
- This PR targets the fork's own `main`, not upstream. The user (justindanielsjr) intends to open the upstream PR to `bitfocus/companion-surface-mirabox-stream-dock` themselves — this session does not have access to that repo.

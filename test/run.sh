#!/bin/bash
# Every suite, against the built app.js in the repo root.
#
# Needs React, ReactDOM and @babel/standalone vendored where $SP points, because
# the app loads them from a CDN the sandbox cannot reach and the harness serves
# them from disk instead:
#
#   export SP=/path/to/scratch
#   npm install --prefix "$SP/vendor" @babel/standalone@7.23.2 react@18.2.0 react-dom@18.2.0
#   node build.mjs && test/run.sh
#
cd "$(dirname "$0")/.." || exit 1
: "${SP:?set SP to a directory holding vendor/node_modules — see the comment above}"
bad=0
for f in err custom ready tick train cal fail plan weak build rank pct; do
  out=$(node "test/$f.mjs" 2>&1); rc=$?
  n=$(echo "$out" | grep -cE "^(FAIL|  FAIL)|^FAILS |FAIL:")
  if [ $rc -ne 0 ] || [ "$n" != "0" ]; then
    bad=1; echo "### $f  (exit $rc, $n fail lines)"
    echo "$out" | grep -E "^(FAIL|  FAIL)|FAIL:|Error|errors: [^n]" | head -8
  else echo "ok   $f"; fi
done
[ $bad -eq 0 ] && echo "ALL SUITES GREEN" || { echo "SOMETHING FAILED"; exit 1; }

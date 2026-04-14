#!/bin/bash
# Splits the two 3×3 PNG sprite sheets into 18 individual creature files.
# Usage: bash scripts/split-creatures.sh (run from repo root)

set -e

OUT="public/creature-charactors"
PACK1="$OUT/creature-happy-pack1.png"
PACK2="$OUT/creature-happy-pack2.png"

CELL_W=341
CELL_H=512

declare -A CREATURES
# pack:col:row → name
CREATURES["1:0:0"]="corgi"
CREATURES["1:1:0"]="samoyed"
CREATURES["1:2:0"]="husky"
CREATURES["1:0:1"]="panda"
CREATURES["1:1:1"]="chick"
CREATURES["1:2:1"]="bunny"
CREATURES["1:0:2"]="calico"
CREATURES["1:1:2"]="tiger"
CREATURES["1:2:2"]="monkey"
CREATURES["2:0:0"]="sloth"
CREATURES["2:1:0"]="dragon"
CREATURES["2:2:0"]="snake"
CREATURES["2:0:1"]="gecko"
CREATURES["2:1:1"]="cockatoo"
CREATURES["2:2:1"]="fish"
CREATURES["2:0:2"]="giraffe"
CREATURES["2:1:2"]="elephant"
CREATURES["2:2:2"]="leopard"

for key in "${!CREATURES[@]}"; do
  IFS=':' read -r pack col row <<< "$key"
  name="${CREATURES[$key]}"
  src="$PACK1"
  [[ "$pack" == "2" ]] && src="$PACK2"

  offset_h=$((row * CELL_H))
  offset_w=$((col * CELL_W))
  out_file="$OUT/${name}.png"

  sips --cropToHeightWidth $CELL_H $CELL_W \
       --cropOffset $offset_h $offset_w \
       "$src" --out "$out_file" > /dev/null

  echo "✓ $name → $out_file (col=$col row=$row)"
done

echo ""
echo "Done — 18 creature files written to $OUT/"

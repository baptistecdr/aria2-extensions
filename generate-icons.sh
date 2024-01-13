#!/usr/bin/env zsh

sizes=(16 19 24 32 38 48 80 96 128 256 512)

rm -rf dist
mkdir -p "dist"

for size in "${sizes[@]}"
do
  cp "icons/icon-browser.png" "dist/icon$size.png"
  sips -Z "$size" "dist/icon$size.png"
done

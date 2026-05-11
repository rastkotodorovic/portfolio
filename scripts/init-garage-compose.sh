#!/usr/bin/env sh
set -eu

BUCKET_NAME="${S3_BUCKET_NAME:-portfolio-images}"
ACCESS_KEY_ID="${S3_ACCESS_KEY_ID:-GK0123456789abcdef01234567}"
SECRET_ACCESS_KEY="${S3_SECRET_ACCESS_KEY:-0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef}"
GARAGE_CONFIG_FILE="${GARAGE_CONFIG_FILE:-/etc/garage-init.toml}"

printf "Waiting for Garage to accept CLI commands"
until garage -c "$GARAGE_CONFIG_FILE" node id -q >/tmp/magic-portfolio-garage-node-id 2>/dev/null; do
  printf "."
  sleep 1
done
printf "\n"

NODE_ID="$(cat /tmp/magic-portfolio-garage-node-id | awk '{print $1}' | cut -d '@' -f 1)"
NODE_PREFIX="$(printf "%s" "$NODE_ID" | cut -c 1-16)"
RPC_HOST="${NODE_ID}@garage:3901"

garage_cmd() {
  garage -c "$GARAGE_CONFIG_FILE" --rpc-host "$RPC_HOST" "$@"
}

if ! garage_cmd layout show 2>/dev/null | grep -q "$NODE_PREFIX"; then
  garage_cmd layout assign -z local -c 1GB "$NODE_ID"
  garage_cmd layout apply --version 1
fi

if ! garage_cmd key info "$ACCESS_KEY_ID" >/dev/null 2>&1; then
  garage_cmd key import --yes -n magic-portfolio "$ACCESS_KEY_ID" "$SECRET_ACCESS_KEY"
fi

if ! garage_cmd bucket info "$BUCKET_NAME" >/dev/null 2>&1; then
  garage_cmd bucket create "$BUCKET_NAME"
fi

garage_cmd bucket allow --read --write --owner --key "$ACCESS_KEY_ID" "$BUCKET_NAME" >/dev/null || true

node scripts/configure-garage-cors.mjs

printf "Garage is ready. Bucket: %s\n" "$BUCKET_NAME"

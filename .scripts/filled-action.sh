#!/usr/bin/env bash

set -eu

function error() {
  echo "🚨 Error: $1"
  exit 1
}

EMAIL="${EMAIL}"
PASSWORD="${PASSWORD}"

create_env_file() {
  filename=".env"

  # Escribe las variables de entorno en el archivo .env
  echo "EMAIL=$EMAIL" >> "$filename"
  echo "PASSWORD=$PASSWORD" >> "$filename"
  echo "HAS_GOOGLE_LOGIN=false" >> "$filename"
  echo "TOTAL_MONTH=2" >> "$filename"
  echo "INI_HOUR=09:00" >> "$filename"
  echo "END_HOUR=18:00" >> "$filename"
  echo "WOFFU_URL=https://nologis.woffu.com" >> "$filename"

  echo "Se ha creado el archivo $filename con éxito."
}

create_env_file
make fill-hours
rm -rf .env
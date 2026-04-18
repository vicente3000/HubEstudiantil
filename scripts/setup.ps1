Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot

function Ensure-EnvFile {
  param(
    [Parameter(Mandatory = $true)][string]$ExamplePath,
    [Parameter(Mandatory = $true)][string]$TargetPath
  )

  if (Test-Path -LiteralPath $TargetPath) {
    Write-Host "[skip] Ya existe $TargetPath"
    return
  }

  Copy-Item -LiteralPath $ExamplePath -Destination $TargetPath
  Write-Host "[ok] Creado $TargetPath desde su ejemplo"
}

function Install-AppDependencies {
  param(
    [Parameter(Mandatory = $true)][string]$AppPath,
    [Parameter(Mandatory = $true)][string]$Label
  )

  Push-Location $AppPath
  try {
    Write-Host "[run] Instalando dependencias de $Label"
    npm install
  }
  finally {
    Pop-Location
  }
}

Ensure-EnvFile -ExamplePath "$projectRoot\apps\api\.env.example" -TargetPath "$projectRoot\apps\api\.env"
Ensure-EnvFile -ExamplePath "$projectRoot\apps\web\.env.example" -TargetPath "$projectRoot\apps\web\.env"

Install-AppDependencies -AppPath "$projectRoot\apps\api" -Label "apps/api"
Install-AppDependencies -AppPath "$projectRoot\apps\web" -Label "apps/web"

Write-Host ""
Write-Host "Listo. Siguientes pasos recomendados:"
Write-Host "1. Levantar Postgres y Valkey con Podman."
Write-Host "2. Ejecutar 'npm run db:setup' dentro de apps/api."
Write-Host "3. Arrancar backend con 'npm run dev' en apps/api y frontend con 'npm run dev' en apps/web."

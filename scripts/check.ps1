Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot

function Invoke-AppCommand {
  param(
    [Parameter(Mandatory = $true)][string]$AppPath,
    [Parameter(Mandatory = $true)][string]$Command,
    [Parameter(Mandatory = $true)][string]$Label
  )

  Push-Location $AppPath
  try {
    Write-Host "[run] $Label"
    Invoke-Expression $Command
  }
  finally {
    Pop-Location
  }
}

Invoke-AppCommand -AppPath "$projectRoot\apps\api" -Command "npm run typecheck" -Label "TypeScript check del backend"
Invoke-AppCommand -AppPath "$projectRoot\apps\api" -Command "npm run build" -Label "Build del backend"
Invoke-AppCommand -AppPath "$projectRoot\apps\web" -Command "npm run build" -Label "Build del frontend"

Write-Host ""
Write-Host "Todos los checks base pasaron correctamente."

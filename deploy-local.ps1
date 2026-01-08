# Local deployment script for Hugo site
# Usage: .\deploy-local.ps1 [options]
#   Options:
#     -buildOnly    Only build the site, don't serve
#     -drafts       Include draft posts
#     -skipLatex    Skip LaTeX compilation

param(
    [switch]$buildOnly,
    [switch]$drafts,
    [switch]$skipLatex
)

$ErrorActionPreference = "Stop"

Write-Host "=== Hugo Local Deployment ===" -ForegroundColor Green

# Compile LaTeX files to PDF
if (-not $skipLatex) {
    Write-Host "Compiling LaTeX files..." -ForegroundColor Yellow
    $texFiles = Get-ChildItem -Path "." -Filter "*.tex" -Recurse -ErrorAction SilentlyContinue
    foreach ($tex in $texFiles) {
        Write-Host "  Compiling $($tex.FullName)..." -ForegroundColor Cyan
        $outputDir = $tex.DirectoryName
        Push-Location $outputDir
        try {
            # Run pdflatex twice for references
            pdflatex -interaction=nonstopmode $tex.Name | Out-Null
            pdflatex -interaction=nonstopmode $tex.Name | Out-Null
            Write-Host "  Done: $($tex.BaseName).pdf" -ForegroundColor Green
        } catch {
            Write-Host "  Failed to compile $($tex.Name)" -ForegroundColor Red
        }
        Pop-Location
    }
}

# Clean and build
Remove-Item -Path "public" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Building Hugo site..." -ForegroundColor Yellow
if ($drafts) {
    hugo --gc --minify --buildDrafts
} else {
    hugo --gc --minify
}

# Run Pagefind indexing
Write-Host "Running Pagefind indexing..." -ForegroundColor Yellow
npx pagefind

Write-Host "Build complete!" -ForegroundColor Green

# Serve the site if not build-only
if (-not $buildOnly) {
    Write-Host "Starting Hugo server at http://localhost:1313" -ForegroundColor Yellow
    if ($Drafts) {
        hugo server --disableFastRender --buildDrafts
    } else {
        hugo server --disableFastRender
    }
}

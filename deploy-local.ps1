# Local deployment script for Hugo site
# Usage: .\deploy-local.ps1 [options]
#   Options:
#     -buildOnly    Only build the site, don't serve
#     -drafts       Include draft posts
#     -skipLatex    Skip LaTeX compilation
#     -latexOnly    Only compile LaTeX files, skip Hugo build/serve

param(
    [switch]$buildOnly,
    [switch]$drafts,
    [switch]$skipLatex,
    [switch]$latexOnly
)

$ErrorActionPreference = "Stop"

Write-Host "=== Hugo Local Deployment ===" -ForegroundColor Green

# Compile LaTeX files to PDF
if ($latexOnly -or -not $skipLatex) {
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

# Exit early if latex-only mode
if ($latexOnly) {
    Write-Host "LaTeX compilation complete!" -ForegroundColor Green
    exit 0
}

# Clean and build
Write-Host "Clearing public cache..." -ForegroundColor Green
Remove-Item -Path "public" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Building Hugo site..." -ForegroundColor Yellow
if ($drafts) {
    hugo --environment development --gc --minify --buildDrafts
} else {
    hugo --environment development --gc --minify
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

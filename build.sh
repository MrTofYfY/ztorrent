@echo off
chcp 65001 >nul
echo ===============================================
echo      ZTorrent Desktop - Build Script (Electron)
echo ===============================================
echo.

:: Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js: https://nodejs.org/
    pause
    exit /b 1
)

:: Check npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm not found!
    pause
    exit /b 1
)

echo [OK] Node.js found
echo.

:: Install dependencies
echo [INFO] Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo [OK] Dependencies installed
echo.

:: Build executable
echo [INFO] Building ZTorrent.exe...
npm run build

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed!
    echo.
    echo If you see electron-builder error, try:
    echo   npm install electron-builder --save-dev
    echo.
    pause
    exit /b 1
)

echo.
echo ===============================================
echo        Build Successful!
echo ===============================================
echo.
echo Executable location:
dir /b /s dist\*.exe 2>nul
echo.
echo Press any key to open output folder...
pause >nul
explorer dist
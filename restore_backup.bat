@echo off
setlocal
chcp 65001 >nul 2>&1
echo ========================================================
echo   Restoring ZCode Original app.asar...
echo   正在恢复 ZCode 原始文件...
echo ========================================================

set ROOT_DIR=%~dp0..
set ASAR_DEST=%ROOT_DIR%\resources\app.asar
set ASAR_BAK=%ROOT_DIR%\resources\app.asar.bak

if not exist "%ASAR_BAK%" (
    echo [ERROR] Backup file not found: %ASAR_BAK%
    echo [错误] 未找到备份文件！
    pause
    exit /b 1
)

echo Restoring backup file...
echo 正在还原备份文件...
copy /Y "%ASAR_BAK%" "%ASAR_DEST%" >nul
if errorlevel 1 (
    echo [ERROR] Restore failed!
    echo [错误] 还原失败！
    pause
    exit /b 1
)

echo ========================================================
echo [SUCCESS] Original app.asar restored!
echo [成功] 原始 app.asar 已恢复！请重启 ZCode。
echo ========================================================
pause

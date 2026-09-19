const fs = require('fs');

const applyBat = `@echo off
setlocal
chcp 65001 >nul 2>&1
echo ========================================================
echo   Applying ZCode TTFT and Token Speed Display Patch...
echo   正在应用 ZCode TTFT 与 Token 速度显示补丁...
echo ========================================================

set ROOT_DIR=%~dp0..
set TEMP_DIR=%~dp0
set ASAR_SRC=%TEMP_DIR%extracted-asar
set PATCH_FILE=%TEMP_DIR%patched-assets\\styles-DIQgZMVI.js
set TARGET_JS=%ASAR_SRC%\\out\\renderer\\assets\\styles-DIQgZMVI.js
set ASAR_DEST=%ROOT_DIR%\\resources\\app.asar
set ASAR_BAK=%ROOT_DIR%\\resources\\app.asar.bak

if not exist "%PATCH_FILE%" (
    echo [ERROR] Patch file not found: %PATCH_FILE%
    echo [错误] 找不到补丁文件！
    pause
    exit /b 1
)

echo [1/3] Copying patched JS file to extracted-asar...
echo [1/3] 正在复制补丁文件到 extracted-asar...
copy /Y "%PATCH_FILE%" "%TARGET_JS%" >nul
if errorlevel 1 (
    echo [ERROR] Copy failed! Please check permissions.
    echo [错误] 复制失败，请检查权限。
    pause
    exit /b 1
)

echo [2/3] Checking and backing up original app.asar...
echo [2/3] 正在检查并备份原 app.asar...
if not exist "%ASAR_BAK%" (
    copy /Y "%ASAR_DEST%" "%ASAR_BAK%" >nul
    echo Created backup: %ASAR_BAK%
) else (
    echo Backup file already exists.
)

echo [3/3] Packing app.asar using @electron/asar (may take ~10-20 seconds)...
echo [3/3] 正在重新打包 app.asar...
call npx @electron/asar pack "%ASAR_SRC%" "%ASAR_DEST%"
if errorlevel 1 (
    echo [ERROR] Packing failed!
    echo [错误] 打包失败！
    pause
    exit /b 1
)

echo ========================================================
echo [SUCCESS] Patch successfully applied!
echo [成功] 补丁应用完成！请关闭并重新启动 ZCode 客户端体验。
echo ========================================================
pause
`;

const restoreBat = `@echo off
setlocal
chcp 65001 >nul 2>&1
echo ========================================================
echo   Restoring ZCode Original app.asar...
echo   正在恢复 ZCode 原始文件...
echo ========================================================

set ROOT_DIR=%~dp0..
set ASAR_DEST=%ROOT_DIR%\\resources\\app.asar
set ASAR_BAK=%ROOT_DIR%\\resources\\app.asar.bak

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
`;

fs.writeFileSync('temp/apply_patch.bat', applyBat, { encoding: 'utf8' });
fs.writeFileSync('temp/restore_backup.bat', restoreBat, { encoding: 'utf8' });
console.log('Successfully wrote apply_patch.bat and restore_backup.bat');

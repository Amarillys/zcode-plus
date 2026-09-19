@echo off
setlocal
chcp 65001 >nul 2>&1
title ZCode 一键打补丁工具

echo ========================================================
echo   ZCode Master Auto-Patcher (一键自动打补丁脚本)
echo ========================================================

node "%~dp0auto_patch.js"
if errorlevel 1 (
    echo.
    echo [ERROR] 补丁应用失败，请检查 Node.js 环境或权限！
    pause
    exit /b 1
)

echo.
echo [提示] 补丁已生效，请重新启动 ZCode 客户端体验！
pause

@echo off
set batDir=%~dp0

@echo on

schtasks.exe /delete /F /TN "WebDisk"
taskkill /f /t /im "nodeWebDisk.exe"
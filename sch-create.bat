@echo off
echo %~dp0
set batDir=%~dp0

@echo on

schtasks.exe /ru SYSTEM /Create /SC MINUTE /MO 10 /TN "WebDisk" /F /TR "'%batDir%\nodeWebDisk.exe' \"%batDir%\fileServer.js\" \"options[1]\""

schtasks.exe /Run /TN "WebDisk"

::schtasks.exe /ru SYSTEM /Create /SC MINUTE /MO 10 /TN "WebDisk" /F /TR "'E:\\0AUTOSTART\\WebDisk\\nodeWebDisk.exe' \"E:\\0AUTOSTART\\WebDisk\\fileServer.js\" \"options[1]\""
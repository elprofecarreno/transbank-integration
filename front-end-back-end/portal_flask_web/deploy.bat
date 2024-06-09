@echo off

REM Obtiene el ID del contenedor para portafolio-portal-web y lo elimina
for /f "tokens=1" %%i in ('docker ps -a ^| findstr "portafolio-portal-web"') do set CONTAINER_ID=%%i
if not "%CONTAINER_ID%"=="" docker rm -f %CONTAINER_ID%

REM Obtiene el ID de la imagen para portafolio-portal-web y la elimina
for /f "tokens=3" %%i in ('docker images ^| findstr "portafolio-portal-web"') do set IMAGE_ID=%%i
if not "%IMAGE_ID%"=="" docker rmi -f %IMAGE_ID%

REM Levanta los contenedores
docker compose up

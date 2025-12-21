@echo off
cd /d C:\Users\Usuario\Desktop\Miguel\Huerto\backend

REM Activar el entorno virtual
call .venv\Scripts\activate

REM Ejecutar el script con el Python del entorno
python run_climate_job.py

echo.
echo ================================
echo   FIN DEL SCRIPT - REVISA ERRORES
echo ================================
echo.
pause

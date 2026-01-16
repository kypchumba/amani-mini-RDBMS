@echo off
REM ------------------------------
REM run.bat - start Chama Dashboard
REM ------------------------------

echo Starting Chama Dashboard...

REM Activate virtual environment if it exists
if exist venv\Scripts\activate.bat (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
)

REM Install requirements
echo Installing Python dependencies...
pip install -r requirements.txt

REM Set Flask app and run
set FLASK_APP=app.py
set FLASK_ENV=development
echo Launching Flask...
flask run

pause

@echo off
echo ==============================================
echo Blue Horizon - Appium E2E Automation Setup
echo ==============================================

echo Checking Python installation...
python --version
if %ERRORLEVEL% NEQ 0 (
    echo Python is not installed or not in PATH! Please install Python.
    pause
    exit /b
)

echo Installing dependencies from requirements-test.txt...
pip install -r requirements-test.txt

echo.
echo Please ensure your Appium server is running and your Android Emulator/Device is connected.
echo You can start Appium in another terminal window by typing: appium
echo.
pause

echo Running the E2E Test Suite...
python test_appium_e2e.py

echo.
echo Testing finished. Check the generated Test_Report.xlsx for details.
pause

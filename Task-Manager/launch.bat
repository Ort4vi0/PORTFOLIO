@echo off
setlocal EnableExtensions EnableDelayedExpansion

rem Launcher do Task-Manager (Windows .bat)
rem Uso:
rem  - Duplo clique para abrir o menu
rem  - Ou via terminal: launch.bat [install|dev|prod|config|open]

set "ROOT=%~dp0"
set "SERVERDIR=%ROOT%"
set "PKG=%SERVERDIR%package.json"
set "ENVFILE=%SERVERDIR%.env"

if not exist "%PKG%" (
  echo [ERRO] package.json nao encontrado em "%SERVERDIR%".
  echo Verifique a estrutura do projeto.
  exit /b 1
)

if /I "%~1"=="install" call :EnsureNode ^& call :InstallDependencies ^& exit /b
if /I "%~1"=="setup"   call :FirstSetup ^& exit /b
if /I "%~1"=="start"   call :StartServer ^& exit /b
if /I "%~1"=="config"  call :ConfigureEnv ^& exit /b
if /I "%~1"=="open"    call :OpenFrontend ^& exit /b
if /I "%~1"=="mongo"   call :OpenMongoDB ^& exit /b

:menu
cls
echo.
echo ===============================
echo   Launcher - Task-Manager
echo ===============================
echo 1^) Primeira Inicializacao (Setup completo)
echo 2^) Verificar ambiente (Node/NPM)
echo 3^) Instalar dependencias
echo 4^) Configurar .env
echo 5^) Iniciar servidor (nodemon)
echo 6^) Abrir frontend (localhost)
echo 7^) Abrir MongoDB (para pegar token)
echo 8^) Sair
echo.
set /p "opt=Selecione uma opcao: "
if "%opt%"=="1" call :FirstSetup & pause & goto menu
if "%opt%"=="2" call :EnsureNode & pause & goto menu
if "%opt%"=="3" call :EnsureNode & call :InstallDependencies & pause & goto menu
if "%opt%"=="4" call :ConfigureEnv & pause & goto menu
if "%opt%"=="5" call :StartServer & goto menu
if "%opt%"=="6" call :OpenFrontend & pause & goto menu
if "%opt%"=="7" call :OpenMongoDB & pause & goto menu
if "%opt%"=="8" goto end
echo Opcao invalida.
timeout /t 1 >nul
goto menu

goto :eof

:EnsureNode
where node >nul 2>&1 || (
  echo [AVISO] Node.js nao encontrado. Instale de https://nodejs.org/
  goto :eof
)
where npm >nul 2>&1 || (
  echo [AVISO] NPM nao encontrado. Verifique a instalacao do Node.js.
  goto :eof
)
for /f "delims=" %%V in ('node -v') do set "NODEVER=%%V"
for /f "delims=" %%V in ('npm -v') do set "NPMVER=%%V"
echo [OK] Node: !NODEVER!
echo [OK] NPM:  !NPMVER!
goto :eof

:InstallDependencies
echo Instalando dependencias...
echo.
pushd "%SERVERDIR%"
call npm install
if errorlevel 1 (
  echo.
  echo [ERRO] Falha ao instalar dependencias.
  popd
  goto :eof
)
popd
echo.
echo [OK] Dependencias instaladas com sucesso!
goto :eof

:ConfigureEnv
cls
echo.
echo ========================================
echo          CONFIGURAR .env
echo ========================================
echo.
if exist "%ENVFILE%" (
  set /p "overwrite=.env ja existe. Sobrescrever? (S/n): "
  if /I "%overwrite%"=="n" (
    echo Mantendo .env atual.
    goto :eof
  )
)

cls
echo.
echo ========================================
echo       CONFIGURACAO - Porta do Servidor
echo ========================================
echo.
set "defaultPort=3030"
set "defaultDbLocal=mongodb://127.0.0.1:27017/task_manager"

set "port=%defaultPort%"
set /p "port=Porta do servidor [%defaultPort%]: "
if "%port%"=="" set "port=%defaultPort%"
set "_nonnum="
for /f "delims=0123456789" %%A in ("%port%") do set "_nonnum=%%A"
if defined _nonnum (
  echo Porta invalida. Usando %defaultPort%.
  set "port=%defaultPort%"
)

cls
echo.
echo ========================================
echo       CONFIGURACAO - MongoDB
echo ========================================
echo.
echo Escolha o tipo de conexao MongoDB:
echo.
echo  1^) Local (MongoDB instalado no seu PC)
echo  2^) Cloud (MongoDB Atlas)
echo.
set /p "dbType=Opcao [1]: "
if "%dbType%"=="" set "dbType=1"

if "%dbType%"=="1" (
  set "db=%defaultDbLocal%"
  echo.
  echo [OK] Usando MongoDB Local: !db!
) else (
  cls
  echo.
  echo ========================================
  echo     CONFIGURACAO - MongoDB Atlas
  echo ========================================
  echo.
  echo Cole a string de conexao do MongoDB Atlas completa:
  echo Exemplo: mongodb+srv://username:SUASENHA@cluster.mongodb.net/task_manager
  echo.
  set /p "dbLink=String de conexao: "
  
  set "db=!dbLink!"
  echo.
  echo [OK] String de conexao salva!
  echo.
  color 0C
  echo ========================================
  echo   ATENCAO: TROQUE SUA SENHA MANUALMENTE
  echo ========================================
  echo.
  echo Substitua ^<db_password^> pela sua senha real
  echo no arquivo .env apos a configuracao!
  echo.
  color 07
  pause
)

(
  echo port=%port%
  echo db=!db!
) > "%ENVFILE%"

cls
echo.
echo ========================================
echo          .env SALVO COM SUCESSO!
echo ========================================
echo.
echo Arquivo: %ENVFILE%
echo Porta: %port%
echo MongoDB: !db!
echo.
goto :eof

:StartServer
cls
echo.
echo ========================================
echo        INICIANDO SERVIDOR
echo ========================================
echo.
echo Modo: Desenvolvimento (nodemon)
echo.
start "Task-Manager" cmd /k "cd /d "%SERVERDIR%" && npm run dev"
echo [OK] Janela do servidor iniciada!
echo.
echo Aguardando servidor iniciar...
timeout /t 3 /nobreak >nul
call :OpenFrontend
goto :eof

:OpenFrontend
set "port="
if exist "%ENVFILE%" (
  for /f "usebackq tokens=1,2 delims==" %%A in ("%ENVFILE%") do (
    if /I "%%A"=="port" (
      set "port=%%B"
      set "port=!port: =!"
    )
  )
)
if "%port%"=="" set "port=3030"
set "URL=http://localhost:%port%"
echo.
echo [OK] Abrindo !URL! no navegador...
start "" "!URL!"
goto :eof

:FirstSetup
cls
echo.
echo ========================================
echo   PRIMEIRA INICIALIZACAO - Task-Manager
echo ========================================
echo.
echo Este processo ira:
echo  1. Verificar Node.js/NPM
echo  2. Instalar dependencias
echo  3. Abrir MongoDB Atlas (para pegar token)
echo  4. Configurar .env
echo  5. Iniciar o servidor
echo.
echo Pressione qualquer tecla para continuar...
pause >nul

cls
echo.
echo ========================================
echo        ETAPA 1/5 - Verificando Node.js
echo ========================================
echo.
call :EnsureNode
if errorlevel 1 (
  echo.
  echo [ERRO] Node.js nao encontrado. Instale primeiro.
  echo.
  pause
  goto :eof
)

cls
echo.
echo ========================================
echo    ETAPA 2/5 - Instalando Dependencias
echo ========================================
echo.
call :InstallDependencies
if errorlevel 1 (
  echo.
  echo [ERRO] Falha ao instalar dependencias.
  echo.
  pause
  goto :eof
)

cls
echo.
echo ========================================
echo     ETAPA 3/5 - MongoDB Atlas
echo ========================================
echo.
echo Abrindo MongoDB Atlas para voce pegar o token de conexao...
echo.
call :OpenMongoDB
echo Link aberto no navegador!
echo.
echo Copie a string de conexao do MongoDB e pressione qualquer tecla para continuar...
pause >nul

cls
echo.
echo ========================================
echo     ETAPA 4/5 - Configurar .env
echo ========================================
echo.
pause
call :ConfigureEnv

cls
echo.
echo ========================================
echo     ETAPA 5/5 - Iniciando Servidor
echo ========================================
echo.
echo Setup completo! Iniciando servidor em 3 segundos...
timeout /t 3 >nul
call :StartServer
goto :eof

:OpenMongoDB
cls
echo.
echo ========================================
echo          MONGODB ATLAS
echo ========================================
echo.
echo Abrindo MongoDB Atlas no navegador...
echo URL: https://cloud.mongodb.com/
echo.
start "" "https://cloud.mongodb.com/"
echo [OK] Link aberto!
goto :eof

:end
echo Ate mais!
exit /b 0

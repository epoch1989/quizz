@echo off
setlocal

rem Define the path to the data directory
set data_dir=data

rem Check if the data directory exists
if not exist "%data_dir%" (
    echo Data directory "%data_dir%" not found.
    pause
    exit /b 1
)

rem Define the path to the index.html file
set index_file=index.html

rem Define the path to the output image
set image_path=data/Ava.jpg

rem Create a new index.html file with updated content
(
    echo ^<!DOCTYPE html^>
    echo ^<html lang="pt-BR"^>
    echo ^<head^>
    echo ^    ^<meta charset="UTF-8"^>
    echo ^    ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^>
    echo ^    ^<title^>Quiz Z^</title^>
    echo ^    ^<link rel="stylesheet" href="styles.css"^>
    echo ^</head^>
    echo ^<body^>
    echo ^    ^<div class="container"^>
    echo ^        ^<div class="header"^>
    echo ^            ^<h1^>Quiz Z^</h1^>
    echo ^        ^</div^>
    echo ^        ^<div class="selection-container"^>
    echo ^            ^<label for="quiz-selector"^>Escolha uma prova:^</label^>
    echo ^            ^<select id="quiz-selector"^>
    echo ^                ^<option value=""^>Selecione a prova^</option^>

    rem Loop through all XML files in the data directory and add them to the select options
    for %%f in ("%data_dir%\*.xml") do (
        echo ^                ^<option value="%%f"^>%%~nxf^</option^>
    )

    echo ^            ^</select^>
    echo ^            ^<button id="start-btn" class="start-btn" onclick="startQuiz()"^>Iniciar Quiz^</button^>
    echo ^        ^</div^>
    echo ^        ^<div id="question-container" class="question-container"^>
    echo ^            ^<!-- Conteúdo da pergunta --^>
    echo ^            ^<div class="image-container"^>
    echo ^                ^<img src="data/Ava.jpg" alt="Imagem de exemplo"^>
    echo ^            ^</div^>
    echo ^        ^</div^>
    echo ^        ^<div class="options-container"^>^</div^>
    echo ^        ^<div class="feedback-container" id="feedback-container"^>^</div^>        
    echo ^        ^<div class="navigation" id="navigation" style="display: none;"^>
    echo ^            ^<button id="show-answer-btn" onclick="showAnswer()"^>Mostrar Resposta^</button^>
    echo ^            ^<button id="prev-btn" onclick="prevQuestion()"^>Anterior^</button^>
    echo ^            ^<button id="next-btn" onclick="nextQuestion()"^>Próximo^</button^>
    echo ^        ^</div^>
    echo ^        ^<div id="score-container" class="score-container"^>^</div^>
    echo ^        ^<div id="result-container" class="result-container" style="display: none;"^>^</div^>
    echo ^    ^</div^>
    echo ^    ^<script src="scripts.js"^>^</script^>
    echo ^</body^>
    echo ^</html^>
) > "%index_file%"

echo Index file updated successfully.
pause

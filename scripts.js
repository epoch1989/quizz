document.addEventListener("DOMContentLoaded", () => {
    let currentQuestionIndex = 0;
    let questions = [];
    let userAnswers = {};
    let correctAnswersCount = 0;
    let incorrectAnswersCount = 0;

window.startQuiz = function () {
    const selectedQuiz = document.getElementById('quiz-selector').value;
    if (!selectedQuiz) {
        alert("Por favor, selecione uma prova.");
        return;
    }

    fetch(selectedQuiz)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, 'text/xml');
            questions = Array.from(xml.getElementsByTagName('question'));
            document.querySelector('.selection-container').style.display = 'none';
            document.getElementById('navigation').style.display = 'block'; // Mostra a navegação
            displayQuestion(currentQuestionIndex);
            updateScore();
        });
};


function displayQuestion(index) {
    const question = questions[index];
    const questionNumber = question.querySelector('number').textContent;
    const exam = question.querySelector('exam');
    const questionText = question.querySelector('text').innerHTML; // Use innerHTML to preserve formatting
    const options = question.querySelectorAll('options option');
    const extraContent = question.querySelector('extraContent').innerHTML;

    // Atualiza o conteúdo do contêiner de perguntas
    document.getElementById('question-container').innerHTML = `
        <div><strong>Questão ${questionNumber}</strong></div>
        <div><em>${exam.querySelector('name').textContent}</em></div>
        <div><em>${exam.querySelector('organization').textContent}</em></div>
        <div><em>${exam.querySelector('year').textContent}</em></div>
        <div><em>${exam.querySelector('subject').textContent}</em></div>
        <div>${questionText}</div> <!-- Use questionText here -->
        <div class="image-container">${extraContent}</div>
    `;

    const optionsContainer = document.querySelector('.options-container');
    optionsContainer.innerHTML = '';  // Limpa as opções de resposta anteriores

    // Cria os botões de opções de resposta
    options.forEach((option, idx) => {
        const optionText = option.textContent;
        const correct = option.getAttribute('correct') === 'true';
        const optionElement = document.createElement('button');
        optionElement.textContent = optionText;
        optionElement.className = 'option';
        optionElement.onclick = () => selectOption(optionElement, correct, index, idx);
        optionsContainer.appendChild(optionElement);

        // Marca a opção selecionada pelo usuário, se existir
        if (userAnswers[index] !== undefined && userAnswers[index] === idx) {
            optionElement.classList.add('selected');
            if (correct) {
                optionElement.classList.add('correct');
            } else {
                optionElement.classList.add('incorrect');
            }
        }
    });

    // Limpa o feedback de resposta antes do botão "Mostrar Resposta"
    document.getElementById('feedback-container').innerHTML = '';
}




    function selectOption(optionElement, correct, questionIndex, optionIndex) {
    if (userAnswers[questionIndex] !== undefined) {
        alert("Você já respondeu esta pergunta.");
        return;
    }

    const options = document.querySelectorAll('.options-container .option');
    options.forEach(option => option.classList.remove('selected', 'correct', 'incorrect'));
    optionElement.classList.add('selected');
    if (correct) {
        optionElement.classList.add('correct');
        correctAnswersCount++;
    } else {
        optionElement.classList.add('incorrect');
        incorrectAnswersCount++;
    }
    userAnswers[questionIndex] = optionIndex;
    alert(correct ? 'Você acertou!' : 'Você errou!');
    updateScore();
}


    window.showAnswer = function () {
        const question = questions[currentQuestionIndex];
        const options = question.querySelectorAll('options option');

        options.forEach((option, idx) => {
            const correct = option.getAttribute('correct') === 'true';
            const optionElement = document.querySelector(`.options-container .option:nth-child(${idx + 1})`);
            if (correct) {
                optionElement.classList.add('correct');
            } else {
                optionElement.classList.add('incorrect');
            }
        });

        document.getElementById('feedback-container').innerHTML = `Resposta correta: ${question.querySelector('answer').textContent}`;
    };

    window.prevQuestion = function () {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion(currentQuestionIndex);
        }
        document.getElementById('feedback-container').innerHTML = '';
    };

    window.nextQuestion = function () {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion(currentQuestionIndex);
        } else {
            showFinalResult();
        }
        document.getElementById('feedback-container').innerHTML = '';
    };

    function updateScore() {
        const totalQuestions = questions.length;
        document.getElementById('score-container').textContent = `Acertos: ${correctAnswersCount}/${totalQuestions} | Erros: ${incorrectAnswersCount}/${totalQuestions}`;
    }

function showFinalResult() {
    const totalQuestions = questions.length;
    document.getElementById('result-container').innerHTML = `
        <div>Quiz Completo!</div>
        <div>Você acertou ${correctAnswersCount} de ${totalQuestions} perguntas.</div>
    `;
    document.getElementById('result-container').style.display = 'block';
    document.querySelector('.navigation').style.display = 'none';
    document.getElementById('question-container').style.display = 'none';
    document.querySelector('.options-container').style.display = 'none';
    document.getElementById('feedback-container').style.display = 'none';
    document.getElementById('score-container').style.display = 'none';
}

});

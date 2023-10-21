let display = document.getElementById('display');
let result = document.getElementById('result');
let isClicked = false;

function append(str) {
    display.value += str;
}

function clearDisplay() {
    display.value = '';
    result.textContent = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

// Prepare the expression for calculation
function prepareExpression(expression) {
    expression = expression.replace(/tanh|cos|log|sin|exp|sqrt|tan|ln|e|Π/g, match => {
        switch (match) {
            case 'tanh':
            case 'cos':
            case 'log':
            case 'sin':
            case 'exp':
            case 'sqrt':
            case 'tan':
                return 'Math.' + match;
            case 'ln':
                return 'Math.log';
            case 'e':
                return 'Math.E';
            case 'Π':
                return 'Math.PI';
            default:
                return match;
        }
    });
    return expression.replace(/\^/g, '**');
}

async function calculate() {
    let preparedExpression = prepareExpression(display.value);
    let response = await fetch('http://localhost:3000/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({expression: preparedExpression}),
    });
    let data = await response.json();
    if (data.error) {
        result.textContent = 'Error';
    } else {
        result.textContent = data.result;
        display.value = '';
        updateHistory();
    }
}

async function updateHistory() {
    let response = await fetch('http://localhost:3000/history');
    let data = await response.json();
    displayHistory(data);
}

function displayHistory(historyData) {
    let historyElement = document.getElementById('history');
    if(isClicked) {
        historyElement.style.display = 'block';
        historyElement.innerHTML = '';
        for (let i = historyData.length - 1; i >= 0; i--) {
            let li = document.createElement('li');
            li.textContent = historyData[i].expression + ' = ' + historyData[i].result;
            li.onclick = function() {
                display.value = historyData[i].expression;
            };
            historyElement.appendChild(li);
        }
    } else {
        historyElement.style.display = 'none';
    }
}

document.getElementById('history-button').onclick = function() {
    isClicked = !isClicked;
    updateHistory();
}

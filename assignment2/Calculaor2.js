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

async function calculate() {
    let response = await fetch('http://localhost:3000/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({expression: display.value}),
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
                calculate();
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

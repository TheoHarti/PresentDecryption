function encrypt() {
    processText(true);
}

function decrypt() {
    processText(false);
}

function processText(isEncrypting) {
    let key = document.getElementById('key').value.toUpperCase().replace(/[^A-Z]/g, '');
    let inputText = document.getElementById('inputText').value.toUpperCase().replace(/[^A-Z]/g, '');
    let outputText = '';
    let keyIndex = 0;

    for (let i = 0; i < inputText.length; i++) {
        let shift = key.charCodeAt(keyIndex % key.length) - 65;
        let charCode = inputText.charCodeAt(i) + (isEncrypting ? shift : -shift);
        if (charCode > 90) charCode -= 26;
        if (charCode < 65) charCode += 26;
        outputText += String.fromCharCode(charCode);

        keyIndex++;
    }

    document.getElementById('result').innerText = isEncrypting ? 'Encrypted: ' + outputText : 'Decrypted: ' + outputText;
}

function checkAnswer(step, correctAnswer) {
    var userAnswer = document.getElementById('answer' + step).value.toLowerCase().trim();
    if (userAnswer === correctAnswer) {
        if (step === 4) {
            document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
            document.getElementById('finalPage').style.display = 'block';
        } else {
            goToNextStep(step + 1);
        }
        
        if (step === 3) {
            startTimer()
        }

    } else {
        alert('Falsche Antwort, versuche es nochmal!');
    }
}

function goToNextStep(step) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.getElementById('riddlePage' + step).style.display = 'block';
}

function startTimer() {
    var duration = 180; // 3 minutes in seconds
    var timer = duration, minutes, seconds;
    var interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById('timer').textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            document.getElementById('timer').textContent = 'Zeit abgelaufen!';
            document.getElementById('nextButton').disabled = true;
        }
    }, 1000);

    document.getElementById('riddlePage4').style.display = 'block';
}
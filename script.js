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
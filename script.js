function decrypt() {
    const shift = 3; // Your chosen shift number
    let encryptedName = document.getElementById('encryptedName').value.toUpperCase();
    let decryptedName = '';

    for (let i = 0; i < encryptedName.length; i++) {
        if (encryptedName[i] != ' ') {
            let charCode = encryptedName.charCodeAt(i) - shift;
            if (charCode < 65) charCode += 26;
            decryptedName += String.fromCharCode(charCode);
        } else {
            decryptedName += ' ';
        }
    }

    document.getElementById('result').innerText = 'Entschlüsselter Name: ' + decryptedName;
}
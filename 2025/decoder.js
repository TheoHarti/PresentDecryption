// Decoder - Final Decryption
function finalDecrypt() {
  const c1 = document.getElementById('code1').value.trim();
  const c2 = document.getElementById('code2').value.trim();
  const c3 = document.getElementById('code3').value.trim();
  const c4 = document.getElementById('code4').value.trim();
  const encrypted = document.getElementById('encryptedName').value.trim();
  
  if (!c1 || !c2 || !c3 || !c4 || !encrypted) {
    document.getElementById('decryptedResult').textContent = 'Bitte alle vier Codes und den verschlüsselten Namen eingeben.';
    return;
  }
  
  const key = c1 + c2 + c3 + c4;
  const decrypted = decryptText(encrypted.toUpperCase(), key);
  document.getElementById('decryptedResult').textContent = 'Ergebnis: ' + decrypted;
}

function decryptText(cipher, key) {
  let totalShift = 0;
  for (let i = 0; i < key.length; i++) {
    totalShift += parseInt(key[i], 10) || 0;
  }
  totalShift = totalShift % 26;
  
  let result = '';
  for (let i = 0; i < cipher.length; i++) {
    const c = cipher.charCodeAt(i);
    if (c >= 65 && c <= 90) {
      const shift = (totalShift + i) % 26;
      let newChar = c - shift;
      if (newChar < 65) newChar += 26;
      result += String.fromCharCode(newChar);
    } else {
      result += cipher[i];
    }
  }
  return result;
}

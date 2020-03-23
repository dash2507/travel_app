var letters =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ \t\n\r';
const num_letters = letters.length;
const key = 3;
function encrypt(text, k = key) {
  let result = text.split('').map(char => {
    return letters.charAt((letters.indexOf(char) + k) % num_letters);
  }).join('');
  return result;
}

function decrypt(text, k = key) {
  let result = text.split('').map(char => {
    return letters.charAt((letters.indexOf(char) - k) % num_letters);
  }).join('');
  return result;
}

export {encrypt, decrypt};

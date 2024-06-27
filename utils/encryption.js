const crypto = require('crypto');

exports.generateKeyPair = async function () {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      }
    }, (err, publicKey, privateKey) => {
      if (err) {
        return reject(err);
      }
      resolve({ publicKey, privateKey });
    });
  });
}

exports.encryptData = async function (data, publicKey) {
  const buffer = Buffer.from(data, 'utf8');
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString('base64');
}

exports.decryptData = async function (data, privateKey) {
  const buffer = Buffer.from(data, 'base64');
  const decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString('utf8');
}

exports.createSignatureHash = function(signatureId) {
  const hash = crypto.createHash('sha256');
  hash.update(signatureId);
  return hash.digest('hex');
}

exports.shuffleArray = function(array, hashes) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
    [hashes[i], hashes[j]] = [hashes[j], hashes[i]]; // Swap elements
  }
  return { array, hashes };
}
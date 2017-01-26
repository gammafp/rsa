var keys = require('./keys.json');
var RSA = require('./rsa');

// Instanciamos RSA
var rsa = new RSA(keys.N, keys.E, keys.D);
// Firmamos la clave
console.log(rsa.Sign("1234"));
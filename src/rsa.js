var keys = require('./rsaKeys.json');
var BigInt = require('node-jsbn');
'use strict';
class RSA {
    constructor(N, E, D) {
        this.N = (typeof(N) == 'String') ? new BigInt(N, 16) : new BigInt(N.toString(), 16);
        this.E = (typeof(E) == 'String') ? new BigInt(E, 10) : new BigInt(E.toString(), 10);
        this.D = (typeof(D) == 'String') ? new BigInt(D, 16) : new BigInt(D.toString(), 16);
        
        this.blockSize = Math.floor((this.N.bitLength() + 7) / 8);
    }
    Sign(src) {
        // Se comprueba que sea un string, y si no lo es este se convierte a string
        var srcString = (typeof(src) != 'string') ? src.toString() : src;
        
        // Convertimos el string a unicode para poder agregarle el padding y poder encriptar
        var mensaje = [].map.call(srcString, (x) => {
            return x.charCodeAt(0);
        });

        // Se agrega el padding
        var padding = this.PADDING(mensaje);
        // El array resultando se convierte a numeros para poder usar la formula de RSA m^d MOD n
        var biPad = new BigInt(padding);
        // Se hace la formula RSA luego se convierte a un string hexadecimal.
        return this.keyPrivate(biPad).toString(16).toUpperCase();
        
    }

    keyPrivate(m) {
        return m.modPow(this.D, this.N);
    }

    keyPublic(m) {
        return m.modPow(this.E, this.N);
    }

    // Solo FULLBYTES
    PADDING(src) {
        /* El tamaño del array restandole el tamaño del src y restandole un tres que corresponden
        al tamaño de los separadores y el tipo de padding a aplicar */
        var arraySize = this.blockSize - src.length - 3;
        var padding = new Array(arraySize);
        // Fill rellena el array que se ha creado
        padding.fill(0xFF);

        // Marca de tipo (FULLBYTE = 1, RANDOMBYTE = 2)
        padding.unshift(1);
        // Marca de inicio, tiene que ser cero
        padding.unshift(0);

        // Marca de separacion entre padding y mensaje
        padding.push(0, ...src);

        return padding;
    
    }
}

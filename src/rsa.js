// var keys = require('./keys.json');
var BigInt = require('node-jsbn');

/**
 * @author Francisco José Pereira Alvarado <gammafp@gmail.com>
 * @version 26.1.17
 */

/**
 * Clase encriptación RSA
 */

class RSA {
    /**
     * Asignamos las claves publica y la privada
     * @param {string} N - Modulus, es parte de la clave publica, el modulus se tiene que pasar con un numero Hexadecimal en String.
     * @param {string} E - Exponente, es parte de la clave publica el exponente se tiene que pasar como un numero decimal en String.
     * @param {string} D - Es la llave privada, se usa para firmar, la llave privada se tiene que pasar como un Hexadecimal en String.
     */
    constructor(N, E, D) {
        this.N = (typeof(N) == 'String') ? new BigInt(N, 16) : new BigInt(N.toString(), 16);
        this.E = (typeof(E) == 'String') ? new BigInt(E, 10) : new BigInt(E.toString(), 10);
        this.D = (typeof(D) == 'String') ? new BigInt(D, 16) : new BigInt(D.toString(), 16);
        
        this.blockSize = Math.floor((this.N.bitLength() + 7) / 8);
    }
    /**
     * Metodo de firma RSA
     * @param {string} Recibe un numero (tambien puede ser un texto) que se tiene que pasar como cadena de texto.
     * @return {string} Devolverá la el numero firmado y encriptado con RSA (en hexadecimal). 
     */
    Sign(src) {
        /** Se comprueba que sea un string, y si no lo es este se convierte a string */
        var srcString = (typeof(src) != 'string') ? src.toString() : src;
        
        /** Convertimos el string a unicode para poder agregarle el padding y poder encriptar */
        var mensaje = [].map.call(srcString, (x) => {
            return x.charCodeAt(0);
        });

        /** Se agrega el padding */
        var padding = this.PADDING(mensaje);
        /** El array resultando se convierte a numeros para poder usar la formula de RSA m^d MOD n */
        var biPad = new BigInt(padding);
        /** Se hace la formula RSA luego se convierte a un string hexadecimal. */
        return this.keyPrivate(biPad).toString(16).toUpperCase();
        
    }
    /**
     * Formula para encriptar con la clave privada.
     * @return {BigInt} Devuelve el resultado de aplicar la formula.
     */
    keyPrivate(m) {
        return m.modPow(this.D, this.N);
    }
    /**
     * Formula para verificar la firma.
     * @return {BigInt} Devuelve el resultado de alicar la formula.
     */
    keyPublic(m) {
        return m.modPow(this.E, this.N);
    }

    /**
     * Metodo que nos sirve para agregar el relleno
     * @return {array} Devuelve un array con los padding agregados 
     * cuyo orden es mas o menos parecido a esto: [0, 1, 255, 255, 255, 0, 97, 43]
     * donde los ceros indican separacion y el 1 del indice 1 indica el tipo de 
     * array, en este caso el 1 es FULLBYTE.
     * los numeros finales del array despues del segundo cero, es el mensaje codificado en unicode para cada caracter.
     */
    PADDING(src) {
        /** El tamaño del array restandole el tamaño del src y restandole un tres que corresponden
        al tamaño de los separadores y el tipo de padding a aplicar */
        var arraySize = this.blockSize - src.length - 3;
        var padding = new Array(arraySize);
        /** Fill rellena el array que se ha creado */
        padding.fill(0xFF);

        /** Marca de tipo (FULLBYTE = 1, RANDOMBYTE = 2) */
        padding.unshift(1);
        /** Marca de inicio, tiene que ser cero */
        padding.unshift(0);

        /** Marca de separacion entre padding y mensaje */
        padding.push(0, ...src);

        return padding;
    
    }
}

module.exports = RSA;
// var keys = require('./keys.json');
var BigInt = require('node-jsbn');

/**
 * @author Francisco José Pereira Alvarado <gammafp@gmail.com>
 * @version 27.1.17
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
        /** El tamaño del bloque N, esto se usará para crear el padding y la extructura del mensaje rsa */
        this.blockSize = Math.floor((this.N.bitLength() + 7) / 8);
    }
    /**
     * Metodo de firma RSA
     * @param {string} Recibe un numero (tambien puede ser un texto) que se tiene que pasar como cadena de texto (los números tambien se pueden pasar como texto ejemplo: "123987").
     * @return {string} Devolverá el número firmado y encriptado con RSA (en hexadecimal). 
     */
    Sign(src) {
        /** Se comprueba que sea un String/texto, y si no lo es este se convierte a String/texto */
        var srcString = (typeof(src) != 'string') ? src.toString() : src;
        
        /** Convertimos el string a unicode para poder agregarle el padding y poder encriptar */
        var mensaje = [].map.call(srcString, (x) => {
            return x.charCodeAt(0);
        });

        /** Se agrega el padding */
        var padding = this.PADDING(mensaje);
        /** El array resultando se convierte a numeros para poder usar la formula de RSA m^d MOD n */
        var biPad = new BigInt(padding);
        /** Se hace la formula RSA luego se convierte a un String/texto hexadecimal (algo parecido a esto "5A3F8E..."). */
        return this.keyPrivate(biPad).toString(16).toUpperCase();
        
    }
     /**
     * Método que sirve para Desenriptar mensajes que vienen firmados con la clave pública.
     * @param {string} Recibe un string hexadecimal que es generado por el que te envia el mensaje (firmado con la clave publica) 
     * @return {string} Devuelve una el mensaje ya desencriptado.
     */
    Decrypt(src) {
        // El mensaje llega cifrado en formato hexadecimal string
        var mensajeCifrado = new BigInt(src, 16);
        // Se usa la llave privada para poder descifrar el mensaje
        // Nota: el bigInt ya sabe como trabajar y convertir automaticamente hexadecimal a entero
        var descifradoConPadding = this.keyPrivate(mensajeCifrado).toByteArray();
        // Se le quita el padding
        var unpadding = this.UNPADDING(descifradoConPadding);
        // Volvemos a convertir de unicode a caracteres
        var mensajeDescifrado = unpadding.map( (x, i) => {
            return String.fromCharCode(x);
        });
        return mensajeDescifrado.join('');
    }

    // --------------->> Sección para usar la formula con la llave pública o privada
   /**
     * Formula para encriptar con la clave privada o descencriptar un mensaje que es encriptado con la llave pública
     * @return {BigInt} Devuelve el resultado de aplicar la formula.
     */
    keyPrivate(m) {
        return m.modPow(this.D, this.N);
    }
    
    /**
     * Formula para encriptar con clave publica o para verificar las llaves firmada con la clave privada
     * @return {BigInt} Devuelve el resultado de alicar la formula.
     */
    keyPublic(m) {
        return m.modPow(this.E, this.N);
    }

    // --------------->> Sección de PADDING y UNPADDING
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
    /**
     * Metodo que sirve para quitar el relleno
     * @return {array} Devuelve un array sin los padding/relleno.
     */
    UNPADDING(src) {
        // cl("src puro: ", src)
        var salida = [];
        var i = 0; 
        var n = this.blockSize;

       // Comprueba que el tipo de bite no empiece por cero o por dos
       if(src[0] == 0 || src[0] > 2) {
            console.log("Error en el tipo de clave RSA");
            return [0];
        }
        i++;
        // se sacan todos los datos despues del cero
        while(src[i] != 0) {
            // si hay mas datos 
            if (++i >= src.length) {
                console.log("error: No se encontró byte de separación");
                return [0];
            }
        }
        // Volcado del mensaje final
        for(var p = 0; ++i < src.length; p++) {
            salida.push(src[i]);
        }
        return salida;
    }

}

module.exports = RSA;
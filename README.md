# rsa
Una mini libreria para poder desencriptar y encriptar con rsa, teniendo previamente las claves N, D y E.

### Lo necesario para ejecutar JavaScript
Para poder ejecutar el archivo **rsa** es necesario tener instalado lo siguiente:
* [nodeJS](https://nodejs.org/en/)
* node-jsbn (como dependencia para poder usar bigInteger)

### Uso
Una vez descargado el repositorio abrimos una consola/terminal en la raíz del mismo y escribimos **npm install** y se descargaran todas las despendencias necesarias para el uso.

Para poder usar la clase la podemos instanciar de la siguiente manera, pasandole las respectivas llaves publicas y privadas en el siguiente orden (n, e, d).

```
var rsa = new RSA(keyN, keyE, keyD);
console.log(rsa.sign("12345")); // devolverá el parametro ya firmado y encriptado (el tamaño es de 256 caracteres hexadecimales)
```

En el repositorio cuenta con todo lo neceario para hacer una prueba (llaves n, e, d y un archivo de prueba), solamente basta con ejecutar el archivo llamado ``test.js`` que se encuentra dentro de la carpeta llamda ``src``.

Para ejecutarlo solo hace falta ubicarnos en la carpeta **src** y dentro se encuentra ``test.js``, una vez dentro escribimos ``npm test.js``.
 

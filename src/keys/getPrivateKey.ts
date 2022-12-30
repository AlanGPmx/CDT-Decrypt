import {TextAccessPrivateTypes} from '../Types/RequestResponseType';
import {PrivateKey} from '../interfaces/privateKey';
import {Texto} from '../interfaces/texto';
import {getRequestAndResponseAPILLaves} from '../utils/getAPISeguridadText';

/**
 *   Obtener Llave Privada del Request (Segundo Endpoint de Llaves)
 */
export const getPrivateKey = (
	textoUnaLinea: string,
	texto: Texto,
	endpoint: number
): PrivateKey => {
	const textAccessPrivate: TextAccessPrivateTypes =
		getRequestAndResponseAPILLaves(textoUnaLinea, endpoint, texto.idAcceso);

	if (textAccessPrivate === undefined || textAccessPrivate === null) {
		console.log('No se encontró el texto de acceso privado');
	}

	let llavePrivada: TextAccessPrivateTypes = textAccessPrivate![0].match(
		/("|\\")accesoPrivado("|\\")(\s?)+:(\s?)+("|\\")[\d\w+=/-≤.]+("|\\")/
	);

	llavePrivada = llavePrivada![0].split('"')[3];
	texto.paraDesencriptar = texto.paraDesencriptar.split('\n').join('');

	if (endpoint === 1) {
		let textoParaDesencriptar =
			texto.paraDesencriptar.match(
				/\{["\\\s]+codigo["\\\s]+:["\\\s]+.*\}\}/gi
			) === null
				? '{}'
				: texto.paraDesencriptar
						.match(/\{["\\\s]+codigo["\\\s]+:["\\\s]+.*\}\}/gi)![0]
						.toString(); // response;

		return {
			llavePrivada,
			texto: textoParaDesencriptar,
		};
	} else {
		let textoParaDesencriptar =
			texto.paraDesencriptar.match(
				/\{["\\\s]+urlApi["\\\s]+:["\\\s]+.*["\\\s]\}\]\}(\d{4}-)?/gi
			) === null
				? '{}'
				: texto.paraDesencriptar
						.match(
							/\{["\\\s]+urlApi["\\\s]+:["\\\s]+.*["\\\s]\}\]\}(\d{4}-)?/gi
						)![0]
						.toString(); // request

		return {
			llavePrivada,
			texto:
				textoParaDesencriptar.slice(-5).match(/\d{4}-/gi) === null
					? textoParaDesencriptar
					: textoParaDesencriptar.slice(0, -5),
		};
	}
};

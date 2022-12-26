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

	const llavePrivada = textAccessPrivate![0]
		.match(/"accesoPrivado": "[A-Za-z0-9+=\/\-\≤\.]+"/gm)![0]
		.split('"')[3];

	texto.paraDesencriptar = texto.paraDesencriptar.split('\n').join('');

	if (endpoint === 1) {
		let textoParaDesencriptar =
			texto.paraDesencriptar.match(
				/\{(\s?)+("|\\")codigo("|\\")(\s?)+(.+)\}\}/g
			) === null
				? '{}'
				: texto.paraDesencriptar
						.match(/\{(\s?)+("|\\")codigo("|\\")(\s?)+(.+)\}\}/g)![0]
						.toString(); // response;

		return {
			llavePrivada,
			texto: textoParaDesencriptar,
		};
	} else {
		let textoParaDesencriptar =
			texto.paraDesencriptar.match(
				/\{(\s?)+("|\\")urlApi("|\\")(\s?)+(.+)\]\}/g
			) === null
				? '{}'
				: texto.paraDesencriptar
						.match(/\{(\s?)+("|\\")urlApi("|\\")(\s?)+(.+)\]\}/g)![0]
						.toString(); // request

		return {
			llavePrivada,
			texto: textoParaDesencriptar,
		};
	}
};

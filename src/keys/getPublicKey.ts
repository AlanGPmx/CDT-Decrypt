/**
 *     WIP: FALTA TEMRINAR
 */

import {TextAccessPrivateTypes} from '../Types/RequestResponseType';
import {Texto} from '../interfaces/texto';
import {getRequestAndResponseAPILLaves} from '../utils/getAPISeguridadText';

/**
 *   Obtener Llave Privada del Request (Segundo Endpoint de Llaves)               WIP!
 */
const getPublicKey = (
	textoUnaLinea: string,
	texto: Texto,
	endpoint: number
): string => {
	const textAccessPrivate: TextAccessPrivateTypes =
		getRequestAndResponseAPILLaves(textoUnaLinea, endpoint, texto.idAcceso);

	const llavePublica = textAccessPrivate![0]
		.match(/"accesoPublico": "[A-Za-z0-9+=\/\-\≤\.]+"/gm)![0]
		.split('"')[3];
	return llavePublica;
};

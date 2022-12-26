import {TextAccessPrivateTypes} from '../Types/RequestResponseType';

/**
 *\ {2} Extraer seccion de texto que contiene el request y el response del endpoint de llaves
 */
export const getRequestAndResponseAPILLaves = (
	texto: string,
	endpoint: number,
	idAcceso: string
): TextAccessPrivateTypes => {
	let textAccessPrivate: TextAccessPrivateTypes;
	texto = texto.split('\n').join('');
	if (endpoint === 1) {
		const regex = `INFO(\\s?)+FrontLogs(\\s?)+-(\\s?)+request:(\\s?)+{(\\s?)+("|\\\\")urlApi("|\\\\"):(\\s?)+("|\\\\")https:\\/\\/prod-api.bancoazteca.com:8080\\/credito\\/seguridad\\/v1\\/aplicaciones\\/llaves("|\\\\"),(\\s?)+("|\\\\")token("|\\\\"):(\\s?)+("|\\\\")[\\w\\d+=/\\-≤.�]+("|\\\\"),(\\s?)+("|\\\\")method("|\\\\"):(\\s?)+("|\\\\")GET("|\\\\"),(\\s?)+("|\\\\")json("|\\\\"):(\\s?)+{},(\\s?)+("|\\\\")headers("|\\\\"):(\\s?)+\\[\\](\\s?)+}(\\s?)+(\\d{4}(-\\d{2}){2}(\\s?)+\\d{2}(:\\d{2}){2}),\\d+(\\s?)+\\[\\d+\\](\\s?)+INFO(\\s?)+FrontLogs(\\s?)+-(\\s?)+response:(\\s?)+{(\\s?)+("|\\\\")codigo("|\\\\"):(\\s?)+("|\\\\")[\\w\\d+=/\\-≤.�]+("|\\\\"),(\\s?)+("|\\\\")mensaje("|\\\\"):(\\s?)+("|\\\\")[\\w\\d\\s+=/\\-≤.�]+("|\\\\"),(\\s?)+("|\\\\")folio("|\\\\"):(\\s?)+("|\\\\")[\\w\\d\\s+=/\\-≤.�]+("|\\\\"),(\\s?)+("|\\\\")resultado("|\\\\"):(\\s?)+{(\\s?)+("|\\\\")idAcceso("|\\\\"):(\\s?)+("|\\\\")${idAcceso}("|\\\\"),(\\s?)+("|\\\\")accesoPublico("|\\\\"):(\\s?)+("|\\\\")[\\w\\d\\s+=/\\-≤.�]+("|\\\\"),(\\s?)+("|\\\\")accesoPrivado("|\\\\"):(\\s?)+("|\\\\")[\\w\\d\\s+=/\\-≤.�]+("|\\\\"),(\\s?)+("|\\\\")accesoSimetrico("|\\\\"):(\\s?)+("|\\\\")[\\w\\d\\s+=/\\-≤.�]+("|\\\\"),(\\s?)+("|\\\\")codigoAutentificacionHash("|\\\\"):(\\s?)+("|\\\\")[\\w\\d\\s+=/\\-≤.�]+("|\\\\")(\\s?)+}(\\s?)+}`;
		textAccessPrivate = texto.match(new RegExp(regex, 'g'));
	} else if (endpoint === 2) {
		const regex = `INFO(\\s?)+FrontLogs(\\s?)+-(\\s?)+request:(\\s?)+{(\\s?)+(\\"|\\\\")urlApi(\\"|\\\\"):(\\s?)+(\\"|\\\\")https:\/\/prod-api.bancoazteca.com:8080\/credito\/seguridad\/v1\/aplicaciones\/llaves\/${idAcceso}(\\"|\\\\"),(\\s?)+(\\"|\\\\")token(\\"|\\\\"):(\\s?)+(\\"|\\\\")[\\w\\d+=/\\-≤.�]+(\\"|\\\\"),(\\s?)+(\\"|\\\\")method(\\"|\\\\"):(\\s?)+(\\"|\\\\")GET(\\"|\\\\"),(\\s?)+(\\"|\\\\")json(\\"|\\\\"):(\\s?)+{},(\\s?)+(\\"|\\\\")headers(\\"|\\\\"):(\\s?)+\\[\\]}(\\s?)+(\\d{4}(-\\d{2}){2}(\\s?)+\\d{2}(:\\d{2}){2}),\\d+(\\s?)+\\[\\d+\\](\\s?)+INFO(\\s?)+FrontLogs(\\s?)+-(\\s?)+response:(\\s?)+{(\\s?)+(\\"|\\\\")codigo(\\"|\\\\"):(\\s?)+(\\"|\\\\")[\\w\\\d+=/\\-≤.�]+(\\"|\\\\"),(\\s?)+(\\"|\\\\")mensaje(\\"|\\\\"):(\\s?)+(\\"|\\\\")[\\w\\d\\s+=/\\-≤.�]+(\\"|\\\\"),(\\s?)+(\\"|\\\\")folio(\\"|\\\\"):(\\s?)+(\\"|\\\\")[\\w\\d\\s+=/\\-≤.�]+(\\"|\\\\"),(\\s?)+(\\"|\\\\")resultado(\\"|\\\\"):(\\s?)+{(\\s?)+(\\"|\\\\")accesoPublico(\\"|\\\\"):(\\s?)+(\\"|\\\\")[\\w\\d\\s+=/\\-≤.�]+(\\"|\\\\"),(\\s?)+(\\"|\\\\")accesoPrivado(\\"|\\\\"):(\\s?)+(\\"|\\\\")[\\w\\d\\s+=/\\-≤.�]+(\\"|\\\\"),(\\s?)+(\\"|\\\\")accesoSimetrico(\\"|\\\\"):(\\s?)+(\\"|\\\\")[\\w\\d\\s+=/\\-≤.�]+(\\"|\\\\"),(\\s?)+(\\"|\\\\")codigoAutentificacionHash(\\"|\\\\"):(\\s?)+(\\"|\\\\")[\\w\\d\\s+=/\\-≤.�]+(\\"|\\\\")}}`;
		textAccessPrivate = texto.match(new RegExp(regex, 'g'));
	} else {
		return 'No se especifico el endpoint de llaves a buscar';
	}

	if (!textAccessPrivate) {
		return 'No se encontraron coincidencias en la expresión regular del endpoint de llaves';
	}

	return textAccessPrivate;
};

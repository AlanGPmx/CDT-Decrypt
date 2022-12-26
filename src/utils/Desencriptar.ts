import * as fCrypto from 'crypto';

export const desencriptarObjeto = async (objeto: {}, accesoPrivado: string) => {
	let objetoDesencriptado = {};

	for (const valor in objeto) {
		const valorObjeto = objeto[valor as keyof {}];

		if (typeof valorObjeto === 'object') {
			if (Object.prototype.toString.call(valorObjeto) === '[object Array]') {
				const desencriptarValores = await desencriptarObjeto(
					valorObjeto,
					accesoPrivado
				);
				const arrayDesencriptado = Object.entries(desencriptarValores).map(
					(elemento) => elemento[1]
				);

				objetoDesencriptado = {
					...objetoDesencriptado,
					[valor]: arrayDesencriptado,
				};
			} else if (
				Object.prototype.toString.call(valorObjeto) === '[object Object]'
			) {
				objetoDesencriptado = {
					...objetoDesencriptado,
					[valor]: await desencriptarObjeto(valorObjeto, accesoPrivado),
				};
			}
		} else {
			const valorDesencriptado = await funcionDesencriptado(
				valorObjeto,
				accesoPrivado
			);

			objetoDesencriptado = {
				...objetoDesencriptado,
				[valor]: valorDesencriptado ? valorDesencriptado : valorObjeto,
			};
		}
	}
	return objetoDesencriptado;
};

const funcionDesencriptado = (
	valor: string | number,
	accesoPrivado: string
) => {
	try {
		const formatoAcceso = `-----BEGIN PRIVATE KEY-----\n${accesoPrivado}\n-----END PRIVATE KEY-----`;
		let valorBinario = Buffer.from(String(valor), 'base64');

		const desencriptarValor = fCrypto
			.privateDecrypt(
				{
					key: formatoAcceso,
					padding: fCrypto.constants.RSA_PKCS1_PADDING,
				},
				valorBinario
			)
			.toString();

		return desencriptarValor;
	} catch (error) {
		return false;
	}
};

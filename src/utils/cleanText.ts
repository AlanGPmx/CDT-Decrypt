export const cleanText = (texto: string): string => {
	let lines = texto.split('\n');
	for (let i = 0; i < lines.length; i++) {
		lines[i] = lines[i].trim();
	}

	return lines.join('').trim();
};

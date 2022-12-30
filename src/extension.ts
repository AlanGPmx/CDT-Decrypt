// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {posix} from 'path';
import {Texto} from './interfaces/texto';
import {desencriptarObjeto} from './utils/Desencriptar';
import {getPrivateKey} from './keys/getPrivateKey';
import * as path from 'path';
import {cleanText} from './utils/cleanText';
import {testServiceDavis, useServiceDavis} from './utils/ServicioDavid';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		'cdt-decrypt.CDT_Decrypt',
		() => {
			// The code you place here will be executed every time your command is executed
			//Obtener la instancia del editor activo
			let editor = vscode.window.activeTextEditor;

			//Si no hay un editor activo, mostrar un mensaje de error
			if (!editor) {
				vscode.window.showInformationMessage('Error: No hay un editor activo');
				throw new Error(`Error: No hay un editor activo`);
			}

			// Obtener el texto del editor activo
			const texto: Texto = {
				idAcceso: '',
				completo: cleanText(editor.document.getText().trim()).replace(
					/(\r\n|\n|\r)/gm,
					''
				),
				paraDesencriptar: cleanText(
					editor.document.getText(editor.selection)
				).replace(/(\r\n|\n|\r)/gm, ''),
			};

			// Pedir el idAcceso mediante un input box
			vscode.window
				.showInputBox({prompt: 'idAcceso:'})
				.then((valueIdAcceso) => {
					// WIP: Logica
					const idAcceso: string = valueIdAcceso ?? '';
					texto.idAcceso = idAcceso;

					vscode.window.withProgress(
						{
							cancellable: true,
							location: vscode.ProgressLocation.Notification,
						},
						async (progress) => {
							progress.report({message: `Desencriptando ando...`});
							try {
								await logica(idAcceso, texto);
							} catch (err) {
								const msg: string = (err as any).message;
								vscode.window.showErrorMessage(`Error: ${msg}`);
								console.log(err);
							}
						}
					);
				});
		}
	);

	const removeFilePart = (dirname: any) => path.parse(dirname).dir;

	const logica = async (idAcceso: string, texto: Texto) => {
		let pathToSave: any;
		if (idAcceso === '' || idAcceso === undefined) {
			return vscode.window.showErrorMessage(
				`El el idAcceso no puede estar vacio`
			);
		}

		if (vscode.workspace.workspaceFolders === undefined) {
			vscode.window.showInformationMessage(
				'No se ha abierto ninguna carpeta o espacio de trabajo, el archivo se guardará en la misma carpeta donde se encuentra el LOG',
				'Ok'
			);
			pathToSave = vscode.window.activeTextEditor?.document.uri;
		} else {
			pathToSave = vscode.workspace.workspaceFolders[0].uri;
		}

		const textoCompletoUnaLinea = texto.completo
			.replace(/(\r\n|\n|\r)/gm, '')
			.toString();
		let response = getPrivateKey(textoCompletoUnaLinea, texto, 1); // Response
		let request = getPrivateKey(textoCompletoUnaLinea, texto, 2); // Request

		let fechaActual: Date | string = new Date();
		const opciones: any = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		};
		fechaActual = fechaActual.toLocaleDateString('es-mx', opciones);

		/**
		 * Desencriptado
		 */
		const statusDavisService: any = await testServiceDavis();
		let requestDecrypted: any;
		let responseDecrypted: any;

		if (statusDavisService.status === 200) {
			requestDecrypted = await useServiceDavis(
				request.llavePrivada,
				JSON.parse(request.texto)
			);

			responseDecrypted = await useServiceDavis(
				response.llavePrivada,
				JSON.parse(response.texto)
			);
			console.log('Se usó el serivicio de Davis');
		} else {
			return vscode.window.showErrorMessage(
				'El servicio de David no esta disponible, favor de pedirle que levante su Docker',
				'Realizado'
			);
			/*requestDecrypted = await desencriptarObjeto(
				JSON.parse(JSON.stringify(request.texto)),
				request.llavePrivada
			);
			responseDecrypted = await desencriptarObjeto(
				JSON.parse(JSON.stringify(response.texto)),
				response.llavePrivada
			);

			requestDecrypted = Object.keys(requestDecrypted)
				.map((key: any) => requestDecrypted[key])
				.join('');
			responseDecrypted = Object.keys(responseDecrypted)
				.map((key: any) => responseDecrypted[key])
				.join('');
			console.log('Se uso la función interna');*/
		}

		let textoFinal: string = `
/***************************************************************
*               idAcceso: ${idAcceso}
****************************************************************
${fechaActual}\n
DESENCRIPTAR REQUEST (Llave Privada):
\t${request.llavePrivada}\n
DESENCRIPTAR RESPONSE (Llave Privada):
\t${response.llavePrivada}\n
***************************************************************
***************************************************************/

			{
				"**** REQUEST ****": ${JSON.stringify(requestDecrypted)},
				"**** REPSONSE ****": ${JSON.stringify(responseDecrypted)}
			}`;

		const writeData = Buffer.from(textoFinal, 'utf8'); // 202211141149554286403
		const folderUri = pathToSave;
		const fileUri = folderUri.with({
			path: posix.join(
				removeFilePart(folderUri.path),
				`logDecrypt_${idAcceso}.jsonc`
			),
		});
		vscode.workspace.fs.writeFile(fileUri, writeData);

		vscode.window.showInformationMessage(
			`Fin de la tarea de desencriptado.\nArchivo guardado en:\n${fileUri.path}`,
			'Entendido'
		);
	};

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
	vscode.window.showInformationMessage(`Extensión desactivada`, 'Ok');
	console.log('Estensión Desactivada');
}

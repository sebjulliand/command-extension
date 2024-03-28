import { MemberItem } from "@halcyontech/vscode-ibmi-types";
import vscode, { l10n } from "vscode";
import { code4i } from "./extension";

export function initializeCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('sample.runPRTRPGPRT', async (memberItem: MemberItem) => {
			//Run commands, print to output, etc
			const connection = code4i.instance.getConnection();

			//Run SQL, upload/download stuff
			const content = code4i.instance.getContent();

			//Prompt
			const command = await vscode.window.showInputBox({
				prompt: l10n.t("Prompt and run"),
				value: `PRTRPGPRT SRCFILE(${memberItem.member.library}/${memberItem.member.file}) SRCMBR(${memberItem.member.name}) SUMMARY(*NO) OUTPUT(*PRINT) PRTFILE(qsysprt)`
			});
			
			if (command) { //if prompt wasn't canceled
				const result = await connection.runCommand({ command, environment: "ile" });
				if(result.code === 0){
					//success
					console.log(result.stdout);
					vscode.window.showInformationMessage(l10n.t("Command PRTRPGPRT successful"));

					//get the spooled output data
					const job = "the job"; //get the job info, maybe with SPOOLED_FILE_INFO ?
					const [output] = await content.runSQL(`SELECT SPOOLED_DATA FROM TABLE(SYSTOOLS.SPOOLED_FILE_DATA(JOB_NAME => '${job}', SPOOLED_FILE_NAME =>'QSYSPRT'))`);
					if(output.SPOOLED_DATA){
						const data = String(output.SPOOLED_DATA);
						//do something with the data
					}
				}
				else{
					//failure
					vscode.window.showErrorMessage(l10n.t("Command PRTRPGPRT failed: {0}", result.stderr)); //show the error output in error notification
				}
			}
		})
	);
}
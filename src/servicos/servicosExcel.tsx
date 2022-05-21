import fileDownload from "js-file-download";
import { ModeloExportar } from "../modelos/ModeloExportar";
import { adicionaZero } from "../utilitarios/dataUtilitarios";
import { urlBase } from "./urlBase";
const url = urlBase + '/Exportar'
export const gerarArquivoExcel = async (modelo: ModeloExportar, nomeFuncao: string) => {
    try {
        const conteudo = await fetch(url + '/excel', {
            method: 'POST',
            headers: { 'Content-type': "application/json" },
            body: JSON.stringify(modelo)
        });
        const blob = await conteudo.blob();
        let data = new Date();
        //@ts-ignore
        let dataFormatada = (data.getFullYear() + (adicionaZero(data.getMonth() + 1).toString()) + adicionaZero(+data.getDate().toString()) + data.getHours() + data.getMinutes() + data.getSeconds());
        fileDownload(blob, `${nomeFuncao}${dataFormatada}.xlsx`)
    } catch (erro) {
        throw erro;
    }
}

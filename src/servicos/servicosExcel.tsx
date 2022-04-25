import fileDownload from "js-file-download";
import { urlBase } from "./urlBase";
export const GerarArquivoExcel = async (cabecalhos: any, linhas: any) => {
    const modelo = { cabecalhos, linhas }
    console.log('Fetching')
    const conteudo =  await fetch(urlBase + 'excel', {
        method: 'POST',
        headers: { 'Content-type': "application/json" },
        body: JSON.stringify(modelo)
    });
    console.log('Fetched')
    const blob = await conteudo.blob();
    fileDownload(blob,"JUDO.xlsx")
}
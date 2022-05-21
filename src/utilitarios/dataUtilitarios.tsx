export function adicionaZero(numero: number) {
    if (numero <= 9)
        return "0" + numero;
    else
        return numero;
}
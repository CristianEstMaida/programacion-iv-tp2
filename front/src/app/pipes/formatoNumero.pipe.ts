import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoNumero',
  standalone: true
})
export class FormatoNumeroPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value === null || value === undefined || isNaN(Number(value))) return '0';

    const numero = Number(value);

    if (numero >= 1_000_000) {
      // Usamos 2 decimales para millones o lo ajustás a gusto
      return (numero / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M';
    }
    if (numero >= 1_000) {
      // Usamos 2 decimales (.toFixed(2)) para que 1001 se vea como "1k" o "1.01k"
      return (numero / 1_000).toFixed(2).replace(/\.?0+$/, '') + 'k';
    }
    
    return numero.toString();
  }
}
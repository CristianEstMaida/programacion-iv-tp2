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
      return (numero / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (numero >= 1_000) {
      return (numero / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    
    return numero.toString();
  }
}
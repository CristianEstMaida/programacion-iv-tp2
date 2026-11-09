import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroActivos',
  standalone: true
})
export class FiltroActivosPipe implements PipeTransform {
  transform(items: any[], activo: boolean = true): any[] {
    if (!items) return [];
    return items.filter(item => item.activo === activo);
  }
}
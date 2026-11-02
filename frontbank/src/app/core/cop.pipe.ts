import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cop' })
export class CopPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (!value) return '$0';
    return '$' + Number(value).toLocaleString('es-CO');
  }
}

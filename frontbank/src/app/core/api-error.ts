import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from './models';

export function getApiError(err: HttpErrorResponse): ApiError {
  if (err.error && err.error.message) {
    return err.error;
  }
  if (err.status === 0) {
    return { code: 'NETWORK', message: 'No se pudo conectar con el servidor. Revisa que el backend esté corriendo.' };
  }
  if (err.status === 401) {
    return { code: 'UNAUTHORIZED', message: 'Usuario o contraseña incorrectos.' };
  }
  return { code: 'ERROR', message: 'Ocurrió un error (' + err.status + ').' };
}

export function cleanMessage(msg: string): string {
  if (!msg) return '';
  return msg.replace('[!] ', '').replace('[+] ', '');
}

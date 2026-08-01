import { Pipe, PipeTransform } from '@angular/core';

/** Truncates text to `limit` characters, appending an ellipsis when cut. */
@Pipe({ name: 'coreTruncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, limit = 25, ellipsis = '…'): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    return value.slice(0, limit).trimEnd() + ellipsis;
  }
}

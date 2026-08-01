import { Pipe, PipeTransform } from '@angular/core';

/** "Jane Doe" → "JD". Takes the first letter of up to `max` words. */
@Pipe({ name: 'coreInitials' })
export class InitialsPipe implements PipeTransform {
  transform(value: string | null | undefined, max = 2): string {
    if (!value) return '';
    return value
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .slice(0, max)
      .map((word) => word[0].toUpperCase())
      .join('');
  }
}

import { numberFormat } from '@lyrasoft/ts-toolkit/generic';

export function formatPrice(price: string | number | null | undefined, scale = 0, prefix = 'NT $'): string {
  if (!price && price !== 0) {
    return '';
  }

  return prefix + numberFormat(price, scale);
}

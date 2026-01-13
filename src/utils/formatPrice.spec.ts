import { formatPriceWithCurrency } from './formatPrice';

describe('formatPriceWithCurrency', () => {
  it('formats price with default currency (€)', () => {
    expect(formatPriceWithCurrency('100')).toBe('100.00 €');
  });

  it('formats price with 2 decimal places', () => {
    expect(formatPriceWithCurrency('123.5')).toBe('123.50 €');
    expect(formatPriceWithCurrency('99.9')).toBe('99.90 €');
  });

  it('formats large numbers correctly', () => {
    // toLocaleString('fr-FR') uses non-breaking space as thousand separator
    const result1 = formatPriceWithCurrency('1000');
    expect(result1).toContain('000.00 €');
    expect(result1).toMatch(/1[\s\u00A0\u202F]000\.00 €/);

    const result2 = formatPriceWithCurrency('12345.67');
    expect(result2).toContain('345.67 €');
    expect(result2).toMatch(/12[\s\u00A0\u202F]345\.67 €/);
  });

  it('formats price with custom currency', () => {
    expect(formatPriceWithCurrency('100', '$')).toBe('100.00 $');
    expect(formatPriceWithCurrency('50', 'USD')).toBe('50.00 USD');
  });

  it('handles zero correctly', () => {
    expect(formatPriceWithCurrency('0')).toBe('0.00 €');
    expect(formatPriceWithCurrency('0.0')).toBe('0.00 €');
  });

  it('handles negative numbers', () => {
    expect(formatPriceWithCurrency('-100')).toBe('-100.00 €');
    expect(formatPriceWithCurrency('-50.5')).toBe('-50.50 €');
  });

  it('handles decimal numbers with many digits', () => {
    expect(formatPriceWithCurrency('123.456789')).toBe('123.46 €');
    expect(formatPriceWithCurrency('99.999')).toBe('100.00 €');
  });

  it('handles string numbers correctly', () => {
    expect(formatPriceWithCurrency('123')).toBe('123.00 €');
    expect(formatPriceWithCurrency('45.67')).toBe('45.67 €');
  });
});

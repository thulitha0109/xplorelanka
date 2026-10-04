export const SUPPORTED_CURRENCIES = ['USD', 'EUR'];

export function getPriceAmount(product, currency, unit = 'package') {
    const price = product?.prices?.[unit]?.[currency];
    return price && Number.isFinite(Number(price.amount)) ? Number(price.amount) : null;
}

export function formatAmount(amount, currency = 'USD') {
    if (amount === null || amount === undefined || !Number.isFinite(Number(amount))) {
        return 'Price on request';
    }

    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount));
}

export function formatProductPrice(product, currency, unit = 'package') {
    return formatAmount(getPriceAmount(product, currency, unit), currency);
}

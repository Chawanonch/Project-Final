import Payment from "payment";

function clearNumber(value: string = ""): string {
  return value.replace(/\D+/g, "");
}

export function formatCreditCardNumber(value: string): string {
  if (!value) {
    return value;
  }

  const issuer = Payment.fns.cardType(value);
  const clearValue = clearNumber(value);
  let nextValue: string;

  switch (issuer) {
    case "amex":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 15)}`;
      break;
    case "dinersclub":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 14)}`;
      break;
    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 8)} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`;
      break;
  }

  return nextValue.trim();
}

export function formatCVC(value: string, allValues: Record<string, string> = {}): string {
  const clearValue = clearNumber(value);
  let maxLength = 4;

  if (allValues.number) {
    const issuer = Payment.fns.cardType(allValues.number);
    maxLength = issuer === "amex" ? 4 : 3;
  }

  return clearValue.slice(0, maxLength);
}

export function formatExpirationDate(value: string): string {
  const clearValue = clearNumber(value);
  
  if (clearValue.length >= 3) {
    let month = clearValue.slice(0, 2);
    let day = clearValue.slice(2, 4);

    // Validate month
    const monthNumber = parseInt(month, 10);
    if (monthNumber < 1) month = '01';
    if (monthNumber > 12) month = '12';

    // Validate day
    const dayNumber = parseInt(day, 10);
    if (dayNumber < 1) day = '01';
    if (dayNumber > 31) day = '31';

    return `${month}/${day}`;
  }
  return clearValue;
}

export function formatFormData(data: Record<string, string>): string[] {
  return Object.keys(data).map((d) => `${d}: ${data[d]}`);
}

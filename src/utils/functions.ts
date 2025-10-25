import { RentFrequency } from "./contants";

export function calculateDueDate(frequency: RentFrequency): Date {
  const dueDate = new Date();

  switch (frequency) {
    case RentFrequency.DAY:
      dueDate.setDate(dueDate.getDate() + 1);
      break;
    case RentFrequency.WEEK:
      dueDate.setDate(dueDate.getDate() + 1);
      break;
    case RentFrequency.MONTH:
      dueDate.setMonth(dueDate.getDate() + 5);
      break;
    case RentFrequency.YEAR:
      dueDate.setFullYear(dueDate.getDate() + 10);
      break;
    default:
      // fallback — 5 days (if frequency missing)
      dueDate.setDate(dueDate.getDate() + 5);
  }
  return dueDate;
}


export function calculateNextBillingdate(checkInDate: Date, frequency: RentFrequency): Date {
  let calculatedDate = new Date(checkInDate);

  switch (frequency) {
    case RentFrequency.DAY:
      calculatedDate.setDate(calculatedDate.getDate() + 1);
      break;

    case RentFrequency.WEEK:
      calculatedDate.setDate(calculatedDate.getDate() + 7);
      break;

    case RentFrequency.MONTH:
      calculatedDate.setMonth(calculatedDate.getMonth() + 1);
      break;

    case RentFrequency.YEAR:
      calculatedDate.setFullYear(calculatedDate.getFullYear() + 1);
      break;
  }

  return calculatedDate
}
import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';

export const IS_INT = 'isInt';

export function isSafeInt(val: unknown): boolean {
  return typeof val === 'number' && Number.isSafeInteger(val);
}

export function IsSafeInt(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_INT,
      validator: {
        validate: (value): boolean => isSafeInt(value),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be an integer number',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
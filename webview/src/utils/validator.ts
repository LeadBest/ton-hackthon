/** @format */

import validator from 'validator';

export function required(value: string | number | boolean): string | boolean {
	value = value === 0 || value === false ? String(value) : '';
	value = value.trim();
	return value.length > 0 || 'error.validator.required';
}

export function isEmail(value: string): string | boolean {
	return validator.isEmail(value) || value === '' || 'error.validator.email';
}

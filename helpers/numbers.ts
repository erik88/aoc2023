export function isInt(x: string): boolean {
	const start = x[0] === "-" ? 1 : 0;
	return x
		.substring(start)
		.split("")
		.every((x) => 48 <= x.charCodeAt(0) && x.charCodeAt(0) <= 57);
}

export function isDigit(x: string): boolean {
	if (x.length !== 1) {
		throw new Error("isDigit() called with length " + x.length);
	}
	return 48 <= x.charCodeAt(0) && x.charCodeAt(0) <= 57;
}

export function isNumber(x: string): boolean {
	return !isNaN(parseFloat(x));
}

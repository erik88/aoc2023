import "/helpers/arrays.ts";

let input = Deno.readTextFileSync("input3.txt");
const lineLength = input.indexOf("\n");
input = input.replaceAll("\n", "");

let numbers: number[] = [];

for (let i = 0; i < input.length; i++) {
	const c = input.charAt(i);
	if (c !== "*") continue;

	const v1 = scan(i);
	const v2 = scan(Math.min(i + 1, input.length - 1));
	const v3 = scan(Math.max(i - 1, 0));

	const v4 = scan(Math.max(i - lineLength, 0));
	const v5 = scan(Math.max(i + 1 - lineLength, 0));
	const v6 = scan(Math.max(i - 1 - lineLength, 0));

	const v7 = scan(i + lineLength);
	const v8 = scan(i + 1 + lineLength);
	const v9 = scan(i - 1 + lineLength);

	const unique = new Set<number>(
		[v1, v2, v3, v4, v5, v6, v7, v8, v9].filter((x) => !isNaN(x))
	);

	if (unique.size == 1) {
		continue;
	}

	if (unique.size > 2) {
		console.log(unique);
		throw new Error("More than 2 numbers " + i);
	}

	let mul = 1;
	unique.forEach((x) => (mul *= x));
	numbers.push(mul);
}

function scan(pos: number) {
	const [start, end] = getNumber(pos);
	if (isNaN(start)) return NaN;

	return parseInt(input.substring(start, end));
}

function getNumber(pos: number) {
	// const start = input.lastIndexOf(".", pos) + 1;
	// const end = input.indexOf(".", pos);

	let start = pos;
	let end = pos;

	if (isNaN(parseInt(input.charAt(pos)))) {
		return [NaN, NaN];
	}

	for (let i = pos; i <= input.length; i++) {
		if (i == input.length) {
			end = input.length;
			break;
		}
		if (isNaN(parseInt(input.charAt(i)))) {
			end = i;
			break;
		}
	}

	for (let i = pos; i >= -1; i--) {
		if (i < 0) {
			start = 0;
			break;
		}
		if (isNaN(parseInt(input.charAt(i)))) {
			start = i + 1;
			break;
		}
	}

	return [start, end];
}

console.log(numbers);
console.log(numbers.sum());

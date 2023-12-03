import "/helpers/arrays.ts";

let input = Deno.readTextFileSync("input3.txt");
const lineLength = input.indexOf("\n");
input = input.replaceAll("\n", "");

const indexTaken = new Set<number>();
let numbers: number[] = [];

for (let i = 0; i < input.length; i++) {
	const c = input.charAt(i);
	if (c === "." || !isNaN(parseInt(c))) continue;

	scan(i);
	scan(Math.min(i + 1, input.length - 1));
	scan(Math.max(i - 1, 0));

	scan(Math.max(i - lineLength, 0));
	scan(Math.max(i + 1 - lineLength, 0));
	scan(Math.max(i - 1 - lineLength, 0));

	// scan(Math.min(i + lineLength, input.length - 1));
	// scan(Math.min(i + 1 + lineLength, input.length - 1));
	// scan(Math.min(i - 1 + lineLength, input.length - 1));

	scan(i + lineLength);
	scan(i + 1 + lineLength);
	scan(i - 1 + lineLength);
}

function scan(pos: number) {
	const [start, end] = getNumber(pos);
	if (isNaN(start)) return;

	if (indexTaken.has(start)) return;

	indexTaken.add(start);
	numbers.push(parseInt(input.substring(start, end)));
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

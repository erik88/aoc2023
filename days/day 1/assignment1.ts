import "/helpers/arrays.ts";

const input = Deno.readTextFileSync("input1.txt");

function solution1() {
	const lines = input.split("\n");

	const find = lines.map((x) => {
		const arr = findDigits(x);
		return parseInt(arr.at(0) + "" + arr.at(-1));
	});

	console.log(find.sum());

	function findDigits(s: string) {
		return s
			.split("")
			.map((x: string) => parseInt(x))
			.filter((x: number) => !isNaN(x));
	}
}

function solution2() {
	const haystack: [string, number][] = [
		["one", 1],
		["two", 2],
		["three", 3],
		["four", 4],
		["five", 5],
		["six", 6],
		["seven", 7],
		["eight", 8],
		["nine", 9],
	];

	const lines = input.split("\n");

	const find = lines.map((x) => {
		const arr = [];
		for (let i = 0; i < x.length; i++) {
			if (parseInt(x.charAt(i))) {
				arr.push(parseInt(x.charAt(i)));
			} else {
				haystack.forEach((hs) => {
					if (x.substring(i).startsWith(hs[0])) {
						arr.push(hs[1]);
					}
				});
			}
		}
		return parseInt(arr.at(0) + "" + arr.at(-1));
	});

	console.log(find.sum());
}

import { Board } from "./helpers/board.ts";
import "/helpers/arrays.ts";
import "/helpers/sets.ts";

const input = Deno.readTextFileSync("input.txt");
// const input = Deno.readTextFileSync("test.txt");

const reflections = input.split("\n\n").map((x) => Board.fromString(x));

const refLines = reflections.map((b, index) => {
	let rowRefLines = new Set<number>([
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
		21, 22, 23, 24, 25,
	]);
	for (let y = 0; y < b.height; y++) {
		let row: string[] = [];
		for (let x = 0; x < b.width; x++) {
			row.push(b.get(x, y));
		}
		let possible = new Set(findPossibleRefLines(row));
		rowRefLines = rowRefLines.intersection(possible);
	}

	let colRefLines = new Set<number>([
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
		21, 22, 23, 24, 25,
	]);
	for (let x = 0; x < b.width; x++) {
		let col: string[] = [];
		for (let y = 0; y < b.height; y++) {
			col.push(b.get(x, y));
		}
		let possible = new Set(findPossibleRefLines(col));
		colRefLines = colRefLines.intersection(possible);
	}

	let colRef = 0;
	let rowRef = 0;
	if (colRefLines.size === 1) {
		colRef = [...colRefLines][0];
	}
	if (rowRefLines.size === 1) {
		rowRef = [...rowRefLines][0];
	}

	if (rowRef === 0 && colRef === 0) {
		b.print();
		throw new Error("Did not find any reflection for " + index);
	}
	if (rowRef !== 0 && colRef !== 0) {
		throw new Error("Found reflection in multiple for index " + index);
	}

	return { row: rowRef, col: colRef };
});

console.log(refLines.map((rl) => rl.row + rl.col * 100).sum());

function findPossibleRefLines(arr: string[]): number[] {
	const matches: number[] = [];
	for (let i = 1; i < arr.length; i++) {
		let a1 = arr.slice(0, i).reverse();
		let a2 = arr.slice(i);
		let len = Math.min(a1.length, a2.length);

		let noMatch = false;
		for (let j = 0; j < len; j++) {
			if (a1[j] !== a2[j]) {
				noMatch = true;
				break;
			}
		}
		if (!noMatch) matches.push(i);
	}
	return matches;
}

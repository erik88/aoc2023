import { Board } from "./helpers/board.ts";
import "/helpers/arrays.ts";
import "/helpers/sets.ts";

const input = Deno.readTextFileSync("input.txt");
// const input = Deno.readTextFileSync("test.txt");

const reflections = input.split("\n\n").map((x) => Board.fromString(x));

const refLines = reflections.map((b, index) => {
	const real = findReflections(b);
	const realRows = new Set(real.rows);
	const realCols = new Set(real.cols);
	for (let i = 0; i < b.arr.length; i++) {
		b.arr[i] = b.arr[i] === "#" ? "." : "#";
		//if (i === 4) {
		const attempt = findReflections(b);
		if (attempt.cols.length !== 0 || attempt.rows.length !== 0) {
			// Only find what differs from "real"
			let attRows = new Set(attempt.rows);
			attRows = attRows.minus(realRows);
			let attCols = new Set(attempt.cols);
			attCols = attCols.minus(realCols);
			if (attCols.size !== 0 || attRows.size !== 0) {
				if (attCols.size + attRows.size > 1) {
					throw new Error(
						"Found multiple new lines with just one change for " + index
					);
				}
				return {
					row: [...attRows][0] || 0,
					col: [...attCols][0] || 0,
				};
			}
		}
		//}
		// Put it back <3
		b.arr[i] = b.arr[i] === "#" ? "." : "#";
	}
	b.print();
	throw new Error("Did not find alternate attempt for " + index);
});

console.log(refLines.map((rl) => rl.row + rl.col * 100).sum());

function findReflections(b: Board<string>): { rows: number[]; cols: number[] } {
	{
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

		let colRef = [...colRefLines];
		let rowRef = [...rowRefLines];

		return { rows: rowRef, cols: colRef };
	}
}

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

import { Board } from "../../helpers/board.ts";
import "/helpers/arrays.ts";
import "/helpers/sets.ts";

const input = Deno.readTextFileSync("input.txt");
// const input = Deno.readTextFileSync("test.txt");

const rows = input.split("\n");

const emptyRows: number[] = [];
rows.forEach((r, i) => {
	if (r.indexOf("#") === -1) {
		emptyRows.push(i);
	}
});

const emptyCols: number[] = [];
for (let i = 0; i < rows[0].length; i++) {
	let empty = true;
	for (let r = 0; r < rows.length; r++) {
		if (rows[r].charAt(i) === "#") {
			empty = false;
		}
	}

	if (empty) {
		emptyCols.push(i);
	}
}

let stars: [number, number][] = [];
for (let y = 0; y < rows.length; y++) {
	for (let x = 0; x < rows[0].length; x++) {
		if (rows[y].charAt(x) === "#") {
			stars.push([x, y]);
		}
	}
}

let distance = 0;
const EMPTY_DISTANCE = 1_000_000;
stars.forEach(([s1x, s1y]) => {
	stars.forEach(([s2x, s2y]) => {
		if (s1x === s2x && s1y === s2y) return;
		distance += Math.abs(s2x - s1x) + Math.abs(s2y - s1y);
		distance += (EMPTY_DISTANCE - 1) * countHitsBetween(emptyRows, s1y, s2y);
		distance += (EMPTY_DISTANCE - 1) * countHitsBetween(emptyCols, s1x, s2x);
	});
});

function countHitsBetween(arr: number[], a: number, b: number) {
	let start = Math.min(a, b);
	let stop = Math.max(a, b);

	return arr.filter((x) => start < x && x < stop).length;
}

console.log(distance / 2);
console.log("");

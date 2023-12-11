import { Board } from "../../helpers/board.ts";
import "/helpers/arrays.ts";
import "/helpers/sets.ts";

const input = Deno.readTextFileSync("input.txt");

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

for (let i = emptyRows.length - 1; i >= 0; i--) {
	rows.splice(emptyRows[i], 0, getEmptyRow());
}

for (let i = emptyCols.length - 1; i >= 0; i--) {
	for (let j = 0; j < rows.length; j++) {
		let rowAsArr = rows[j].split("");
		rowAsArr.splice(emptyCols[i], 0, ".");
		rows[j] = rowAsArr.join("");
	}
}

Deno.writeTextFileSync("output.txt", rows.join("\n"));

function getEmptyRow(): string {
	const emptyRow = new Array(rows[0].length);
	emptyRow.fill(".");
	return emptyRow.join("");
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
stars.forEach(([s1x, s1y]) => {
	stars.forEach(([s2x, s2y]) => {
		distance += Math.abs(s2x - s1x) + Math.abs(s2y - s1y);
	});
});

console.log(distance / 2);
console.log("");

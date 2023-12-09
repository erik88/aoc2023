import "/helpers/arrays.ts";
import "/helpers/sets.ts";

const input = Deno.readTextFileSync("input.txt");

const lines = input.split("\n");

const rows = lines.map((l) => {
	const matches = l.matchAll(/\-?\d+/g);
	return [...matches].map((m) => parseInt(m[0]));
});

console.log(rows.map((r) => getNext(getDiffRows(r))).sum());

// const dr = getDiffRows(rows[0]);
// console.log(dr);
// console.log(getNext(dr));
// console.log("");

function getNext(diffRows: number[][]) {
	let sum = 0;
	for (let i = diffRows.length - 1; i >= 0; i--) {
		// part 2
		// sum = diffRows[i].at(0) - sum;

		// part 1
		sum += diffRows[i].at(-1);
	}
	return sum;
}

function getDiffRows(row: number[]): number[][] {
	const diffRows = [row];
	let latest = row;
	while (latest.some((r) => r !== latest[0])) {
		const dr = getDiffRow(latest);
		diffRows.push(dr);
		console.log(dr);
		latest = dr;
	}
	return diffRows;
}

function getDiffRow(row: number[]): number[] {
	if (row.length === 1) throw new Error("getDiffRow length was 1");

	const diffRow = [];
	const first = row[0];

	let prev = first;
	for (const itm of row.slice(1)) {
		diffRow.push(itm - prev);
		prev = itm;
	}
	return diffRow;
}

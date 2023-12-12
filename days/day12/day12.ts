import "/helpers/arrays.ts";
import "/helpers/sets.ts";

const input = Deno.readTextFileSync("input.txt");
// const input = Deno.readTextFileSync("test.txt");

// const lines = input.split("\n");
// Every row has '?'
//console.log(lines.filter((l) => l.indexOf("?") === -1).length);

interface Line {
	row: string;
	record: number[];
}

const lines = input.split("\n").map((l) => {
	const s = l.split(" ");
	const r = s[1].split(",").map((x) => parseInt(x));
	return {
		// Part1
		row: s[0],
		record: r,
		// Part 2
		// row: [s[0], s[0], s[0], s[0], s[0]].join("?"),
		// record: [...r, ...r, ...r, ...r, ...r],
	} as Line;
});

let map: Map<string, number> = new Map();

function countConfigs(row: string, records: number[]): number {
	let count = 0;

	if (records.length === 0) {
		return row.indexOf("#") === -1 ? 1 : 0;
	}
	if (row.length === 0) {
		return 0;
	}
	if (row.length < records.sum() + (records.length - 1)) return 0;

	const mapKey = `${row}|${records.join(",")}`;
	const mapVal = map.get(mapKey);
	if (typeof mapVal !== "undefined") {
		return mapVal;
	}

	const size = records[0];

	if (size > row.length) return 0;

	if (
		row
			.substring(0, size)
			.split("")
			.every((x) => x === "?" || x === "#")
	) {
		if (size === row.length) {
			if (records.length === 1) {
				count += 1;
			}
		} else {
			if (row.charAt(size) !== "#")
				count += countConfigs(row.substring(size + 1), records.slice(1));
		}
	}
	if (row.charAt(0) !== "#") count += countConfigs(row.substring(1), records);

	map.set(mapKey, count);
	return count;
}

const configs = lines.map((l) => {
	map = new Map();
	return countConfigs(l.row, l.record);
});

console.log(configs);
console.log(configs.sum());
console.log("");

// 7638 = fel

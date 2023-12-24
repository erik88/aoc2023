import { Board } from "./helpers/board.ts";
import "/helpers/arrays.ts";
import "/helpers/sets.ts";

const TEST = false;
const input = TEST
	? Deno.readTextFileSync("test.txt")
	: Deno.readTextFileSync("input.txt");

const MAX = TEST ? 27n : 400000000000000n;
const MIN = TEST ? 7n : 200000000000000n;

type Hail = {
	id: number;
	x: bigint;
	y: bigint;
	z: bigint;
	dx: bigint;
	dy: bigint;
	dz: bigint;
	k: number;
	m: number;
};

const hail = input.split("\n").map((line, i) => {
	const m = line.match(
		/(\-?\d+),\s+(\-?\d+),\s+(\-?\d+)\s+\@\s+(\-?\d+),\s+(\-?\d+),\s+(\-?\d+)/
	);
	if (m === null) throw new Error("NO match for line " + line);
	return {
		id: i + 1,
		x: BigInt(parseInt(m[1])),
		y: BigInt(parseInt(m[2])),
		z: BigInt(parseInt(m[3])),
		dx: BigInt(parseInt(m[4])),
		dy: BigInt(parseInt(m[5])),
		dz: BigInt(parseInt(m[6])),
	} as Hail;
});

hail.forEach((h) => {
	h.k = Number(h.dy) / Number(h.dx);
	h.m = Number(h.y) - h.k * Number(h.x);
});

hail.forEach((h) => {
	if (h.dx === 0n) {
		throw new Error("A hail path was vertical. " + h.id);
	}
});

let count = 0;
for (let i = 0; i < hail.length; i++) {
	for (let j = i + 1; j < hail.length; j++) {
		if (intersects(hail[i], hail[j])) {
			count++;
		}
	}
}
console.log(count);

function intersects(h0: Hail, h1: Hail) {
	if (Math.abs(h0.k - h1.k) < 0.001) {
		// Parallell
		return false;
	}
	const x = (h1.m - h0.m) / (h0.k - h1.k);
	const y = h0.k * x + h0.m;

	if (
		(h0.dx > 0 && x < h0.x) ||
		(h0.dx < 0 && x > h0.x) ||
		(h1.dx > 0 && x < h1.x) ||
		(h1.dx < 0 && x > h1.x)
	) {
		// Past
		return false;
	}

	if (MIN <= x && x <= MAX && MIN <= y && y <= MAX) {
		return true;
	}
	return false;
}

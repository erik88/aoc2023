import "/helpers/arrays.ts";
import "/helpers/sets.ts";
import { Ceres } from "https://cdn.jsdelivr.net/gh/Pterodactylus/Ceres.js@master/Ceres-v1.5.3.js";

const TEST = false;
const input = TEST
	? Deno.readTextFileSync("test.txt")
	: Deno.readTextFileSync("input.txt");

type Hail = {
	id: number;
	x: number;
	y: number;
	z: number;
	dx: number;
	dy: number;
	dz: number;
};

const hail = input.split("\n").map((line, i) => {
	const m = line.match(
		/(\-?\d+),\s+(\-?\d+),\s+(\-?\d+)\s+\@\s+(\-?\d+),\s+(\-?\d+),\s+(\-?\d+)/
	);
	if (m === null) throw new Error("NO match for line " + line);
	return {
		id: i + 1,
		x: parseInt(m[1]),
		y: parseInt(m[2]),
		z: parseInt(m[3]),
		dx: parseInt(m[4]),
		dy: parseInt(m[5]),
		dz: parseInt(m[6]),
	} as Hail;
});

hail.forEach((h) => {
	if (h.dx === 0 || h.dy === 0 || h.dz === 0) {
		throw new Error("A hail path was orthogonal. " + h.id);
	}
});

let solver = new Ceres();
solver.promise.then((res) => {
	for (let h of [hail[0], hail[1], hail[15]]) {
		solver.add_function(
			(x) => (h.x - x[0]) * (x[4] - h.dy) - (h.y - x[1]) * (x[3] - h.dx)
		);
		solver.add_function(
			(x) => (h.x - x[0]) * (x[5] - h.dz) - (h.z - x[2]) * (x[3] - h.dx)
		);
	}

	const hInitial = hail[6];
	const NUM_ITERATIONS = 1_000_000_000;
	const PRECISION = 1 / 1000000000000000;
	const r = solver.solve(
		[hInitial.x, hInitial.y, hInitial.z, hInitial.dx, hInitial.dy, hInitial.dz],
		NUM_ITERATIONS,
		PRECISION
	)!.x;
	const s: Hail = {
		x: r[0],
		y: r[1],
		z: r[2],
		dx: r[3],
		dy: r[4],
		dz: r[5],
	};

	for (const x of hail) {
		const t = getT(s, x);
		// console.log(s.x - x.x + s.dx * t - x.dx * t);
		// console.log(s.y - x.y + s.dy * t - x.dy * t);
		// console.log(s.z - x.z + s.dz * t - x.dz * t);
		//console.log("====");
		if (
			Math.abs(s.x - x.x + s.dx * t - x.dx * t) >= 0.5 ||
			Math.abs(s.y - x.y + s.dy * t - x.dy * t) >= 0.5 ||
			Math.abs(s.z - x.z + s.dz * t - x.dz * t) >= 0.5
		) {
			console.log(x);
			throw new Error("Not a solution");
		}
	}

	console.log(s.x + s.y + s.z);
});

function getT(h: Hail, s: Hail) {
	return Math.round((h.x - s.x) / (s.dx - h.dx));
}

// 560_867_503_872_110 is too high
// 763_906_899_855_780 ouch
// 554_668_916_217_314 is also too high

// 227199498960600
// -110404682611097
// -45092815286842
// 71_702_001_062_661 is too low

// 554_668_916_217_145 - BOOM

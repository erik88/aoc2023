import "/helpers/arrays.ts";
import "/helpers/sets.ts";

const input = Deno.readTextFileSync("input.txt");
// const input = Deno.readTextFileSync("test.txt");

const lr =
	"LRLRLRRLRRLRLRRRLRRLRLRRLLLRRRLRRRLLRRLRRRLRRRLRRLRRLRRRLRRLRLRLRRRLRRLRRLLRRRLLRLRRRLRRRLRRLRRRLRRLLRLLRRRLRRLRLRRRLRLRLRRRLLRLRRLLRRRLRRRLRLRRLLRRLRLRRLRRRLRLLRRRLRRRLLRLLRLLRRRLRLRLRLRLRRLRRLRLRRRLLLRLLRRRLRRLLRLRLRRRLLRLRRRLLRRLRRLRLRLRLRRLRRLRRRLRRRLRRLRRLRRRLRLRRRLRLRRRR".split(
		""
	);
// const lr = "LR";

console.log(lr.length);

class Cycle {
	length: number;
	offsetStart: number;
	zAt: number;

	constructor(length: number, offsetStart: number, zAt: number) {
		this.length = length;
		this.offsetStart = offsetStart;
		this.zAt = zAt;
	}
}

// class Counter {
// 	arr: number[];
// 	pos: number;
// 	size: number;
// 	cycleStart: number;

// 	constructor(arr: number[], cycleStart: number, size: number) {
// 		this.arr = arr;
// 		this.pos = 0;
// 		this.cycleStart = cycleStart;
// 		this.size = size;
// 	}

// 	takeSteps(s: number) {
// 		let overshoot = this.pos - this.size;
// 		if (overshoot >= 0) {
// 			this.pos = this.cycleStart + overshoot;
// 		}
// 	}

// 	distanceToNext(forceNonZero: boolean): number {
// 		if (!forceNonZero && this.pos === 0) return 0;
// 		for (let i = 0; i < this.arr.length; i++) {
// 			if (this.pos <= this.arr[i]) {
// 				return this.arr[i] - this.pos;
// 			}
// 		}

// 		return this.size - this.pos + this.getNextFromPos(this.pos);

// 		//throw new Error("Could not deternime distance to next");
// 	}

// 	getNextFromPos(p: number) {
// 		return this.arr[0] - this.cycleStart;
// 	}
// }

const parsed = input.split("\n").map((l) => {
	const s = l.split("=");
	const m = s[1].trim();
	return {
		index: s[0].trim(),
		map: [m.substring(1, 4), m.substring(6, 9)],
	};
});

const map: Map<string, [string, string]> = new Map();
parsed.forEach((p) => {
	map.set(p.index, p.map);
});

let firstIndexes = parsed
	.map((p, i) => [p.index, i])
	.filter(([index, _i]) => index.substring(2) === "A");

console.log(firstIndexes);

const currentValues: string[] = firstIndexes.map(([index, i]) => index);
const cycles = currentValues.map(getCycles);

console.log(cycles);

console.log(cycles.map((c) => BigInt(c.length)).reduce((x, y) => x * y, 1n));
// console.log(
// 	cycles.map((x) => x.length).reduce((x, y) => x + " " + y),
// 	""
// );

// 21883 19667 14681 16897 13019 11911
const mul = 16_555_262_546_256_037_897_470_293n;
const lcm = 10_151_663_816_849n; // By Googling LCM-solver online

// let totalSteps = 0;

// while (true) {
// 	const distances = counters.map((c) => c.distanceToNext(totalSteps === 0));
// 	let nonZeroMin = distances.filter((m) => m > 0).allMin();
// 	if (nonZeroMin.length === 0) break;

// 	const stepsToTake = nonZeroMin.min();
// 	totalSteps += stepsToTake;
// 	counters.forEach((c) => c.takeSteps(stepsToTake));
// }

// console.log(totalSteps);

function getCycles(starting: string): Cycle {
	const s: Map<string, number> = new Map();
	let lrIndex = 0;
	let current = starting;
	let zAt: number = -1;
	let countSteps = 0;

	while (true) {
		if (current.substring(2) === "Z") zAt = countSteps;

		const key = lrIndex + current;
		if (s.has(key)) {
			let offset: number = s.get(key);
			return new Cycle(countSteps - offset - 1, offset, zAt - offset);
		}
		s.set(key, countSteps - 1);
		current = getNextVal(current, lrIndex);
		countSteps++;
		lrIndex = (lrIndex + 1) % lr.length;
	}
}

// function getAllZOccurences(starting: string): [number[], number, number] {
// 	const s: Map<string, number> = new Map();
// 	let lrIndex = 0;
// 	let current = starting;
// 	const positions: number[] = [];
// 	let countSteps = 0;

// 	while (true) {
// 		if (current.substring(2) === "Z") positions.push(countSteps);

// 		const key = lrIndex + current;
// 		if (s.has(key)) {
// 			return [positions, s.get(key), countSteps - 1];
// 		}
// 		s.set(key, countSteps - 1);
// 		current = getNextVal(current, lrIndex);
// 		countSteps++;
// 		lrIndex = (lrIndex + 1) % lr.length;
// 	}
// }

function getNextVal(current: string, lrIndex: number): string {
	const [l, r] = map.get(current);
	if (lr[lrIndex] === "L") return l;
	return r;
}

console.log("");

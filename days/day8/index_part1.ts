import "/helpers/arrays.ts";
import "/helpers/sets.ts";

const input = Deno.readTextFileSync("input.txt");
// const input = Deno.readTextFileSync("test.txt");

const lr =
	"LRLRLRRLRRLRLRRRLRRLRLRRLLLRRRLRRRLLRRLRRRLRRRLRRLRRLRRRLRRLRLRLRRRLRRLRRLLRRRLLRLRRRLRRRLRRLRRRLRRLLRLLRRRLRRLRLRRRLRLRLRRRLLRLRRLLRRRLRRRLRLRRLLRRLRLRRLRRRLRLLRRRLRRRLLRLLRLLRRRLRLRLRLRLRRLRRLRLRRRLLLRLLRRRLRRLLRLRLRRRLLRLRRRLLRRLRRLRLRLRLRRLRRLRRRLRRRLRRLRRLRRRLRLRRRLRLRRRR".split(
		""
	);
// const lr = "LLR";

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

const trace: Set<string> = new Set();

let firstIndex = parsed
	.map((p, i) => [p.index, i])
	.filter(([index, i]) => index === "AAA")
	.map(([index, i]) => i)[0];

let lrIndex = 0;
let current = parsed[firstIndex].map;
let currentVal = parsed[firstIndex].index;
let countSteps = 0;

while (true) {
	countSteps++;

	let nextVal;
	if (lr[lrIndex] === "L") nextVal = current[0];
	else if (lr[lrIndex] === "R") nextVal = current[1];
	else throw new Error("Unexpected lr-index");

	const key = String(lrIndex) + currentVal;
	if (trace.has(key)) {
		throw new Error(
			"Loop detected at " + key + " after " + countSteps + " steps"
		);
	}
	trace.add(key);

	if (nextVal === "ZZZ") break;

	const tryGet = map.get(nextVal);
	if (!tryGet) {
		throw new Error("Unexpected next value " + tryGet);
	}
	current = tryGet;
	currentVal = nextVal;

	if (countSteps > lr.length * parsed.length) {
		throw new Error("Not found!");
	}

	lrIndex = (lrIndex + 1) % lr.length;
}

console.log(countSteps);

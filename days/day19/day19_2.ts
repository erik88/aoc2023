import { Board } from "./helpers/board.ts";
import "/helpers/arrays.ts";
import "/helpers/sets.ts";

// const input = Deno.readTextFileSync("test.txt");
const input = Deno.readTextFileSync("input.txt");

const [rulesTxt, _] = input.split("\n\n");

const ruleMap: Map<string, Rule[]> = new Map();

rulesTxt.split("\n").forEach((line) => {
	const s = line.split("{");
	const rules: Rule[] = s[1]
		.substring(0, s[1].length - 1)
		.split(",")
		.map((txt: string) => {
			const txtS = txt.split(":");
			if (txtS.length === 1) {
				return {
					part: "x",
					operator: ">",
					limit: -1,
					next: txtS[0],
				};
			} else {
				if (
					txtS[0].charAt(0) !== "x" &&
					txtS[0].charAt(0) !== "m" &&
					txtS[0].charAt(0) !== "a" &&
					txtS[0].charAt(0) !== "s"
				)
					throw new Error("Bad part " + txtS[0].charAt(0));
				if (txtS[0].charAt(1) !== ">" && txtS[0].charAt(1) !== "<")
					throw new Error("Bad operator " + txtS[0].charAt(1));
				return {
					part: txtS[0].charAt(0),
					operator: txtS[0].charAt(1),
					limit: parseInt(txtS[0].substring(2)),
					next: txtS[1],
				};
			}
		});
	ruleMap.set(s[0], rules);
});

function evaluate(pr: PartRange, rules: Rule[]): PartRange[] {
	const acceptedRanges: PartRange[] = [];

	function evalNext(x: PartRange, r: Rule) {
		if (r.next === "R") {
		} else if (r.next === "A") {
			acceptedRanges.push(x);
		} else {
			const nextRuleset: Rule[] = ruleMap.get(r.next);
			acceptedRanges.push(...evaluate(x, nextRuleset));
		}
	}

	for (const r of rules) {
		if (!hasCombinations(pr)) break;
		if (r.limit < 0) {
			evalNext(pr, r);
		} else if (r.operator === ">") {
			let pr1 = clone(pr);
			pr1[r.part][0] = r.limit + 1;
			pr[r.part][1] = r.limit;
			evalNext(pr1, r);
		} else {
			let pr1 = clone(pr);
			pr1[r.part][1] = r.limit - 1;
			pr[r.part][0] = r.limit;
			evalNext(pr1, r);
		}
	}
	return acceptedRanges;
}

const firstRule = ruleMap.get("in");
if (!firstRule) throw new Error("Could not find first rule...");

const partRanges: PartRange[] = evaluate(
	{ x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] },
	firstRule
);

console.log(partRanges);
console.log(partRanges.map(getCombinations).reduce((acc, x) => acc + x, 0n));
console.log("");

interface Rule {
	part: "x" | "m" | "a" | "s";
	operator: ">" | "<";
	limit: number;
	next: string;
}

interface PartRange {
	x: [number, number];
	m: [number, number];
	a: [number, number];
	s: [number, number];
}

function hasCombinations(pr: PartRange) {
	if (
		pr.x[1] < pr.x[0] ||
		pr.m[1] < pr.m[0] ||
		pr.a[1] < pr.a[0] ||
		pr.s[1] < pr.s[0]
	)
		return false;
	return true;
}

function getCombinations(pr: PartRange): BigInt {
	let x = pr.x[1] - pr.x[0] + 1;
	let m = pr.m[1] - pr.m[0] + 1;
	let a = pr.a[1] - pr.a[0] + 1;
	let s = pr.s[1] - pr.s[0] + 1;

	return BigInt(x) * BigInt(m) * BigInt(a) * BigInt(s);
}

function clone(pr: PartRange): PartRange {
	// return {
	// 	x: pr.x,
	// 	m: pr.m,
	// 	a: pr.a,
	// 	s: pr.s,
	// };
	return JSON.parse(JSON.stringify(pr));
}

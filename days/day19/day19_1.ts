import { Board } from "./helpers/board.ts";
import "/helpers/arrays.ts";
import "/helpers/sets.ts";

// const input = Deno.readTextFileSync("test.txt");
const input = Deno.readTextFileSync("input.txt");

const [rulesTxt, partsTxt] = input.split("\n\n");

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

const parts = partsTxt.split("\n").map((pt) => {
	const p1 = pt.substring(1, pt.length - 1).split(",");
	const part = { x: 0, m: 0, a: 0, s: 0 };
	p1.forEach((p) => {
		part[p.charAt(0)] = parseInt(p.substring(2));
	});
	const c = part.x * part.m * part.a * part.s;
	if (c === 0 || isNaN(c) || typeof c !== "number")
		throw new Error("Bad part " + JSON.stringify(part));
	return part;
});

const sums = parts.map((p) => {
	let rules = ruleMap.get("in");
	if (!rules) throw new Error("Rule not found: in");
	while (true) {
		for (const rule of rules) {
			const next = evaluate(rule, p);
			if (next) {
				if (next === "A") {
					return p.x + p.m + p.a + p.s;
				} else if (next === "R") {
					return 0;
				} else {
					rules = ruleMap.get(next);
					if (!rules) throw new Error("Rule not found: " + next);
					break;
				}
			}
		}
	}
});

console.log(sums.sum());
console.log("");

function evaluate(r: Rule, p: Part) {
	if (r.operator === ">") {
		if (p[r.part] > r.limit) {
			return r.next;
		}
	} else {
		if (p[r.part] < r.limit) {
			return r.next;
		}
	}
	return "";
}

interface Rule {
	part: "x" | "m" | "a" | "s";
	operator: ">" | "<";
	limit: number;
	next: string;
}

interface Part {
	x: number;
	m: number;
	a: number;
	s: number;
}

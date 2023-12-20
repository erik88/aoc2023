import "/helpers/arrays.ts";
import "/helpers/sets.ts";

// const input = Deno.readTextFileSync("test.txt");
const input = Deno.readTextFileSync("input.txt");

interface module {
	type: string;
	targets: string[];
}

interface broadcast extends module {
	type: "b";
}

interface flipFlop extends module {
	type: "%";
	on: boolean;
}

interface conjunction extends module {
	type: "&";
	remember: [string, "high" | "low"][];
}

function buildGraph(lines: string[]): Map<string, module> {
	const map: Map<string, module> = new Map();

	lines.forEach((l) => {
		const s = l.split(" -> ");
		const c = s[0].charAt(0);
		let mod: module;
		if (c === "b") {
			mod = { type: "b" } as broadcast;
		} else if (c === "%") {
			mod = { type: "%", on: false } as flipFlop;
		} else if (c === "&") {
			mod = {
				type: "&",
				remember: [] as [string, "high" | "low"][],
			} as conjunction;
		} else {
			throw new Error("Unknown module type " + c);
		}
		mod.targets = s[1].split(",").map((t) => t.trim());
		map.set(s[0].substring(1), mod);
	});

	// Link all conjunction modules to parents
	[...map.entries()]
		.filter(([_, mod]) => mod.type === "&")
		.forEach(([conjName, conj]) => {
			const c = conj as conjunction;
			[...map.entries()].forEach(([key, mod]) => {
				if (mod.targets.includes(conjName)) {
					c.remember.push([key, "low"]);
				}
			});
		});

	return map;
}

const m = buildGraph(input.split("\n"));

let pulseLowCount = 0;
let pulseHighCount = 0;

for (let i = 0; i < 1000; i++) pushButton();
console.log(pulseLowCount * pulseHighCount);

function pushButton() {
	let pulses: Pulse[] = [];
	const bc = m.get("roadcaster");
	pulseLowCount += 1;
	bc.targets.forEach((x) => {
		pulses.push({ to: x, type: "low", from: "roadcaster" });
	});
	pulseLowCount += bc.targets.length;

	while (pulses.length > 0) {
		pulses = runPulses(pulses);
	}
}

function runPulses(pulses: Pulse[]): Pulse[] {
	const newPulses: Pulse[] = [];
	pulses.forEach((p) => {
		if (p.to === "output") return;
		if (p.to === "rx") return;
		const mod = m.get(p.to);
		if (!mod) throw new Error("Could not find module " + p.to);

		if (mod.type === "%") {
			const m2 = mod as flipFlop;
			if (p.type === "high") {
				// Ignore.
			} else {
				m2.on = !m2.on;
				const beam = m2.on ? "high" : "low";
				m2.targets.forEach((t) => {
					newPulses.push({ to: t, type: beam, from: p.to });
				});
			}
		} else if (mod.type === "&") {
			const m2 = mod as conjunction;
			const rmb = m2.remember.findIndex(([name, _]) => name === p.from);
			if (rmb === -1) throw new Error(p.to + " did not remember " + p.from);
			m2.remember[rmb][1] = p.type;

			let beam: "high" | "low" = "high";
			if (m2.remember.every(([_, val]) => val === "high")) {
				beam = "low";
			}
			m2.targets.forEach((t) => {
				newPulses.push({ to: t, type: beam, from: p.to });
			});
		} else {
			throw new Error("Unexpected module type " + mod.type);
		}
	});
	pulseLowCount += newPulses.filter((p) => p.type === "low").length;
	pulseHighCount += newPulses.filter((p) => p.type === "high").length;
	return newPulses;
}

interface Pulse {
	to: string;
	type: "high" | "low";
	from: string;
}

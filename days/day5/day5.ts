import "/helpers/arrays.ts";
import "/helpers/sets.ts";

let input = Deno.readTextFileSync("input.txt");

// let testSeeds = "79 14 55 13".split(" ").map((x) => parseInt(x));

let seeds =
	"4043382508 113348245 3817519559 177922221 3613573568 7600537 773371046 400582097 2054637767 162982133 2246524522 153824596 1662955672 121419555 2473628355 846370595 1830497666 190544464 230006436 483872831"
		.split(" ")
		.map((x) => parseInt(x));

// let sum = 0;
// seeds.forEach((s, i) => {
// 	if (i % 2 == 0) {
// 	} else sum += s;
// });
// console.log(sum);

let maps = input.split("\n\n").map(parseMap);

let sc = [...seeds];
let intervals: Interval[] = [];
while (sc.length > 0) {
	const [start, size] = sc.take(2);
	intervals.push({ start, size });
}

interface Interval {
	start: number;
	size: number;
}

console.log(
	intervals
		.map((i) => runSeedInterval(maps, i))
		.flat()
		.min((i) => i.start)
);

function runSeedInterval(maps: SeedMap[][], interval: Interval): Interval[] {
	let current = [interval];
	maps.forEach((m) => {
		const mapped: Interval[] = [];
		current.forEach((currentInterval) => {
			mapped.push(...project(m, currentInterval));
		});
		current = mapped;
	});
	return current;
}

function project(maps: SeedMap[], interval: Interval): Interval[] {
	const results: Interval[] = [];
	let leftToProcess: Interval[] = [interval];

	for (let i = 0; i < maps.length; i++) {
		const newLeftToProcess: Interval[] = [];
		leftToProcess.forEach((part) => {
			const [result, rest] = projectSingle(maps[i], part);

			results.push(result);
			newLeftToProcess.push(...rest);
		});
		leftToProcess = newLeftToProcess;
	}
	return [...results, ...leftToProcess].filter((x) => x.size > 0);
}

function projectSingle(
	map: SeedMap,
	interval: Interval
): [Interval, Interval[]] {
	const overlay = getMapSourceInterval(map);
	const [overlap, rest] = getOverlap(interval, overlay);

	const mapped = {
		start: map.destStart + (overlap.start - map.sourceStart),
		size: overlap.size,
	};

	return [mapped, rest.filter((x) => x.size > 0)];
}

function getMapSourceInterval(map: SeedMap): Interval {
	return { start: map.sourceStart, size: map.size };
}

function getOverlap(
	source: Interval,
	overlay: Interval
): [Interval, Interval[]] {
	if (
		overlay.start + overlay.size <= source.start ||
		source.start + source.size <= overlay.start
	) {
		return [{ start: 0, size: 0 }, [source]];
	}

	let start = 0;
	if (overlay.start <= source.start) {
		start = source.start;
	} else {
		start = overlay.start;
	}

	let end = 0;
	if (overlay.start + overlay.size >= source.start + source.size) {
		end = source.start + source.size;
	} else {
		end = overlay.start + overlay.size;
	}

	return [
		{ start, size: end - start },
		[
			{ start: source.start, size: start - source.start },
			{ start: end, size: source.start + source.size - end },
		],
	];
}

// console.log(getOverlap({ start: 3, size: 5 }, { start: 4, size: 2 }));
// console.log("");

// const locs = seeds.map((s) => {
//     return loopSeed(maps, s)
// });
// console.log(locs);
// console.log(locs.min());

function loopSeed(maps: SeedMap[][], seed: number) {
	let current = seed;
	maps.forEach((m) => {
		current = doMap(m, current);
	});
	return current;
}

interface SeedMap {
	sourceStart: number;
	destStart: number;
	size: number;
}

function parseMap(lines: string): SeedMap[] {
	const maps = lines.split("\n").map((x) => {
		const n = x.split(" ");
		return {
			sourceStart: parseInt(n[1]),
			destStart: parseInt(n[0]),
			size: parseInt(n[2]),
		};
	});
	return maps.sortBy((m) => m.sourceStart);
}

function doMap(sms: SeedMap[], seed: number): number {
	const mapsInRange = sms.filter((x) => x.sourceStart <= seed);
	if (mapsInRange.length == 0) return seed;

	const map = mapsInRange.sortBy((x) => x.sourceStart).at(-1) as SeedMap;
	if (seed < map.sourceStart + map.size) {
		return map.destStart + (seed - map.sourceStart);
	}
	return seed;
}

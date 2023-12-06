import "/helpers/arrays.ts";
import "/helpers/sets.ts";

//let input = Deno.readTextFileSync("input.txt");

// Time:        49     78     79     80
// Distance:   298   1185   1066   1181

// const races: Race[] = [
// 	{ time: 49, distance: 298 },
// 	{ time: 78, distance: 1185 },
// 	{ time: 79, distance: 1066 },
// 	{ time: 80, distance: 1181 },
// ];

const races: Race[] = [{ time: 49787980, distance: 298118510661181 }];

interface Race {
	time: number;
	distance: number;
}

const beat = races.map(waysToBeat);

// console.log(beat[0] * beat[1] * beat[2] * beat[3]);
console.log(beat[0]);

function waysToBeat(r: Race): number {
	let firstBeat = 0;
	let lastBeat = 0;
	for (let i = 1; i < r.time; i++) {
		if (runRace(r, i) > r.distance) {
			firstBeat = i;
			break;
		}
	}

	console.log("first", firstBeat);

	for (let i = r.time - 1; i > 0; i--) {
		if (runRace(r, i) > r.distance) {
			lastBeat = i;
			break;
		}
	}

	console.log("last", lastBeat);

	return lastBeat - firstBeat + 1;
}

function runRace(r: Race, pressTime: number) {
	const timeLeft = r.time - pressTime;
	const speed = pressTime;
	const distance = timeLeft * speed;
	return distance;
}

import "../../helpers.ts";

const input = Deno.readTextFileSync("input2.txt");

const lines = input.split("\n");

const games = lines.map((l, i) => {
	const p = l.indexOf(": ") + 2;
	const data = l.substring(p);
	const plays = data
		.split(";")
		.map((g) => g.trim())
		.map((g) => {
			const arr = g
				.split(",")
				.map((x) => x.trim())
				.map(parseSingle);

			const obj = {};
			arr.forEach((aa) => {
				obj[aa[0]] = parseInt(aa[1]);
			});

			if (!obj["blue"]) {
				obj["blue"] = 0;
			}
			if (!obj["green"]) {
				obj["green"] = 0;
			}
			if (!obj["red"]) {
				obj["red"] = 0;
			}

			return obj;
		});

	return {
		id: i + 1,
		plays,
	};
});

// --- PART 1 --------------------------------------------

console.log(
	games
		.filter((g) => g.plays.every((p) => isPlayPossible(p)))
		.map((g) => g.id)
		.sum()
);

// --- PART 2 --------------------------------------------

const maxPlays = games.map((g) => {
	const maxPlay = { red: 0, green: 0, blue: 0 };
	g.plays.forEach((p) => {
		if (p.green > maxPlay.green) {
			maxPlay.green = p.green;
		}
		if (p.blue > maxPlay.blue) {
			maxPlay.blue = p.blue;
		}
		if (p.red > maxPlay.red) {
			maxPlay.red = p.red;
		}
	});
	return maxPlay;
});

console.log(maxPlays.map((mp) => mp.red * mp.blue * mp.green).sum());

// ------------------------------------------------

function parseSingle(s: string) {
	const parts = s.split(" ");
	return [parts[1], parts[0]];
}

function isPlayPossible(play): boolean {
	return play.red <= 12 && play.green <= 13 && play.blue <= 14;
}

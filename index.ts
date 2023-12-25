import "/helpers/arrays.ts";
import "/helpers/sets.ts";

const TEST = false;
const input = TEST
	? Deno.readTextFileSync("test.txt")
	: Deno.readTextFileSync("input.txt");

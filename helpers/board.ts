import "./arrays.ts";

export class Board<T> {
	arr: T[];
	width: number;
	height: number;

	private constructor(arr: T[], width: number, height: number) {
		if (arr.length != width * height) {
			throw new Error(
				"Board has invalid dimensions " +
					width +
					"x" +
					height +
					" for size " +
					arr.length
			);
		}
		this.arr = arr;
		this.width = width;
		this.height = height;
	}

	static fromArray<T>(arr: T[], width: number): Board<T> {
		return new Board(arr, width, arr.length / width);
	}

	static fromMatrix<T>(arr: T[][]): Board<T> {
		return new Board(arr.flat(), arr[0]?.length ?? 0, arr.length);
	}

	static fromString(s: string): Board<string> {
		const lines = s.split("\n");
		const height = lines.length;
		const width = lines[0]?.length ?? 0;
		return new Board(lines.join("").split(""), width, height);
	}

	get(x: number, y: number): T {
		if (!(0 <= x && x < this.width)) {
			throw new Error(
				"Board.get(" + x + "," + y + ") where width=" + this.width
			);
		}
		if (!(0 <= y && y < this.height)) {
			throw new Error(
				"Board.get(" + x + "," + y + ") where height=" + this.height
			);
		}

		return this.arr[x + y * this.width];
	}

	getOr<X>(x: number, y: number, fallback: X): T | X {
		if (0 <= x && x < this.width && 0 <= y && y < this.height) {
			return this.arr[x + y * this.width];
		}
		return fallback;
	}

	run<X>(x: number, y: number, f: (t: T) => X): X | undefined {
		if (0 <= x && x < this.width && 0 <= y && y < this.height) {
			return f(this.arr[x + y * this.width]);
		}
		return undefined;
	}

	map(x: number, y: number, f: (t: T) => T): T | undefined {
		if (0 <= x && x < this.width && 0 <= y && y < this.height) {
			const val = f(this.arr[x + y * this.width]);
			this.arr[x + y * this.width] = val;
			return val;
		}
		return undefined;
	}

	print(
		rowStart?: number,
		rowEnd?: number,
		colStart?: number,
		colEnd?: number
	) {
		rowStart = Math.max(rowStart || 0, 0);
		rowEnd = Math.min(rowEnd || this.height, this.height);
		colStart = Math.max(colStart || 0, 0);
		colEnd = Math.min(colEnd || this.width, this.width);

		if (rowStart >= rowEnd) {
			throw new Error(
				"Board.print(): rowStart should be smaller than rowEnd (" +
					rowStart +
					"," +
					rowEnd +
					")"
			);
		}
		if (colStart >= colEnd) {
			throw new Error(
				"Board.print(): colStart should be smaller than colEnd (" +
					colStart +
					"," +
					colEnd +
					")"
			);
		}

		const output: string[][] = [];
		for (let i = rowStart; i < rowEnd; i++) {
			output.push(
				this.arr
					.slice(colStart + i * this.width, colEnd + i * this.width)
					.map((x) => String(x))
			);
		}

		const printLength = output.flat().max((x) => x.length).length;
		console.log(
			output
				.map((x) => x.map((y) => pad(y, " ", printLength)).join(" "))
				.join("\n")
		);
	}
}

function pad(s: string, padding: string, size: number) {
	let res = s;
	while (res.length < size) {
		res += padding;
	}
	return res;
}

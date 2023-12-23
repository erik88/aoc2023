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

	static fromEmpty<T>(val: T, width: number, height: number): Board<T> {
		const arr = new Array(width * height);
		arr.fill(val);
		return new Board(arr, width, height);
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

	find(t: T): [number, number] {
		for (let i = 0; i < this.arr.length; i++) {
			if (this.arr[i] === t) {
				return [i % this.width, Math.floor(i / this.width)];
			}
		}
		throw new Error("Board.find " + t + "did not return any objects");
	}

	set(x: number, y: number, t: T) {
		if (!(0 <= x && x < this.width)) {
			throw new Error(
				"Board.set(" + x + "," + y + ") where width=" + this.width
			);
		}
		if (!(0 <= y && y < this.height)) {
			throw new Error(
				"Board.set(" + x + "," + y + ") where height=" + this.height
			);
		}

		this.arr[x + y * this.width] = t;
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

	mapRange(
		xstart: number,
		ystart: number,
		xend: number,
		yend: number,
		f: (t: T, xcurr: number, ycurr: number) => T
	) {
		if (xstart > xend) {
			const tmp = xstart;
			xstart = xend;
			xend = tmp;
		}
		if (ystart > yend) {
			const tmp = ystart;
			ystart = yend;
			yend = tmp;
		}
		for (let x = xstart; x <= xend; x++)
			for (let y = ystart; y <= yend; y++)
				this.arr[x + y * this.width] = f(this.arr[x + y * this.width], x, y);
	}

	mapAll(f: (t: T, xcurr: number, ycurr: number) => T) {
		for (let x = 0; x < this.width; x++)
			for (let y = 0; y < this.height; y++)
				this.arr[x + y * this.width] = f(this.arr[x + y * this.width], x, y);
	}

	newFromMap<X>(f: (t: T, xcurr: number, ycurr: number) => X): Board<X> {
		const arr = [];
		for (let x = 0; x < this.width; x++)
			for (let y = 0; y < this.height; y++)
				arr[x + y * this.width] = f(this.arr[x + y * this.width], x, y);
		return new Board(arr, this.width, this.height);
	}

	getColumn(x: number): T[] {
		const arr: T[] = [];
		for (let y = 0; y < this.height; y++) {
			arr.push(this.get(x, y));
		}
		return arr;
	}

	getRow(y: number): T[] {
		const arr: T[] = [];
		for (let x = 0; x < this.width; x++) {
			arr.push(this.get(x, y));
		}
		return arr;
	}

	isInside(x: number, y: number): boolean {
		return 0 <= x && x < this.width && 0 <= y && y < this.height;
	}

	forEach(f: (t: T, x: number, y: number) => void) {
		for (let x = 0; x < this.width; x++)
			for (let y = 0; y < this.height; y++)
				f(this.arr[x + y * this.width], x, y);
	}

	toString(): string {
		let rows: string[] = [];
		for (let r = 0; r < this.height; r++)
			rows.push(this.arr.slice(r * this.width, (r + 1) * this.width).join(""));
		return rows.join("\n");
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

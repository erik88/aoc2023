declare global {
	interface Array<T> {
		getNonNumbers<T>(): T[];
		hasOnlyNumbers(): boolean;
		sum(): number;
		min(f?: (t: T) => number): T;
		max(f?: (t: T) => number): T;
		allMin(f?: (t: T) => number): T[];
		allMax(f?: (t: T) => number): T[];
		numSort(): T[];
		mapToNumbers(): number[];
		groupsOf(n: number): [T][];
		take(n: number): T[];
		sortBy(p: (t: T) => any): T[];
		groupBy<X>(p: (t: T) => X): Map<X, T[]>;
		unique(p: (t: T) => any): T[];
	}
}
Array.prototype.sum = function () {
	if (!this.hasOnlyNumbers()) {
		throw new Error("sum(): Array has non numerical entries");
	}

	return this.reduce((x, y) => x + y, 0);
};
Array.prototype.max = function <T>(f?: (t: T) => number): T {
	if (this.length === 0) {
		throw new Error("max(): Array is empty");
	}

	let p = (x: T) => x as number;
	if (!f) {
		if (!this.hasOnlyNumbers()) {
			throw new Error("max(): Array has non numerical entries");
		}
	} else {
		p = f;
	}

	let max = p(this[0]);
	let maxElem = this[0];
	this.forEach((x) => {
		const val = p(x);
		if (val > max) {
			max = val;
			maxElem = x;
		}
	});
	return maxElem;
};
Array.prototype.min = function <T>(f?: (t: T) => number): T {
	if (this.length === 0) {
		throw new Error("min(): Array is empty");
	}

	let p = (x: T) => x as number;
	if (!f) {
		if (!this.hasOnlyNumbers()) {
			throw new Error("min(): Array has non numerical entries");
		}
	} else {
		p = f;
	}

	let min = p(this[0]);
	let minElem = this[0];
	this.forEach((x) => {
		const val = p(x);
		if (val < min) {
			min = val;
			minElem = x;
		}
	});
	return minElem;
};
Array.prototype.allMin = function <T>(f?: (t: T) => number): T[] {
	let p = (x: T) => x as number;
	if (!f) {
		if (!this.hasOnlyNumbers()) {
			throw new Error("allMin(): Array has non numerical entries");
		}
	} else {
		p = f;
	}

	let min = 0;
	let minElems: T[] = [];
	this.forEach((x) => {
		const val = p(x);
		if (minElems.length === 0 || val < min) {
			min = val;
			minElems = [x];
		} else if (val === min) {
			minElems.push(x);
		}
	});
	return minElems;
};
Array.prototype.allMax = function <T>(f?: (t: T) => number): T[] {
	let p = (x: T) => x as number;
	if (!f) {
		if (!this.hasOnlyNumbers()) {
			throw new Error("allMax(): Array has non numerical entries");
		}
	} else {
		p = f;
	}

	let max = 0;
	let maxElems: T[] = [];
	this.forEach((x) => {
		const val = p(x);
		if (maxElems.length === 0 || val > max) {
			max = val;
			maxElems = [x];
		} else if (val === max) {
			maxElems.push(x);
		}
	});
	return maxElems;
};
Array.prototype.numSort = function () {
	if (!this.hasOnlyNumbers()) {
		throw new Error("numSort(): Array has non numerical entries");
	}

	const copy = [...this];
	copy.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
	return copy;
};
Array.prototype.getNonNumbers = function () {
	return this.filter((x) => typeof x !== "number" || isNaN(x));
};
Array.prototype.hasOnlyNumbers = function () {
	return this.getNonNumbers().length == 0;
};
Array.prototype.mapToNumbers = function () {
	return this.map((x) => parseInt(x)).filter((x) => !isNaN(x));
};
Array.prototype.groupsOf = function <T>(n: number) {
	const a: [T][] = [];
	let mod = 0;
	let current: T[] = [];
	for (let i = 0; i < this.length; i++) {
		current.push(this[i]);
		if (++mod >= n) {
			a.push(current as [T]);
			mod = 0;
			current = [];
		}
	}
	return a;
};
Array.prototype.take = function (n: number) {
	return this.splice(0, n);
};
Array.prototype.sortBy = function <T>(p: (t: T) => any): T[] {
	const types = new Set(this.map((x) => typeof p(x)));
	if (types.size > 1) {
		throw new Error(
			"sortBy contained more than 1 type: " + [...types].join(", ")
		);
	}

	return [...this].sort((x, y) => {
		const a = p(x);
		const b = p(y);
		return a < b ? -1 : a > b ? 1 : 0;
	});
};
Array.prototype.groupBy = function <T, X>(p: (t: T) => X): Map<X, T[]> {
	return Map.groupBy(this, p);
};
Array.prototype.unique = function <T>(p: (t: T) => any): T[] {
	const types = new Set(this.map((x) => typeof p(x)));
	if (types.size > 1) {
		throw new Error(
			"sortBy contained more than 1 type: " + [...types].join(", ")
		);
	}

	const included = new Set();
	return [...this].filter((x) => {
		const key = p(x);
		if (!included.has(key)) {
			included.add(key);
			return true;
		}
		return false;
	});
};

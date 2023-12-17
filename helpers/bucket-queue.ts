/*
	A lazy min-priority queue with minimal sorting.
	Use leastBound() to enrue that all remaining elements in the queue
	are larger than a certain value
*/
export class BucketQueue<T> {
	limit: number;
	bucketCount: number;
	bucketLen: number;
	keyFunc: (t: T) => number;
	buckets: { key: number; val: T }[][];
	minBucket: number;

	constructor(limit: number, bucketCount: number, keyFunc: (t: T) => number) {
		this.limit = limit;
		this.bucketCount = bucketCount;
		this.bucketLen = this.limit / this.bucketCount;
		this.keyFunc = keyFunc;

		this.minBucket = this.bucketCount;
		this.buckets = new Array(bucketCount);
		for (let i = 0; i < bucketCount; i++) this.buckets[i] = [];
	}

	public add(t: T) {
		const key = this.keyFunc(t);
		const bi = Math.floor(key / this.bucketLen);
		this.buckets[bi].push({ key, val: t });
		if (bi < this.minBucket) this.minBucket = bi;
	}

	public pop(): T | null {
		if (this.minBucket >= this.bucketCount) return null;

		const element = this.buckets[this.minBucket].pop() as {
			key: number;
			val: T;
		};

		if (this.buckets[this.minBucket].length === 0) {
			while (this.minBucket < this.bucketCount) {
				if (this.buckets[this.minBucket].length > 0) break;
				this.minBucket++;
			}
		}

		return element.val;
	}

	public leastBound(): number {
		return Math.floor(this.minBucket * this.bucketLen);
	}
}

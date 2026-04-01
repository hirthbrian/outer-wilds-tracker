import { LOOP_DURATION } from './events';

class Timer {
	elapsed = $state(0);
	running = $state(false);
	#intervalId: ReturnType<typeof setInterval> | null = null;

	get progress(): number {
		return this.elapsed / LOOP_DURATION;
	}

	get timeString(): string {
		const m = Math.floor(this.elapsed / 60);
		const s = this.elapsed % 60;
		return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
	}

	get isSupernova(): boolean {
		return this.elapsed >= LOOP_DURATION;
	}

	get isEndTimes(): boolean {
		return this.elapsed >= 1200 && this.elapsed < LOOP_DURATION;
	}

	start() {
		if (this.running || this.isSupernova) return;
		this.running = true;
		this.#intervalId = setInterval(() => {
			this.elapsed += 1;
			if (this.elapsed >= LOOP_DURATION) {
				this.elapsed = LOOP_DURATION;
				this.#stop();
			}
		}, 1000);
	}

	pause() {
		this.#stop();
	}

	reset() {
		this.#stop();
		this.elapsed = 0;
	}

	seek(seconds: number) {
		this.elapsed = Math.max(0, Math.min(LOOP_DURATION, Math.round(seconds)));
	}

	#stop() {
		this.running = false;
		if (this.#intervalId !== null) {
			clearInterval(this.#intervalId);
			this.#intervalId = null;
		}
	}
}

export const timer = new Timer();

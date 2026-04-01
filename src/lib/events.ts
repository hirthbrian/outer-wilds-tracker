export interface OWEvent {
	id: number;
	planet: string;
	timeSeconds: number;
	endSeconds?: number;
	title: string;
	description: string;
	ongoing?: boolean;
}

export type EventStatus = 'upcoming' | 'active' | 'past';

export const LOOP_DURATION = 1320; // 22 minutes in seconds
const ACTIVE_WINDOW = 30; // seconds a point event stays "active" after triggering

export function getEventStatus(event: OWEvent, elapsed: number): EventStatus {
	if (elapsed < event.timeSeconds) return 'upcoming';
	const end = event.ongoing ? (event.endSeconds ?? LOOP_DURATION) : event.timeSeconds + ACTIVE_WINDOW;
	if (elapsed <= end) return 'active';
	return 'past';
}

export const events: OWEvent[] = [
	{
		id: 1,
		planet: 'Timber Hearth',
		timeSeconds: 0,
		title: 'Loop begins',
		description:
			'You wake up at the campfire on Timber Hearth. The sun is stable — for now. 22 minutes remain.'
	},
	{
		id: 2,
		planet: 'Ash Twin',
		timeSeconds: 120,
		endSeconds: 1200,
		title: 'Sand begins flowing to Ember Twin',
		description:
			"Sand starts transferring from Ash Twin to Ember Twin like a cosmic hourglass. The caves of Ember Twin will gradually fill over the next 20 minutes, burying structures and blocking access.",
		ongoing: true
	},
	{
		id: 3,
		planet: 'Brittle Hollow',
		timeSeconds: 420,
		endSeconds: 1320,
		title: 'Collapse begins',
		description:
			"Lava bombardment from Hollow's Lantern fractures Brittle Hollow's crust. Chunks fall continuously into the black hole at the planet's core. New paths open as the planet breaks apart.",
		ongoing: true
	},
	{
		id: 4,
		planet: 'Ash Twin',
		timeSeconds: 480,
		endSeconds: 840,
		title: 'Warp tower access window',
		description:
			'The sand pillar on Ash Twin rises to the height of the warp tower. Ride the sand stream upward to reach the tower and access the warp network. The window closes as sand levels drop.',
		ongoing: true
	},
	{
		id: 5,
		planet: 'Sun',
		timeSeconds: 1200,
		title: '"End Times" begins',
		description:
			'The haunting End Times melody begins playing. The sun is visibly swelling. Approximately 2 minutes remain in the loop — wrap up what you are doing.'
	},
	{
		id: 6,
		planet: 'Sun',
		timeSeconds: 1200,
		title: 'Interloper enters the sun',
		description:
			"The Interloper comet, caught by the expanding sun on its elliptical orbit, plunges into it. The comet that carried Ghost Matter across the solar system meets its end."
	},
	{
		id: 7,
		planet: 'Ash Twin',
		timeSeconds: 1200,
		title: 'Sand transfer complete',
		description:
			"Ash Twin is nearly emptied of sand. The lower tunnels and ruins of Ember Twin are buried under meters of sand and no longer accessible."
	},
	{
		id: 8,
		planet: 'All',
		timeSeconds: 1320,
		title: 'Supernova',
		description:
			'The sun goes supernova. The Ash Twin Project activates, sending your memories 22 minutes back in time. The loop resets — but you remember everything.'
	}
];

export const planets = ['All', 'Timber Hearth', 'Ash Twin', 'Brittle Hollow', 'Sun'];

export type EventCategory = 'milestone' | 'warp' | 'character' | 'location' | 'environmental' | 'critical';

export interface OWEvent {
	id: number;
	planet: string;
	timeSeconds: number;
	endSeconds?: number;
	title: string;
	description: string;
	ongoing?: boolean;
	category: EventCategory;
}

export type EventStatus = 'upcoming' | 'active' | 'past';

export const LOOP_DURATION = 1320; // 22 minutes in seconds
const ACTIVE_WINDOW = 25; // seconds a point event stays "active" after triggering

export function getEventStatus(event: OWEvent, elapsed: number): EventStatus {
	if (elapsed < event.timeSeconds) return 'upcoming';
	const end = event.ongoing ? (event.endSeconds ?? LOOP_DURATION) : event.timeSeconds + ACTIVE_WINDOW;
	if (elapsed <= end) return 'active';
	return 'past';
}

export const events: OWEvent[] = [
	{ id: 1,  planet: 'All',           timeSeconds: 0,    title: 'Loop Begins',                          description: 'You wake up at the campfire on Timber Hearth. The sun is stable — for now.',                                                              category: 'milestone' },
	{ id: 2,  planet: 'Ash Twin',      timeSeconds: 120,  endSeconds: 1220, title: 'Sand Begins Flowing', description: 'Sand starts transferring from Ash Twin to Ember Twin. Caves on Ember Twin will gradually fill over the next ~18 minutes.',             category: 'location',     ongoing: true },
	{ id: 3,  planet: 'Timber Hearth', timeSeconds: 200,  title: 'Satellite Reaches 40°',                description: 'The Hearthian satellite reaches 40° in its orbital arc.',                                                                              category: 'environmental' },
	{ id: 4,  planet: 'Interloper',    timeSeconds: 220,  endSeconds: 260,  title: 'Interloper Opens (1st window)', description: 'The Interloper cracks open. You have a ~40-second window to enter the comet.',                                             category: 'location',     ongoing: true },
	{ id: 5,  planet: 'Ash Twin',      timeSeconds: 320,  title: 'Tower Opens: Sun Station',             description: 'The Ash Twin warp tower aligned to Sun Station becomes active.',                                                                       category: 'location' },
	{ id: 6,  planet: 'Ash Twin',      timeSeconds: 350,  endSeconds: 370,  title: 'High Energy Lab Accessible', description: 'The High Energy Lab (HEL) on Ash Twin is accessible through the sand gap. Window lasts ~20 seconds.',                         category: 'location',     ongoing: true },
	{ id: 7,  planet: 'Ash Twin',      timeSeconds: 380,  title: 'Warp: Sun Station',                    description: 'Ash Twin warp pad aligns to Sun Station.',                                                                                            category: 'warp' },
	{ id: 8,  planet: 'The Stranger',  timeSeconds: 400,  title: "Stranger's Sails Deploy",              description: 'The Stranger deploys its enormous solar sails, becoming more visible as it shifts orientation.',                                        category: 'environmental' },
	{ id: 9,  planet: 'Ash Twin',      timeSeconds: 429,  title: 'Warp: Sun Station',                    description: 'Ash Twin warp pad aligns to Sun Station.',                                                                                            category: 'warp' },
	{ id: 10, planet: 'Ash Twin',      timeSeconds: 445,  title: 'Tower Opens: Hourglass Twins',         description: 'The Ash Twin warp tower aligned to the Hourglass Twins becomes active.',                                                               category: 'location' },
	{ id: 11, planet: 'Ash Twin',      timeSeconds: 470,  title: 'Warp: Ash Twin',                       description: 'Warp pad activates — destination: Ash Twin.',                                                                                         category: 'warp' },
	{ id: 12, planet: 'Ash Twin',      timeSeconds: 472,  title: 'Warp: Ember Twin',                     description: 'Warp pad activates — destination: Ember Twin.',                                                                                       category: 'warp' },
	{ id: 13, planet: 'Ash Twin',      timeSeconds: 480,  title: 'Warp: Sun Station',                    description: 'Ash Twin warp pad aligns to Sun Station.',                                                                                            category: 'warp' },
	{ id: 14, planet: 'Ash Twin',      timeSeconds: 528,  title: 'Warp: Sun Station',                    description: 'Ash Twin warp pad aligns to Sun Station.',                                                                                            category: 'warp' },
	{ id: 15, planet: 'Ash Twin',      timeSeconds: 579,  title: 'Warp: Sun Station',                    description: 'Ash Twin warp pad aligns to Sun Station.',                                                                                            category: 'warp' },
	{ id: 16, planet: 'Ash Twin',      timeSeconds: 615,  title: 'Tower Opens: Brittle Hollow',          description: 'The Ash Twin warp tower aligned to Brittle Hollow becomes active.',                                                                    category: 'location' },
	{ id: 17, planet: 'Ash Twin',      timeSeconds: 615,  title: 'Warp: Ash Twin',                       description: 'Warp pad activates — destination: Ash Twin.',                                                                                         category: 'warp' },
	{ id: 18, planet: 'Ash Twin',      timeSeconds: 620,  title: 'Tower Opens: Timber Hearth',           description: 'The Ash Twin warp tower aligned to Timber Hearth becomes active.',                                                                     category: 'location' },
	{ id: 19, planet: 'Ash Twin',      timeSeconds: 620,  title: 'Warp: Ember Twin',                     description: 'Warp pad activates — destination: Ember Twin.',                                                                                       category: 'warp' },
	{ id: 20, planet: 'Ash Twin',      timeSeconds: 628,  title: 'Warp: Sun Station',                    description: 'Ash Twin warp pad aligns to Sun Station.',                                                                                            category: 'warp' },
	{ id: 21, planet: 'Ash Twin',      timeSeconds: 638,  title: "Tower Opens: Giant's Deep (Top)",      description: "The Ash Twin warp tower aligned to Giant's Deep (top entrance) becomes active.",                                                       category: 'location' },
	{ id: 22, planet: 'Ember Twin',    timeSeconds: 660,  title: 'Chert Becomes Nervous',                description: "Chert's instruments are picking up anomalies in the sun. They begin to grow visibly anxious.",                                         category: 'character' },
	{ id: 23, planet: 'Ember Twin',    timeSeconds: 665,  title: 'Stepping Stone District Buried',       description: 'The Stepping Stone District in Ember Twin caves is completely buried by sand.',                                                        category: 'location' },
	{ id: 24, planet: 'Ash Twin',      timeSeconds: 678,  title: 'Warp: Sun Station [LAST]',             description: 'Last opportunity to warp to Sun Station this loop.',                                                                                   category: 'warp' },
	{ id: 25, planet: 'Ash Twin',      timeSeconds: 682,  title: 'Warp: Timber Hearth',                  description: 'Warp pad activates — destination: Timber Hearth.',                                                                                    category: 'warp' },
	{ id: 26, planet: 'Sun Station',   timeSeconds: 690,  title: 'Sun Station Destroyed',                description: 'The Sun Station is destroyed by the expanding sun. Any plans involving it must be completed before this point.',                        category: 'critical' },
	{ id: 27, planet: 'Interloper',    timeSeconds: 695,  endSeconds: 735,  title: 'Interloper Opens (2nd window)', description: 'The Interloper opens again for another ~40-second access window.',                                                         category: 'location',     ongoing: true },
	{ id: 28, planet: 'Ash Twin',      timeSeconds: 701,  title: "Warp: Giant's Deep",                   description: "Warp pad activates — destination: Giant's Deep.",                                                                                      category: 'warp' },
	{ id: 29, planet: 'Ash Twin',      timeSeconds: 732,  title: 'Warp: Brittle Hollow',                 description: 'Warp pad activates — destination: Brittle Hollow.',                                                                                   category: 'warp' },
	{ id: 30, planet: 'Ash Twin',      timeSeconds: 736,  title: "Tower Opens: Giant's Deep (Middle)",   description: "The Ash Twin warp tower aligned to Giant's Deep (middle entrance) becomes active.",                                                    category: 'location' },
	{ id: 31, planet: 'Ash Twin',      timeSeconds: 752,  title: 'Warp: Timber Hearth',                  description: 'Warp pad activates — destination: Timber Hearth.',                                                                                    category: 'warp' },
	{ id: 32, planet: 'Ash Twin',      timeSeconds: 762,  title: 'Warp: Ash Twin',                       description: 'Warp pad activates — destination: Ash Twin.',                                                                                         category: 'warp' },
	{ id: 33, planet: 'Ash Twin',      timeSeconds: 766,  title: 'Warp: Ember Twin',                     description: 'Warp pad activates — destination: Ember Twin.',                                                                                       category: 'warp' },
	{ id: 34, planet: 'Timber Hearth', timeSeconds: 780,  title: 'Dam Bursts',                           description: 'The dam on Timber Hearth gives way, releasing a surge of water downstream.',                                                          category: 'environmental' },
	{ id: 35, planet: 'Ash Twin',      timeSeconds: 785,  title: "Warp: Giant's Deep",                   description: "Warp pad activates — destination: Giant's Deep.",                                                                                      category: 'warp' },
	{ id: 36, planet: 'Timber Hearth', timeSeconds: 790,  title: 'River Lowlands Flooded',               description: 'The River Lowlands area on Timber Hearth fills with water following the dam burst.',                                                   category: 'environmental' },
	{ id: 37, planet: 'Ash Twin',      timeSeconds: 799,  title: 'Warp: Brittle Hollow',                 description: 'Warp pad activates — destination: Brittle Hollow.',                                                                                   category: 'warp' },
	{ id: 38, planet: 'Timber Hearth', timeSeconds: 810,  title: 'Cinder Isles Flooded',                 description: 'The Cinder Isles region on Timber Hearth is flooded. Some paths become impassable on foot.',                                          category: 'environmental' },
	{ id: 39, planet: 'Ash Twin',      timeSeconds: 812,  title: 'Warp: Timber Hearth',                  description: 'Warp pad activates — destination: Timber Hearth.',                                                                                    category: 'warp' },
	{ id: 40, planet: 'Timber Hearth', timeSeconds: 820,  title: 'Hidden Gorge Walkways Destroyed',      description: 'The wooden walkways in the Hidden Gorge are swept away by floodwater.',                                                               category: 'environmental' },
	{ id: 41, planet: 'Ember Twin',    timeSeconds: 860,  title: 'Gravity Cannon Controls Buried',       description: 'The Ember Twin gravity cannon controls are buried. The cannon can no longer be operated.',                                             category: 'location' },
	{ id: 42, planet: 'Ash Twin',      timeSeconds: 864,  title: "Warp: Giant's Deep",                   description: "Warp pad activates — destination: Giant's Deep.",                                                                                      category: 'warp' },
	{ id: 43, planet: 'Ember Twin',    timeSeconds: 865,  title: 'Anglerfish Overlook Inaccessible',     description: 'The Anglerfish Overlook in Ember Twin caves is sealed off by sand.',                                                                   category: 'location' },
	{ id: 44, planet: 'Ash Twin',      timeSeconds: 877,  title: 'Warp: Brittle Hollow',                 description: 'Warp pad activates — destination: Brittle Hollow.',                                                                                   category: 'warp' },
	{ id: 45, planet: 'Ash Twin',      timeSeconds: 878,  title: 'Warp: Timber Hearth',                  description: 'Warp pad activates — destination: Timber Hearth.',                                                                                    category: 'warp' },
	{ id: 46, planet: 'Ash Twin',      timeSeconds: 900,  title: 'Temple of the Eye Buried',             description: 'The Temple of the Eye on Ash Twin is completely buried under sand and no longer accessible.',                                          category: 'location' },
	{ id: 47, planet: 'Ash Twin',      timeSeconds: 908,  title: 'Warp: Ash Twin',                       description: 'Warp pad activates — destination: Ash Twin.',                                                                                         category: 'warp' },
	{ id: 48, planet: 'Ash Twin',      timeSeconds: 913,  title: 'Warp: Ember Twin',                     description: 'Warp pad activates — destination: Ember Twin.',                                                                                       category: 'warp' },
	{ id: 49, planet: 'Ash Twin',      timeSeconds: 940,  title: "Warp: Giant's Deep",                   description: "Warp pad activates — destination: Giant's Deep.",                                                                                      category: 'warp' },
	{ id: 50, planet: 'Ash Twin',      timeSeconds: 946,  title: 'Warp: Brittle Hollow',                 description: 'Warp pad activates — destination: Brittle Hollow.',                                                                                   category: 'warp' },
	{ id: 51, planet: 'Ash Twin',      timeSeconds: 952,  title: 'Warp: Timber Hearth',                  description: 'Warp pad activates — destination: Timber Hearth.',                                                                                    category: 'warp' },
	{ id: 52, planet: 'Ember Twin',    timeSeconds: 980,  title: 'Escape Pod #2 Buried',                 description: 'Escape Pod #2 is completely buried under sand on Ember Twin.',                                                                        category: 'location' },
	{ id: 53, planet: 'Ember Twin',    timeSeconds: 1005, title: 'Sunless City Fully Buried',            description: 'The Sunless City is now completely inaccessible — buried entirely under sand.',                                                        category: 'location' },
	{ id: 54, planet: 'Ash Twin',      timeSeconds: 1006, title: "Tower Opens: Giant's Deep (Base)",     description: "The Ash Twin warp tower aligned to Giant's Deep (base entrance) becomes active.",                                                      category: 'location' },
	{ id: 55, planet: 'Ash Twin',      timeSeconds: 1010, title: 'Warp: Timber Hearth',                  description: 'Warp pad activates — destination: Timber Hearth.',                                                                                    category: 'warp' },
	{ id: 56, planet: 'Ash Twin',      timeSeconds: 1020, title: 'Warp: Brittle Hollow',                 description: 'Warp pad activates — destination: Brittle Hollow.',                                                                                   category: 'warp' },
	{ id: 57, planet: 'Ember Twin',    timeSeconds: 1020, title: 'Chert Panics',                         description: 'Chert is now in full panic — their readings confirm the sun is going supernova.',                                                      category: 'character' },
	{ id: 58, planet: 'Ash Twin',      timeSeconds: 1025, title: "Warp: Giant's Deep",                   description: "Warp pad activates — destination: Giant's Deep.",                                                                                      category: 'warp' },
	{ id: 59, planet: 'Ash Twin',      timeSeconds: 1056, title: 'Warp: Ash Twin',                       description: 'Warp pad activates — destination: Ash Twin.',                                                                                         category: 'warp' },
	{ id: 60, planet: 'Ash Twin',      timeSeconds: 1059, title: 'Warp: Ember Twin',                     description: 'Warp pad activates — destination: Ember Twin.',                                                                                       category: 'warp' },
	{ id: 61, planet: 'Ash Twin',      timeSeconds: 1075, title: 'Warp: Timber Hearth',                  description: 'Warp pad activates — destination: Timber Hearth.',                                                                                    category: 'warp' },
	{ id: 62, planet: 'Brittle Hollow',timeSeconds: 1085, title: 'Quantum Tower Exits White Hole',       description: "The Quantum Tower — pulled into Brittle Hollow's black hole — re-emerges from the White Hole Station.",                                category: 'location' },
	{ id: 63, planet: 'Ash Twin',      timeSeconds: 1094, title: 'Warp: Brittle Hollow',                 description: 'Warp pad activates — destination: Brittle Hollow.',                                                                                   category: 'warp' },
	{ id: 64, planet: 'Ash Twin',      timeSeconds: 1096, title: "Warp: Giant's Deep",                   description: "Warp pad activates — destination: Giant's Deep.",                                                                                      category: 'warp' },
	{ id: 65, planet: 'Ash Twin',      timeSeconds: 1150, title: 'Warp: Timber Hearth',                  description: 'Warp pad activates — destination: Timber Hearth.',                                                                                    category: 'warp' },
	{ id: 66, planet: 'Ash Twin',      timeSeconds: 1163, title: 'Warp: Brittle Hollow',                 description: 'Warp pad activates — destination: Brittle Hollow.',                                                                                   category: 'warp' },
	{ id: 67, planet: 'Interloper',    timeSeconds: 1175, endSeconds: 1185, title: 'Interloper Opens (Final window)', description: 'The Interloper opens one last time before plunging into the sun. Only 10 seconds.',                                       category: 'location',     ongoing: true },
	{ id: 68, planet: 'Ash Twin',      timeSeconds: 1181, title: "Warp: Giant's Deep",                   description: "Warp pad activates — destination: Giant's Deep.",                                                                                      category: 'warp' },
	{ id: 69, planet: 'Interloper',    timeSeconds: 1185, title: 'Interloper Collides with Sun',         description: 'The Interloper is caught by the expanding sun on its elliptical orbit and plunges into it.',                                           category: 'critical' },
	{ id: 70, planet: 'Ash Twin',      timeSeconds: 1198, title: 'Warp: Ash Twin [LAST]',                description: 'Last warp to Ash Twin this loop.',                                                                                                     category: 'warp' },
	{ id: 71, planet: 'Ash Twin',      timeSeconds: 1204, title: 'Warp: Ember Twin [LAST]',              description: 'Last warp to Ember Twin this loop.',                                                                                                   category: 'warp' },
	{ id: 72, planet: 'Ash Twin',      timeSeconds: 1208, title: 'Warp: Timber Hearth',                  description: 'Warp pad activates — destination: Timber Hearth.',                                                                                    category: 'warp' },
	{ id: 73, planet: 'Ash Twin',      timeSeconds: 1220, title: 'Hourglass Sand Stops Flowing',         description: 'Ash Twin is nearly emptied of sand. Sand flow ceases.',                                                                               category: 'location' },
	{ id: 74, planet: 'Brittle Hollow',timeSeconds: 1230, title: 'Cinder Isles Tower Completely Falls',  description: 'The last standing section of the Cinder Isles tower collapses into the black hole.',                                                  category: 'environmental' },
	{ id: 75, planet: 'Ember Twin',    timeSeconds: 1230, title: 'Chert Becomes Catatonic',              description: "Chert has shut down, staring blankly into space. There's nothing left to say.",                                                       category: 'character' },
	{ id: 76, planet: 'All',           timeSeconds: 1235, title: 'Beginning of the End',                 description: 'The sun begins its final expansion. Only ~85 seconds remain before supernova.',                                                        category: 'milestone' },
	{ id: 77, planet: 'Ash Twin',      timeSeconds: 1241, title: 'Warp: Brittle Hollow',                 description: 'Warp pad activates — destination: Brittle Hollow.',                                                                                   category: 'warp' },
	{ id: 78, planet: 'Ash Twin',      timeSeconds: 1257, title: "Warp: Giant's Deep",                   description: "Warp pad activates — destination: Giant's Deep.",                                                                                      category: 'warp' },
	{ id: 79, planet: 'Ash Twin',      timeSeconds: 1274, title: 'Warp: Timber Hearth [LAST]',           description: 'Last warp to Timber Hearth this loop.',                                                                                               category: 'warp' },
	{ id: 80, planet: 'Ash Twin',      timeSeconds: 1308, title: 'Warp: Brittle Hollow [LAST]',          description: 'Last warp to Brittle Hollow this loop.',                                                                                              category: 'warp' },
	{ id: 81, planet: 'All',           timeSeconds: 1320, title: 'Supernova',                            description: 'The sun goes supernova. The Ash Twin Project activates, sending your memories 22 minutes back. The loop resets.',                      category: 'critical' },
	{ id: 82, planet: 'Ash Twin',      timeSeconds: 1330, title: 'ATP Black Hole Opens',                 description: "The Ash Twin Project's black hole opens, completing the memory transfer that resets the loop.",                                        category: 'milestone' },
	{ id: 83, planet: 'Ash Twin',      timeSeconds: 1336, title: "Warp: Giant's Deep [LAST]",            description: "Last warp to Giant's Deep this loop.",                                                                                                 category: 'warp' },
];

export const planets = [
	'All',
	'Ash Twin',
	'Ember Twin',
	'Brittle Hollow',
	'Timber Hearth',
	"Giant's Deep",
	'Interloper',
	'The Stranger',
	'Sun Station'
];

export const categories: { value: EventCategory; label: string }[] = [
	{ value: 'milestone', label: 'Milestones' },
	{ value: 'warp', label: 'Warps' },
	{ value: 'character', label: 'Characters' },
	{ value: 'location', label: 'Locations' },
	{ value: 'environmental', label: 'Environment' },
	{ value: 'critical', label: 'Critical' }
];

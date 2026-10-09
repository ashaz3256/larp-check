// Keyword scorer. Used when there is no API key or the AI call fails, so the site never breaks.
const TIERS = [
  [20, "Certified real one", "Nothing to see here. You wrote down what you actually do, which is rare online."],
  [45, "Light seasoning", "Mostly believable, with a bit of polish on top. Everyone does it."],
  [70, "Suspicious activity", "Some of this is true and some of it is a character you are playing."],
  [88, "Full-time larper", "You are not describing your life, you are pitching a film about it."],
  [101, "Academy Award larp", "Method acting. Nobody has ever met the person in this bio, including you."],
];
const FLAGS = [
  [/7[ -]?fig|6[ -]?fig|8[ -]?fig|millionaire|\$\d+k|\d+k\b/i, "Money figures nobody can check"],
  [/self[- ]made|built different|sigma|alpha|matrix/i, "Main-character vocabulary"],
  [/entrepreneur|founder|ceo|visionary|thought leader|mogul/i, "Big titles, no company named"],
  [/mindset|grind|hustle|4 ?am|5 ?am|discipline|no days off/i, "Hustle-speak"],
  [/dm me|dm ['"“]|link in bio|students|mentor|course|coaching/i, "Selling something on the side"],
  [/dubai|private jet|lambo|rolex|penthouse/i, "Luxury name-drops"],
  [/trader|crypto|forex|funded|passive income/i, "The 'I trade' claim"],
  [/stealth|pending|soon|upcoming|ex-/i, "Achievements that have not happened yet"],
];
export function localScore(t) {
  const tells = FLAGS.filter((f) => f[0].test(t)).map((f) => f[1]);
  const emoji = (t.match(/\p{Extended_Pictographic}/gu) || []).length;
  if (emoji >= 3) tells.push("Emoji doing the heavy lifting");
  if ((t.match(/\|/g) || []).length >= 3) tells.push("Title | Title | Title formatting");
  const score = Math.max(3, Math.min(99, 8 + tells.length * 13 + Math.min(emoji, 5) * 2));
  const legit = /\b(work in|student|studying|part time|badly|mostly|just)\b/i.test(t)
    ? ["You admitted to something ordinary", "No numbers to fact-check"]
    : ["You do own a phone", "The emojis are real"];
  const tier = TIERS.find((x) => score < x[0]);
  return { score, verdict: tier[1], roast: tier[2], tells: tells.slice(0, 4), legit };
}
export const tone = (s) => (s < 35 ? "real" : s < 65 ? "mid" : "cap");

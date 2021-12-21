const fs = require("fs");
const papa = require("papaparse");
const file = fs.createReadStream("./answers.csv");
let count = 0; // cache the running count

const entries = new Map([]);
const pickedNumbers = new Set([]);
const pickAgainPeople = new Set([]);

const MAX = 1000;
const availableNumbersMap = getAvailableNumbersMap();

function getAvailableNumbersMap() {
  const numMap = new Map([]);
  for (let i = 1; i <= MAX; i++) {
    numMap.set(i, true);
  }
  return numMap;
}

papa.parse(file, {
  worker: true,
  step: function (result) {
    if (result.data.length) {
      const [user, entry] = result.data;

      if (user === "user") return; // skip first row of csv
      count++;

      const cleanEntry = +entry.replace(/[^\d]/, "");

      // if clean
      if (!Number.isNaN(cleanEntry)) {
        if (entries.has(user)) {
          // don't count additional entries
          return;
        }

        // if number is already taken
        if (pickedNumbers.has(cleanEntry)) {
          pickAgainPeople.add(user);
        } else {
          pickedNumbers.add(cleanEntry);
          availableNumbersMap.delete(cleanEntry);
          entries.set(user, cleanEntry);
        }
      } else {
        pickAgainPeople.add(user);
      }
    }
  },
  complete: function (_, file) {
    console.log(process.argv);
    console.log("The numbers that are left!:\n", JSON.stringify(Array.from(availableNumbersMap.keys())));
    console.log("Gold Belly gift card entries...\n");
    const results = new Map([...entries.entries()].sort(([userA, a], [userB, b]) => a - b));
    console.log(results);
    console.log("People that need to pick again:\n", pickAgainPeople);
    console.log("parsing complete read", count - 1, "records.");
    console.log("END...");
  },
});

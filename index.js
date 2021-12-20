const fs = require("fs");
const papa = require("papaparse");
const file = fs.createReadStream("./answers.csv");
var count = 0; // cache the running count

const entries = new Map([]);
const pickedNumbers = new Set([]);
const pickAgainPeople = new Set([]);

papa.parse(file, {
  worker: true,
  step: function (result) {
    if (result.data.length) {
      count++;
      const [user, entry] = result.data;

      if (user === "user") return; // skip first row of csv

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
          entries.set(user, cleanEntry);
        }
      } else {
        pickAgainPeople.add(user);
      }
    }
  },
  complete: function (results, file) {
    console.log("parsing complete read", count - 1, "records.");
    console.log("Gold Belly gift card entries...\n", entries);
    console.log("People that need to pick again:\n", pickAgainPeople);
  },
});

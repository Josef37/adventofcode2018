// Step 1: Sort input by datetime
// Step 2: Find id, then count minutes
// Step 3: Find guard with most minutes asleep
// Step 4: Find minute he was asleep most often
// Step 5: Return id*minute

const fs = require("fs");

function q1() {
  fs.readFile(__dirname + "/input", { encoding: "utf8" }, (err, data) => {
    if (err) throw err;
    const records = data.split("\n"); // Removed trailing newline
    records.sort();
    const asleep = new Map();
    let currentId;
    let asleepTimestamp;
    for (const record of records) {
      if (record.includes("Guard")) {
        currentId = Number(/(?<=#)\d*/.exec(record)[0]);
        if (!asleep.has(currentId)) asleep.set(currentId, Array(60).fill(0));
      } else if (record.includes("falls asleep")) {
        asleepTimestamp = Number(/\d*(?=])/.exec(record)[0]);
      } else if (record.includes("wakes up")) {
        let wakeupTimestamp = Number(/\d*(?=])/.exec(record)[0]);
        let minutes = asleep.get(currentId);
        for (let minute = asleepTimestamp; minute < wakeupTimestamp; minute++) {
          minutes[minute]++;
        }
        asleep.set(currentId, minutes);
      }
    }
    let maxMinutes = -Infinity,
      mostAsleepId;
    asleep.forEach((minutes, id) => {
      let asleepSum = minutes.reduce((acc, cur) => acc + cur);
      if (asleepSum > maxMinutes) {
        mostAsleepId = id;
        maxMinutes = asleepSum;
      }
    });
    let mostAsleepSchedule = asleep.get(mostAsleepId);
    let minute = mostAsleepSchedule.indexOf(Math.max(...mostAsleepSchedule));
    console.log(minute * mostAsleepId);
  });
}

function q2() {
  fs.readFile(__dirname + "/input", { encoding: "utf8" }, (err, data) => {
    if (err) throw err;
    const records = data.split("\n"); // Removed trailing newline
    records.sort();
    const asleep = new Map();
    let currentId;
    let asleepTimestamp;
    for (const record of records) {
      if (record.includes("Guard")) {
        currentId = Number(/(?<=#)\d*/.exec(record)[0]);
        if (!asleep.has(currentId)) asleep.set(currentId, Array(60).fill(0));
      } else if (record.includes("falls asleep")) {
        asleepTimestamp = Number(/\d*(?=])/.exec(record)[0]);
      } else if (record.includes("wakes up")) {
        let wakeupTimestamp = Number(/\d*(?=])/.exec(record)[0]);
        let minutes = asleep.get(currentId);
        for (let minute = asleepTimestamp; minute < wakeupTimestamp; minute++) {
          minutes[minute]++;
        }
        asleep.set(currentId, minutes);
      }
    }
    let maxTimesAsleep = -Infinity,
      mostAsleepId;
    asleep.forEach((minutes, id) => {
      const asleepSum = Math.max(...minutes);
      if (asleepSum > maxTimesAsleep) {
        mostAsleepId = id;
        maxTimesAsleep = asleepSum;
      }
    });
    let mostAsleepSchedule = asleep.get(mostAsleepId);
    let minute = mostAsleepSchedule.indexOf(maxTimesAsleep);
    console.log(minute * mostAsleepId);
  });
}

// q1();
q2();

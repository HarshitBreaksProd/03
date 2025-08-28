// Import necessary Node.js modules.
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Dynamically import node-fetch, which is an ESM module.
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const API_URL = "https://100x-server-production.up.railway.app/submit/checksum";

/**
 * =============================================================================
 * MAIN LOGIC
 * This is the entry point. It reads the checksum file, creates workers,
 * and manages the overall process.
 * =============================================================================
 */
const main = async () => {
  // --- Configuration ---
  const reportPath = await askQuestion(
    "Enter the full path to the checksum report file (e.g., ./checksum_report.txt): "
  );
  const failedLogPath = path.join(path.dirname(reportPath), "failed.txt");
  const failedStream = fs.createWriteStream(failedLogPath, {
    flags: "a",
  });

  console.log(`Reading checksums from: '${reportPath}'...`);
  console.log(`Failed checksums will be logged to: '${failedLogPath}'`);

  // --- File Reading and Parsing ---
  const checksums = await parseChecksumFile(reportPath);
  const totalChecksums = checksums.length;

  if (totalChecksums === 0) {
    console.log("No checksums found in the specified file.");
    return;
  }

  console.log(`Found ${totalChecksums} checksums to process.`);
  console.log(`Starting search...`);

  let processedCount = 0;
  let matchFound = false;

  console.time("Total Execution Time");

  for (const checksum of checksums) {
    if (matchFound) break;

    const response1 = await submitChecksum(checksum);

    if (!response1) {
      // Log only on network/server error for the first request
      failedStream.write(`${checksum}\n`);
      processedCount++;
      updateProgress(processedCount, totalChecksums);
      continue;
    }

    const response2 = await submitChecksum(checksum);

    if (!response2) {
      // Log only on network/server error for the second request
      failedStream.write(`${checksum}\n`);
      processedCount++;
      updateProgress(processedCount, totalChecksums);
      continue;
    }

    // Check for a match. Missing keys or mismatched keys are now considered normal.
    if (response1.key && response2.key && response1.key === response2.key) {
      matchFound = true;
      console.timeEnd("Total Execution Time");
      process.stdout.write("\n"); // New line after progress bar.
      console.log("🎉 Match Found! 🎉");
      console.log("------------------------------------");
      console.log(`Checksum: ${checksum}`);
      console.log(`Result: ${JSON.stringify(response1)}`);
      console.log("------------------------------------");
      failedStream.end();
      process.exit(0);
    } else {
      // Not a match, but not a network failure. Just update progress.
      processedCount++;
      updateProgress(processedCount, totalChecksums);
    }
  }

  if (!matchFound) {
    console.timeEnd("Total Execution Time");
    process.stdout.write("\n");
    console.log("Search complete. No matching key was found.");
    failedStream.end();
    process.exit(0);
  }
};

function updateProgress(processed, total) {
  const percentage = ((processed / total) * 100).toFixed(2);
  process.stdout.write(
    `\rProgress: ${processed}/${total} checksums checked (${percentage}%)`
  );
}

/**
 * Sends a single checksum to the server.
 * @param {string} checksum - The SHA-256 checksum to send.
 * @returns {Promise<object|null>} The JSON response from the server or null on error.
 */
const submitChecksum = async (checksum) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checksum,
      }),
    });
    if (!response.ok) {
      // Log server errors but continue processing.
      console.error(
        `\nReceived non-OK status ${response.status} for checksum ${checksum}`
      );
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(
      `\nEncountered a network error for checksum ${checksum}:`,
      error
    );
    return null;
  }
};

/**
 * Reads the checksum report file line by line.
 * @param {string} filePath - The path to the checksum file.
 * @returns {Promise<string[]>} A promise that resolves with an array of checksums.
 */
function parseChecksumFile(filePath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject(new Error(`File not found: ${filePath}`));
    }
    const checksums = [];
    const stream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      const parts = line.split(",");
      // Assumes format is "filepath,checksum" and takes the second part.
      if (parts.length === 2 && parts[1]) {
        checksums.push(parts[1].trim());
      }
    });

    rl.on("close", () => resolve(checksums));
    rl.on("error", reject);
  });
}

/**
 * Prompts the user for input in the console.
 */
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

main().catch((err) => {
  console.error("\nAn error occurred in the main process:", err);
});

const fs = require("fs").promises;
const fss = require("fs");
const path = require("path");
const crypto = require("crypto");
const readline = require("readline");

/**
 * =============================================================================
 * MAIN THREAD LOGIC
 * This is the entry point of the script. It discovers files, creates workers,
 * distributes the workload, and aggregates the results.
 * =============================================================================
 */
const main = async () => {
  // --- Configuration ---
  const folderPath = await askQuestion(
    "Enter the full path to the folder of generated files (e.g., ./generated): "
  );
  const outputFile = "checksum_report.txt";

  // --- Path Validation ---
  try {
    const stats = await fs.stat(folderPath);
    if (!stats.isDirectory()) {
      console.error(
        `Error: The path '${folderPath}' is not a valid directory.`
      );
      return;
    }
  } catch (error) {
    console.error(
      `Error: The path '${folderPath}' does not exist or is inaccessible.`
    );
    return;
  }

  console.log(`Scanning folder: '${folderPath}'...`);

  // --- File Discovery ---
  // Read all entries in the directory.
  const allEntries = await fs.readdir(folderPath);
  const filesToProcess = [];
  // Iterate over each entry to check if it's a file before adding it to the list.
  // This prevents errors from trying to create read streams for directories.
  for (const entry of allEntries) {
    const fullPath = path.join(folderPath, entry);
    try {
      const stats = await fs.stat(fullPath);
      if (stats.isFile()) {
        filesToProcess.push(fullPath);
      }
    } catch (err) {
      console.error(`Could not stat file ${fullPath}: ${err}`);
    }
  }

  const fileCount = filesToProcess.length;

  if (fileCount === 0) {
    console.log("No files found in the specified directory.");
    return;
  }

  console.log(`Found ${fileCount} files to process.`);
  console.log(`Generating checksums...`);

  // --- Worker Creation and Workload Distribution ---
  let processedCount = 0;
  const outputStream = fss.createWriteStream(outputFile);

  console.time("Total Execution Time"); // Start a timer

  for (const filePath of filesToProcess) {
    const checksum = await calculateChecksum(filePath);
    if (checksum) {
      outputStream.write(`${filePath},${checksum}\n`);
    }
    processedCount++;
    // Update progress on the same line.
    process.stdout.write(
      `\rProgress: ${processedCount}/${fileCount} files processed...`
    );
  }

  outputStream.end();
  process.stdout.write("\n"); // Move to the next line after progress bar
  console.log("Checksum generation complete!");
  console.log(`Results have been saved to '${outputFile}'`);
  console.timeEnd("Total Execution Time"); // End timer and print duration
};

/**
 * Calculates the SHA-256 checksum for a single file.
 * @param {string} filePath - The full path to the file.
 * @returns {Promise<string|null>} A promise that resolves with the checksum, or null on error.
 */
const calculateChecksum = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fss.createReadStream(filePath);

    stream.on("data", (data) => {
      hash.update(data);
    });

    stream.on("end", () => {
      resolve(hash.digest("hex"));
    });

    stream.on("error", (err) => {
      // If an error occurs (e.g., file not readable), reject the promise.
      console.error(`Error reading file ${filePath}:`, err);
      resolve(null); // Resolve with null to signal failure for this file.
    });
  });
};

/**
 * Prompts the user for input in the console.
 * @param {string} query - The question to ask the user.
 * @returns {Promise<string>} The user's answer.
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

main().catch(console.error);

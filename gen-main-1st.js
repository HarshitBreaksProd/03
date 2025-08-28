#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const readline = require("readline");

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const [key, val] = arg.includes("=") ? arg.split("=") : [arg, argv[++i]];
    const k = key.replace(/^--/, "");
    args[k] = val === undefined ? true : val;
  }
  return args;
}

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, {
      recursive: true,
    });
  }
}

function replaceBlanksInTemplate(template, values) {
  const startMarker = "const blanks = [";
  const endMarker = "];";

  const startIndex = template.indexOf(startMarker);
  const endIndex = template.indexOf(endMarker, startIndex);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error("Could not find `blanks` array in template.");
  }

  const prefix = template.substring(0, startIndex + startMarker.length);
  const suffix = template.substring(endIndex);
  const blanksSection = template.substring(
    startIndex + startMarker.length,
    endIndex
  );

  let valueIndex = 0;
  const newBlanksSection = blanksSection.replace(/_/g, () => {
    if (valueIndex < values.length) {
      return values[valueIndex++];
    }
    return "_";
  });

  return `${prefix}${newBlanksSection}${suffix}`;
}

function processLine(line, lineIndex, templateContent, outDir) {
  try {
    const parts = line.split(",").map((p) => p.trim());
    if (parts.length === 0 || parts[0] === "") {
      return;
    }
    if (parts.length !== 15) {
      throw new Error(
        `Invalid CSV: row ${lineIndex + 1} has ${
          parts.length
        } columns, expected 15`
      );
    }

    const values = [];
    for (const part of parts) {
      for (let i = 0; i < 5; i++) {
        values.push(part);
      }
    }

    values[11] = 2;
    values[26] = 2;
    values[41] = 2;
    values[56] = 2;
    values[71] = 2;

    values[75] = "Math.abs";

    const newContent = replaceBlanksInTemplate(templateContent, values);

    const outPath = path.join(outDir, `the-blank-check-${lineIndex + 1}.js`);
    fs.writeFileSync(outPath, newContent, "utf8");
  } catch (error) {
    console.error(`Error processing line ${lineIndex + 1}: ${error.message}`);
  }
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

async function main() {
  const args = parseArgs(process.argv);
  const csvPathInput =
    args.input ||
    (await askQuestion(
      "Enter the path to the CSV file (e.g., ./output_chunks/all_unique_arrays_1.csv): "
    ));
  const csvPath = path.resolve(csvPathInput);
  const templatePath = path.resolve(args.template || "the-blank-check.js");
  const outDir = path.resolve(
    args.out || args.output || path.join(process.cwd(), "generated")
  );

  if (!fs.existsSync(csvPath) || !fs.statSync(csvPath).isFile()) {
    console.error(
      `Error: The path '${csvPath}' is not a valid file or is inaccessible.`
    );
    process.exit(1);
  }

  if (!fs.existsSync(templatePath)) {
    console.error(`Template not found: ${templatePath}`);
    process.exit(1);
  }

  const templateContent = fs.readFileSync(templatePath, "utf8");
  ensureDirSync(outDir);

  let totalLinesProcessed = 0;
  console.time("Total execution time");

  console.log(`Processing ${csvPath}...`);
  const rl = readline.createInterface({
    input: fs.createReadStream(csvPath, {
      encoding: "utf8",
    }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const trimmed = line.trim();
    if (trimmed.length > 0) {
      processLine(line, totalLinesProcessed, templateContent, outDir);
    }
    totalLinesProcessed++;
  }

  console.timeEnd("Total execution time");
  console.log(`\nProcessed ${totalLinesProcessed} lines in total.`);
  console.log(`Generated files are in: ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

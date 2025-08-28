# Challenge: The Blank Check

This challenge will test your understanding of basic data structures and algorithms. Your goal is to determine the correct checksum by filling in the blanks in a JavaScript file.

## Instructions

1.  **Navigate to the `the-blank-check.js` file**: Open the [`the-blank-check.js`](./the-blank-check.js) file located in this directory.

2.  **Fill in the Blanks**: Inside `the-blank-check.js`, you'll find a `blanks` array containing placeholder `_` values. Your task is to replace these placeholders with the correct values.

    -   **Important**: Be careful to only replace the `_` characters. Do not modify any other part of the file, including whitespace, as this will alter the final checksum.

3.  **Calculate the Checksum**: Once you've filled in the `blanks` array, save the `the-blank-check.js` file. The checksum is the SHA256 hash of the entire `the-blank-check.js` file. You can compute it using the following command:

    ```bash
    sha256sum the-blank-check.js
    ```

4.  **Submit Your Solution**: With the checksum calculated, use the `curl` command below to submit your answer. Replace `<checksum>` with the hash you generated.

## Submission

```bash
curl --location 'https://100x-server-production.up.railway.app/submit/checksum'
--header 'Content-Type: application/json'
--data '{
    "checksum": "<checksum>"
}'
```

## Hint

-   Most of the values in the `blanks` array are derived from the initial array `[a, b, c, d, e, f]`.
-   Look for patterns in the code to understand how the `blanks` array can be populated.

Good luck, and may your code be bug-free!

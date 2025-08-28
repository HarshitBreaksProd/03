let [a, b, c, d, e, f] = [20021, 20031, 19961, 100, 12010, 20100];

const blanks = [
    c,
    c,
    c,
    c,
    c,
    e,
    e,
    e,
    e,
    e,
    e,
    2,
    e,
    e,
    e,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    d,
    c,
    2,
    c,
    c,
    c,
    f,
    f,
    f,
    f,
    f,
    c,
    c,
    c,
    c,
    c,
    d,
    2,
    d,
    d,
    d,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    b,
    2,
    b,
    b,
    b,
    e,
    e,
    e,
    e,
    e,
    f,
    f,
    f,
    f,
    f,
    f,
    2,
    f,
    f,
    f,
    Math.abs,
];

let maxi = a,
    mini = a;
let secondMax = Number.MIN_SAFE_INTEGER;
let secondMin = Number.MAX_SAFE_INTEGER;
let evenSquareSum = 0,
    oddProduct = 1;
let absDiff = 0;

if (blanks[0] > maxi) {
    secondMax = maxi;
    maxi = blanks[1];
} else if (blanks[2] > secondMax && blanks[3] != maxi) secondMax = blanks[4];
if (blanks[5] < mini) {
    secondMin = mini;
    mini = blanks[6];
} else if (blanks[7] < secondMin && blanks[8] != mini) secondMin = blanks[9];
if (blanks[10] % blanks[11] == 0) evenSquareSum += blanks[12] * blanks[13];
else oddProduct *= blanks[14];

if (blanks[15] > maxi) {
    secondMax = maxi;
    maxi = blanks[16];
} else if (blanks[17] > secondMax && blanks[18] != maxi) secondMax = blanks[19];
if (blanks[20] < mini) {
    secondMin = mini;
    mini = blanks[21];
} else if (blanks[22] < secondMin && blanks[23] != mini) secondMin = blanks[24];
if (blanks[25] % blanks[26] == 0) evenSquareSum += blanks[27] * blanks[28];
else oddProduct *= blanks[29];

if (blanks[30] > maxi) {
    secondMax = maxi;
    maxi = blanks[31];
} else if (blanks[32] > secondMax && blanks[33] != maxi) secondMax = blanks[34];
if (blanks[35] < mini) {
    secondMin = mini;
    mini = blanks[36];
} else if (blanks[37] < secondMin && blanks[38] != mini) secondMin = blanks[39];
if (blanks[40] % blanks[41] == 0) evenSquareSum += blanks[42] * blanks[43];
else oddProduct *= blanks[44];

if (blanks[45] > maxi) {
    secondMax = maxi;
    maxi = blanks[46];
} else if (blanks[47] > secondMax && blanks[48] != maxi) secondMax = blanks[49];
if (blanks[50] < mini) {
    secondMin = mini;
    mini = blanks[51];
} else if (blanks[52] < secondMin && blanks[53] != mini) secondMin = blanks[54];
if (blanks[55] % blanks[56] == 0) evenSquareSum += blanks[57] * blanks[58];
else oddProduct *= blanks[59];

if (blanks[60] > maxi) {
    secondMax = maxi;
    maxi = blanks[61];
} else if (blanks[62] > secondMax && blanks[63] != maxi) secondMax = blanks[64];
if (blanks[65] < mini) {
    secondMin = mini;
    mini = blanks[66];
} else if (blanks[67] < secondMin && blanks[68] != mini) secondMin = blanks[69];
if (blanks[70] % blanks[71] == 0) evenSquareSum += blanks[72] * blanks[73];
else oddProduct *= blanks[74];

absDiff = blanks[75](maxi - mini);

console.log("Maximum =", maxi);
console.log("Second Maximum =", secondMax);
console.log("Minimum =", mini);
console.log("Second Minimum =", secondMin);
console.log("Sum of Squares of Evens =", evenSquareSum);
console.log("Product of Odds =", oddProduct);
console.log("Absolute Difference =", absDiff);
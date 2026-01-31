const fs = require('fs');
const readline = require('readline');


const MAX_CODE_LENGTH = 5;
const ALPHABET_SIZE = 26;
let TOTAL_CODES = 0;
const OFFSETS = [0]; // array to store the starting index for each length

for (let len = 1; len <= MAX_CODE_LENGTH; len++) {
    const count = Math.pow(ALPHABET_SIZE, len);
    TOTAL_CODES += count;
    if (len < MAX_CODE_LENGTH) {
        OFFSETS.push(TOTAL_CODES);
    }
}

// array to store the bits for each file
const campaignBits = new Uint8Array(Math.ceil(TOTAL_CODES / 8));
const membershipBits = new Uint8Array(Math.ceil(TOTAL_CODES / 8));

//function to translate code to index
function getCodeIndex(code) {
    const len = code.length;
    if (len === 0 || len > MAX_CODE_LENGTH) return -1;

    let baseIndex = 0;
    for (let i = 0; i < len; i++) {
        const val = code.charCodeAt(i) - 97; // 'a' -> 0
        if (val < 0 || val >= 26) return -1;
        baseIndex = baseIndex * 26 + val;
    }
    return OFFSETS[len - 1] + baseIndex; 
    // example: for "aa", len=2, baseIndex=0, OFFSETS[1]=26, return 26
    // example: for "ab", len=2, baseIndex=1, OFFSETS[1]=26, return 27
    //example: for "aaaaa", len = 5, baseIndex = 26^4 * 0 + 26^3 * 0 + 26^2 * 0 + 26^1 * 0 + 26^0 * 0 = 0
    // OFFSETS[4] = 26 + 26^2 + 26^3 + 26^4 = 26 + 676 + 17576 + 456976 = 475254
    // return 475254 + 0 = 475254
}

// function to mark the code in the bitset
function markCode(bitSet, code) {
    const index = getCodeIndex(code);
    if (index !== -1) {
        bitSet[Math.floor(index / 8)] |= (1 << (index % 8));
    }
}

// function to check if the code is present in the bitset
function checkCode(bitSet, code) {
    const index = getCodeIndex(code);
    if (index === -1) return false;
    return (bitSet[Math.floor(index / 8)] & (1 << (index % 8))) !== 0;
}

// function to check if the format of the code is valid
function isFormatValid(code) {
    if (!code || code.length > MAX_CODE_LENGTH) return false;
    for (let i = 0; i < code.length; i++) {
        const charCode = code.charCodeAt(i);
        if (charCode < 97 || charCode > 122) return false; // Not a-z
    }
    return true;
}

// function to check if the code is valid
function isValid(code) {
    if (!isFormatValid(code)) {
        return false;
    }; // Invalid format
    return checkCode(campaignBits, code) && checkCode(membershipBits, code);
}

// function to process the file and mark the codes in the bitset
async function processFile(filePath, targetBitSet) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    for await (const line of rl) {
        const code = line.trim();
        if (code) markCode(targetBitSet, code);
    }
}

async function main() {

    const campaignFile = 'src/campaign_codes.txt';
    const membershipFile = 'src/membership_codes.txt';

    if (!fs.existsSync(campaignFile) || !fs.existsSync(membershipFile)) {
        console.error("Error: Input files not found.");
        return;
    }


    // 
    const p1 = processFile(campaignFile, campaignBits);
    const p2 = processFile(membershipFile, membershipBits);
    await Promise.all([p1, p2]);
    
   
    const inputCode = "hello"; 
    const result = isValid(inputCode);
    
    
    console.log(result);
}

if (require.main === module) {
    main().catch(console.error);
}

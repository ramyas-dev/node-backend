import fs from "fs";
import { parse } from "csv-parse/sync";

const sampleData = fs.readFileSync("./sample_users.csv", "utf8");
const records = parse(sampleData, { columns: true });

// Generate 1,00,000 rows
const totalRows = 100000;
let output = "name,email,age\n";

for (let i = 0; i < totalRows; i++) {
  const user = records[i % records.length];
  output += `${user.name}_${i},${user.email.replace("@", `.${i}@`)},${user.age}\n`;
}

// Step Write to new CSV
fs.writeFileSync("users_100k.csv", output);

console.log("✅ Generated users_100k.csv with 1,00,000 records");

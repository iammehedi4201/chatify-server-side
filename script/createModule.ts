import fs from "fs";
import path from "path";

// Define the structure of the files to create
const files: string[] = [
  ".constant.ts",
  ".controller.ts",
  ".interface.ts",
  ".model.ts",
  ".route.ts",
  ".service.ts",
  ".validation.ts",
  ".utils.ts",
];

// Base directory (where your modules live)
const baseDir = path.join(process.cwd(), "src", "modules");

// Capitalize the first letter of a string
const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

// Function to create a module folder and its files
const createModule = (moduleName: string): void => {
  const name = capitalize(moduleName);
  const modulePath = path.join(baseDir, name);

  // Check if the module already exists
  if (fs.existsSync(modulePath)) {
    console.log(`⚠️  Module "${name}" already exists. Skipping...`);
    return;
  }

  // Create the folder
  fs.mkdirSync(modulePath, { recursive: true });
  console.log(`📁 Created folder: ${modulePath}`);

  // Create all files
  files.forEach((file) => {
    const filePath = path.join(modulePath, `${name}${file}`);
    const content = `// ${name}${file.replace(".", " ")}\n// Created automatically\n\n`;
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`  ✅ Created file: ${filePath}`);
  });

  console.log(`🎉 Module "${name}" created successfully!\n`);
};

// --- Entry point ---
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("⚠️  Please provide at least one module name.");
  console.error("💡 Example: ts-node createModule.ts User");
  process.exit(1);
}

// Create one or multiple modules
args.forEach(createModule);

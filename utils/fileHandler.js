const fs = require("fs/promises");
const path = require("path");

const studentPath = path.join(__dirname, "students.json");
const teacherPath = path.join(__dirname, "teachers.json");

const getFilePath = (filename) => {
  return path.join(__dirname, "../data", filename);
};

const readFile = async (fileName) => {
  try {
    const filePath = getFilePath(fileName);
    const data = await fs.readFile(filePath, "utf-8");
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error("Couldnt Read file: " + error);
  }
};

const writeFile = async (fileName, data) => {
  try {
    const filePath = getFilePath(fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Could not write to file:" + error);
  }
};

module.exports = {
  readFile,
  writeFile,
};

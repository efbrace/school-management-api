const { Router } = require("express");
const router = Router();
const { readFile, writeFile } = require("../utils/fileHandler");
const { v4: uuid4 } = require("uuid");

// GETING ALL STUDENTS
router.get("/students", async (req, res) => {
  const studentData = await readFile("students.json");
  res.json(studentData);
});

// GETTING A SINGLE STUDENT
router.get("/students/:id", async (req, res) => {
  const id = req.params.id;
  const students = await readFile("students.json");
  const matchStudent = students.find((stud) => {
    return stud.id === id;
  });
  res.json(matchStudent);
});

// ADD A SINGLE STUDENT
router.post("/students", async (req, res) => {
  const { name, age, grade } = req.body;
  const students = await readFile("students.json");

  //   VALIDATION
  if (!name || !age || !grade) {
    res.json({
      message: "All fields are required!",
    });
    return;
  }
  const newStudent = {
    id: uuid4(),
    name,
    age,
    grade,
  };

  students.push(newStudent);
  writeFile("students.json", students);
  res.json(newStudent);
});

// UPDATE A SINGLE STUDENT

router.put("/students/:id", async (req, res) => {
  const id = req.params.id;
  const { name, age, grade } = req.body;
  const students = await readFile("students.json");
  const studentIndex = students.findIndex((stud) => {
    return stud.id === id;
  });

  if (studentIndex === -1) {
    res.json({ message: "Student not Found" });
    return;
  }

  students[studentIndex] = {
    id: students[studentIndex].id,
    name: !name ? students[studentIndex].name : name,
    age: !age ? students[studentIndex].age : age,
    grade: !grade ? students[studentIndex].grade : grade,
  };

  writeFile("students.json", students);
  res.json(students[studentIndex]);
});

// DELETING A STUDENT

router.delete("/students/:id", async (req, res) => {
  const id = req.params.id;
  const students = await readFile("students.json");
  const matchStudent = students.find((stud) => {
    return stud.id === id;
  });

  if (!matchStudent) {
    res.json({
      message: "Student not found!",
    });
    return;
  }

  const newStudents = students.filter((stud) => {
    return stud.id !== id;
  });

  writeFile("students.json", newStudents);
  res.json({
    message: "Student Deleted succesfully!",
    matchStudent,
  });
});

module.exports = router;

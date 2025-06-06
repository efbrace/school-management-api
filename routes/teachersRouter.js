const { Router } = require("express");
const router = Router();
const { readFile, writeFile } = require("../utils/fileHandler");
const { v4: uuid4 } = require("uuid");

// GETING ALL TEACHERS
router.get("/teachers", async (req, res) => {
  try {
    const teachersData = await readFile("teachers.json");
    res.status(200).json(teachersData);
  } catch (error) {
    console.error(error);
  }
});

// GETTING A SINGLE TEACHER
router.get("/teachers/:id", async (req, res) => {
  const id = req.params.id;
  const teachers = await readFile("teachers.json");
  const matchTeacher = teachers.find((teach) => {
    return teach.id === id;
  });
  res.status(200).json(matchTeacher);
});

// ADD A SINGLE TEACHER
router.post("/teachers", async (req, res) => {
  const { name, age, subject } = req.body;
  const teachers = await readFile("teachers.json");

  //   VALIDATION
  if (!name || !age || !subject) {
    res.status(400).json({
      message: "All fields are required!",
    });
    return;
  }
  const newTeacher = {
    id: uuid4(),
    name,
    age,
    subject,
  };

  teachers.push(newTeacher);
  writeFile("teachers.json", teachers);
  res.status(201).json(newTeacher);
});

// UPDATE A SINGLE TEACHER

router.put("/teachers/:id", async (req, res) => {
  const id = req.params.id;
  const { name, age, subject } = req.body;
  const teachers = await readFile("teachers.json");
  const teacherIndex = teachers.findIndex((teach) => {
    return teach.id === id;
  });

  if (teacherIndex === -1) {
    res.status(204).json({ message: "Teacher not Found" });
    return;
  }

  teachers[teacherIndex] = {
    id: teachers[teacherIndex].id,
    name: !name ? teachers[teacherIndex].name : name,
    age: !age ? teachers[teacherIndex].age : age,
    subject: !subject ? teachers[teacherIndex].subject : subject,
  };

  writeFile("teachers.json", teachers);
  res.status(201).json(teachers[teacherIndex]);
});

// DELETING A TEACHER

router.delete("/teachers/:id", async (req, res) => {
  const id = req.params.id;
  const teachers = await readFile("teachers.json");
  const matchTeacher = teachers.find((teach) => {
    return teach.id === id;
  });

  if (!matchTeacher) {
    res.status(204).json({
      message: "Teacher not found!",
    });
    return;
  }

  const newTeachers = teachers.filter((teach) => {
    return teach.id !== id;
  });
  writeFile("teachers.json", newTeachers);

  res.status(204).json({
    message: "Teacher Deleted succesfully!",
    matchTeacher,
  });
});

module.exports = router;

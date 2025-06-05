const { Router } = require("express");
const router = Router();
const { readFile, writeFile } = require("../utils/fileHandler");
const { v4: uuid4 } = require("uuid");

// GETING SUBJECT
router.get("/subjects", async (req, res) => {
  const subjectData = await readFile("subjects.json");
  res.status(200).json(subjectData);
});

// GETTING A SINGLE SUBJECT
router.get("/subjects/:id", async (req, res) => {
  const id = req.params.id;
  const subjects = await readFile("subjects.json");
  const matchSubjects = subjects.find((teach) => {
    return teach.id === id;
  });
  res.status(200).json(matchSubjects);
});

// ADD A SINGLE SUBJECT
router.post("/subjects", async (req, res) => {
  const { name, teacher, credits } = req.body;
  const subjects = await readFile("subjects.json");

  //   VALIDATION
  if (!name || !teacher || !credits) {
    res.status(400).json({
      message: "All fields are required!",
    });
    return;
  }
  const newSubject = {
    id: uuid4(),
    name,
    teacher,
    credits,
  };

  subjects.push(newSubject);
  writeFile("subjects.json", subjects);
  res.status(201).json(newSubject);
});

// UPDATE A SUBJECT

router.put("/subjects/:id", async (req, res) => {
  const id = req.params.id;
  const { name, teacher, credits } = req.body;
  const subjects = await readFile("subjects.json");
  const subjectIndex = subjects.findIndex((sub) => {
    return sub.id === id;
  });

  if (subjectIndex === -1) {
    res.status(204).json({ message: "Subject not Found" });
    return;
  }

  subjects[subjectIndex] = {
    id: subjects[subjectIndex].id,
    name: !name ? subjects[subjectIndex].name : name,
    teacher: !teacher ? [subjectIndex].teacher : teacher,
    credits: !credits ? subjects[subjectIndex].credits : credits,
  };

  writeFile("subjects.json", subjects);
  res.status(201).json(subjects[subjectIndex]);
});

// DELETING A SUBJECT

router.delete("/subjects/:id", async (req, res) => {
  const id = req.params.id;
  const subjects = await readFile("subjects.json");
  const matchSubject = subjects.find((sub) => {
    return sub.id === id;
  });

  if (!matchSubject) {
    res.status(204).json({
      message: "Subject not found!",
    });
    return;
  }

  const newSubject = subjects.filter((sub) => {
    return sub.id !== id;
  });

  writeFile("subjects.json", newSubject);
  res.json({
    message: "Subject Deleted succesfully!",
    matchSubject,
  });
});

module.exports = router;

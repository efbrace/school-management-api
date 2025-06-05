const { Router } = require("express");
const router = Router();
const { readFile, writeFile } = require("../utils/fileHandler");
const { v4: uuid4 } = require("uuid");

// GETING CLASS
router.get("/classes", async (req, res) => {
  const classData = await readFile("classes.json");
  res.status(200).json(classData);
});

// GETTING A SINGLE CLASS
router.get("/classes/:id", async (req, res) => {
  const id = req.params.id;
  const classes = await readFile("classes.json");
  const matchClass = classes.find((teach) => {
    return teach.id === id;
  });
  res.status(200).json(matchClass);
});

// ADD A SINGLE CLASS
router.post("/classes", async (req, res) => {
  const { name, numberOfStudents, subject } = req.body;
  const classes = await readFile("classes.json");

  //   VALIDATION
  if (!name || !numberOfStudents || !subject) {
    res.status(400).json({
      message: "All fields are required!",
    });
    return;
  }
  const newClass = {
    id: uuid4(),
    name,
    numberOfStudents,
    subject,
  };

  classes.push(newClass);
  writeFile("classes.json", classes);
  res.status(201).json(newClass);
});

// UPDATE A CLASS

router.put("/classes/:id", async (req, res) => {
  const id = req.params.id;
  const { name, numberOfStudents, subject } = req.body;
  const classes = await readFile("classes.json");
  const classIndex = classes.findIndex((clas) => {
    return clas.id === id;
  });

  if (classIndex === -1) {
    res.status(204).json({ message: "Class not Found" });
    return;
  }

  classes[classIndex] = {
    id: classes[classIndex].id,
    name: !name ? classes[classIndex].name : name,
    numberOfStudents: !numberOfStudents
      ? [classIndex].numberOfStudents
      : numberOfStudents,
    subject: !subject ? classes[classIndex].subject : subject,
  };

  writeFile("classes.json", classes);
  res.status(201).json(classes[classIndex]);
});

// DELETING A CLASS

router.delete("/classes/:id", async (req, res) => {
  const id = req.params.id;
  const classes = await readFile("classes.json");
  const matchClass = classes.find((clas) => {
    return clas.id === id;
  });

  if (!matchClass) {
    res.status(204).json({
      message: "Class not found!",
    });
    return;
  }

  const newClass = classes.filter((clas) => {
    return clas.id !== id;
  });

  writeFile("classes.json", newClass);
  res.json({
    message: "Class Deleted succesfully!",
    matchClass,
  });
});

module.exports = router;

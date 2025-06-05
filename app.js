const express = require("express");
const app = express();
const studentsRoutes = require("./routes/studentsRouter");
const teachersRoutes = require("./routes/teachersRouter");
const classesRoutes = require("./routes/classRoute");
const subjectRoutes = require("./routes/subjectsRoute");

app.use(express.json());
app.use("/", studentsRoutes);
app.use("/", teachersRoutes);
app.use("/", classesRoutes);
app.use("/", subjectRoutes);

app.listen(6000, () => {
  console.log("App running on port 6000");
});

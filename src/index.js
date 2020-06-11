import express from "express";
import { promises } from 'fs';
import router from '../routes/lancamentos.js';
import path from 'path';

const port = 3001;
const app = express();
app.use(express.json());

const { writeFile, readFile } = promises;
app.use("/lancamentos", router);

app.listen(port, async () => {
  try {
    const initialJson = {
      nextId: 1,
      lancamentos: []
    };
    await writeFile(path.join(process.cwd(), 'json', 'lancamentos.json'), JSON.stringify(initialJson), { flag: "wx" });
  } catch (err) {
    if (err.code == 'EEXIST') {
    } else { console.log(err) };
  }
  console.log(`🔥Server started at port ${port}`);
});
import express from 'express';
const router = express.Router();
import fs from 'fs';
import path from 'path'
import moment from 'moment';

const writeFile = fs.promises.writeFile;
const readFile = fs.promises.readFile;

router.post("/receita", async (req, res) => {
  try {
    const dataJS = await readFile(path.join(process.cwd(), 'json', 'lancamentos.json'));
    const json = JSON.parse(dataJS);

    let lancamento = req.body;
    let lancamentoMount = { id: json.nextId++, ...lancamento };
    json.lancamentos.push(lancamentoMount);
    await writeFile(path.join(process.cwd(), 'json', 'lancamentos.json'), JSON.stringify(json));
    res.status(201).json(lancamentoMount)
  } catch (err) {
    console.log(err);
  }
});


router.post("/despesa", async (req, res) => {
  try {
    const dataJS = await readFile(path.join(process.cwd(), 'json', 'lancamentos.json'));
    const json = JSON.parse(dataJS);

    let lancamento = req.body;
    let lancamentoMount = { id: json.nextId++, ...lancamento };
    lancamentoMount.valor *= -1;
    json.lancamentos.push(lancamentoMount);
    await writeFile(path.join(process.cwd(), 'json', 'lancamentos.json'), JSON.stringify(json));
    res.status(201).json(lancamentoMount)
  } catch (err) {
    console.log(err);
  }
});

router.get("/", async (_, res) => {
  try {
    const dataJS = JSON.parse(await readFile(path.join(process.cwd(), 'json', 'lancamentos.json')));
    let total = dataJS.lancamentos.reduce(((acc, val) => acc += val.valor), 0);
    res.send({ value: total });
  } catch (err) {
    console.log('error to load the data.')
  }
});


router.get("/totalmes/:id", async (req, res) => {
  try {
    let id = Number(req.params.id);
    let formattedMonth = (id < 10 ? "0" : "") + id;
    const dataJS = JSON.parse(await readFile(path.join(process.cwd(), 'json', 'lancamentos.json')));
    let arraySelected = dataJS.lancamentos.map(item => { return { month: moment(item.data, "DD/MM/YY").format("MM"), valor: item.valor } }).filter(item => item.month === formattedMonth);
    let newArraySelected = arraySelected.map(item => item.valor);
    let total = newArraySelected.reduce((a, b) => { return a + b }, 0);
    res.send({ value: total });
  } catch (err) {
    console.log('error to load the data.');
  }
});


export default router;
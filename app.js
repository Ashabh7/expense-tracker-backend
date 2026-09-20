require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Expense = require("./models/Expense");

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Connection Error: ", err));

app.use(cors());
app.use(express.json());

//GET all the Expenses
app.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Post new Expense
app.post("/expenses", async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    await newExpense.save();
    res.json({ message: "Expense Added!", expense: newExpense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Delete Expense
app.delete("/expenses/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Update Expense
app.put("/expenses/:id", async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json({ message: "Expense Updated", expense: updatedExpense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get by id
app.get(`/expenses/:id`, async(req,res)=> {
  try{
    const expense = await Expense.findById(req.params.id )
    res.json(expense)
  }
  catch(err){
    res.status(500).json({message: err.message})
  }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});

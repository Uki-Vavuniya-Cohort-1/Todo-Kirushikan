const express = require("express");
const mongoose = require("mongoose");
const todoList = require("../model/Todo.model")

const app = express();
const port = 3000;
const mongo_URL = "mongodb+srv://kirushikanketheeswaran:Mi1112Mu@cluster0.hl34diu.mongodb.net/todo-work?retryWrites=true&w=majority&appName=Cluster0";

app.use(express.json());

mongoose.connect(mongo_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch((error) => {
        console.log("Connection failed!", error);
    });

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });

    app.post('/todo/createTodo', async (req, res) => {
        try {
          const requestTodoData = req.body;
          const newTodo = new todoList(requestTodoData);
          await newTodo.save();
          res.status(200).send('Todo created successfully');
        } catch (error) {
          res.status(500).json({ error: 'Todo failed to create' });
          console.log(error)
        }
      });

      app.get('/todo/read/:value', async (req, res) => {
        try {
          const value = req.params.value.trim();
          const findTodo = await todoList.findOne({ todo_id: value });
      
          if (findTodo) {
            res.json(findTodo);
          } else {
            res.status(404).json({ error: 'Todo not found' });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
      
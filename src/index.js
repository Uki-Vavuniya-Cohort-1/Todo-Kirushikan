const express = require("express");
const mongoose = require("mongoose");
const todoList = require("../model/Todo.model")
const User = require("../model/user.model")


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
      
      app.put('/todo/update/:value', async (req, res) => {
        try {
          const todo_id = req.params.value;
          const updatedTodo = req.body;
          const todo = await todoList.findOneAndUpdate({ todo_id }, updatedTodo);
          if (todo) {
            const todoupdated = await todoList.findOne({ todo_id });
            res.json(todoupdated);
          } else {
            res.status(404).json({ error: 'Todo not found' });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
       
      app.delete('/todo/delete/:value', async (req, res) => {
        try {
          const value = req.params.value;
          const deletedData = await todoList.findOneAndDelete({ todo_id: value });
          if (deletedData) {
            res.json(deletedData);
            console.log("your todo has been deleted");
          
          } else {
            res.status(404).json('Todo item not found');
          }
        } catch (error) {
          console.error("Error deleting todo item:", error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });


      app.post('/user/createUser', async (req, res) => {
        try {
            const requestUserData = req.body;
            const newUser = new User(requestUserData);
            await newUser.save();
            res.status(200).send('User created successfully');
        } catch (error) {
            res.status(500).json({ error: 'User failed to create' });
            console.log(error);
        }
    });

    app.get('/user/read/:value', async (req, res) => {
      try {
          const value = req.params.value.trim();
          const findUser = await User.findOne({ user_id: value });
  
          if (findUser) {
              res.json(findUser);
          } else {
              res.status(404).json({ error: 'User not found' });
          }
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  });
      
      app.put('/user/update/:value', async (req, res) => {
        try {
          const user_id = req.params.value;
          const updateUser = req.body;
          const user = await User.findOneAndUpdate({ user_id }, updateUser);
          if (user) {
            const userUpdated = await User.findOne({ user_id });
            res.json(userUpdated);
          } else {
            res.status(404).json({ error: 'User not found' });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
       
      app.delete('/user/delete/:value', async (req, res) => {
        try {
          const value = req.params.value;
          const deletedData = await User.findOneAndDelete({ user_id: value });
          if (deletedData) {
            res.json(deletedData);
            console.log("user has been deleted");
          
          } else {
            res.status(404).json('user is not found');
          }
        } catch (error) {
          console.error("Error deleting user", error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });


      app.get('/user/read/note/:value', async (req, res) => {
        try {
            const value = req.params.value;
            const findUser = await User.findOne({ user_id: value });
    
            if (findUser) {
                res.json(findUser.created_note);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    app.get('/user/createdby/:note', async (req, res) => {
      try {
          const note = req.params.note;
          const users = await User.find();
          let creator = null;
          for (const user of users) {
              if (user.created_note.includes(note)) {
                  creator = { user_id: user.user_id, name: user.name };
                  break; 
              }
          }
          if (creator) {
              res.json(creator);
          } else {
              res.status(404).json({ error: 'No user found for this note' });
          }
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  });
  
  app.get('/user/:user_id/todos', async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const user = await User.findOne({ _id: user_id });

        if (!user) {
            return res.status(404).send('User not found');
        }
        const todos = await todoList.find({ created_by: user._id });
        const todoTitles = todos.map(todo => todo.title);
        res.json({ user_id: user._id, todo_titles: todoTitles });
    } catch (err) {
        console.error('Error finding user or todos:', err);
        res.status(500).send('Error finding user or todos');
    }
});
  
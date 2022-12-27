const express = require('express');
const app = express();

const mongoose = require('./database/mongoose');

const TaskList = require('./database/models/taskList');
const Task = require('./database/models/task');

/*
CORS - Cross Origin Request Security
Backend - http://localhost:3000
Frontend - http://localhost:4200
*/

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'Origin', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // Pass to next layer of middleware
    next();
});

// Example of middleware
app.use(express.json()); // Or 3rd party bodyParser

// Routes or REST API Endpoints or RESTFULL webservices Endpoints
/* 
TaskList - Create, Update, ReadTaskListById, ReadAllTaskList
Task - Create, Update, ReadTaskById, ReadAllTask
*/

// Routes or API endpoints for TaskList Model
// GET All Task Lists
// http://localhost:3000/tasklist => [ {TaskList}, {TaskList} ]
app.get('/tasklists', (req, res) => {
    TaskList.find().then((lists) => {
        res.status(200).send(lists);
        
    }).catch((err) => {
        console.log(err);
    });

});

// Endpoint get one tasklist by Id
app.get('/tasklists/:Id', (req, res) => {
    let tasklistId = req.params.Id;
    TaskList.find({ _id: tasklistId }).then((lists) => {
        res.status(200).send(lists);
        
    }).catch((err) => {
        console.log(err);
    });

});


// Route or Endpoint for creating a TaskList
app.post('/tasklists', (req, res) => {
    let tasklistObj = { 'title': req.body.title } 
    TaskList.insertMany(tasklistObj).then((lists) => {
        res.status(201).send(lists);
    }).catch((err) => {
        console.log(err);
    });

});

// PUT is full update of object
app.put('/tasklists/:Id', (req, res) => {
    let tasklistId = req.params.Id;
    TaskList.findOneAndUpdate({ _id: tasklistId }, { $set: req.body }).then((lists) => {
        res.status(200).send(req.body);
    }).catch((err) => {
        console.log(err);
    });
})

// Patch is partial update of one field
app.patch('/tasklists/:Id', (req, res) => {
    let tasklistId = req.params.Id;
    TaskList.findOneAndUpdate({ _id: tasklistId }, { $set: req.body }).then((lists) => {
        res.status(200).send(req.body);
    }).catch((err) => {
        console.log(err); 
    });
})


// Delete a tasklist by ID
app.delete('/tasklists/:Id', (req, res) => {
    let tasklistId = req.params.Id;

    const deleteAllContainingTask = (taskList) => {
        Task.deleteMany({ _taskListId: tasklistId }).then(() => {
            return taskList;
        }).catch((err) => {
            console.log(err);
        });
    }

    TaskList.findByIdAndDelete(tasklistId).then((lists) => {
        deleteAllContainingTask(lists);
        res.status(200).send(lists);
    }).catch((err) => {
        console.log(err);
    });
})

// CRUD OPERATION FOR Task, a task should always belongs to a TaskList
// http:localhost:3000/tasklists/:tasklistId/tasks/:taskId
// GET ALL
app.get('/tasklists/:tasklistId/tasks', (req, res) => {
    Task.find({ _taskListId: req.params.tasklistId }).then((tasks) => {
        res.status(200).send(tasks);
    }).catch((err) => {
        console.log(err);
    });
})

// Create task inside a tasklist
app.post('/tasklists/:tasklistId/tasks', (req, res) => {
    let taskObj = { 'title': req.body.title, '_taskListId': req.params.tasklistId } 
    Task.insertMany(taskObj).then((tasks) => {
        res.status(201).send(tasks);
    }).catch((err) => {
        console.log(err);
    });

});

// Get one task
app.get('/tasklists/:tasklistId/tasks/:taskId', (req, res) => {
    Task.find({ _taskListId: req.params.tasklistId, _id: req.params.taskId }).then((tasks) => {
        res.status(200).send(tasks);
    }).catch((err) => {
        console.log(err);
    });
})

// Update task
app.put('/tasklists/:tasklistId/tasks/:taskId', (req, res) => {
    Task.findOneAndUpdate({ _taskListId: req.params.tasklistId, _id: req.params.taskId }, { $set: req.body }).then((tasks) => {
        res.status(200).send(tasks);
    }).catch((err) => {
        console.log(err);
    });
})

// Delete 1 task
app.delete('/tasklists/:tasklistId/tasks/:taskId', (req, res) => {
    Task.findByIdAndDelete({ _taskListId: req.params.tasklistId, _id: req.params.taskId }).then((tasks) => {
        res.status(200).send(tasks);
    }).catch((err) => {
        console.log(err);
    });
})


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
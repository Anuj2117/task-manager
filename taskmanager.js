const fs = require('fs');
const path = require('path');
const readline = require('readline');

const tasksFilePath = path.join(__dirname, 'tasks.json');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const loadTasks = () => {
    try {
        const data = fs.readFileSync(tasksFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT' || err instanceof SyntaxError) {
           
            return [];
        } else {
            throw err;
        }
    }
};



const saveTasks = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};


const addTask = () => {
    rl.question('Enter the task description: ', (description) => {
        const tasks = loadTasks();
        tasks.push({ description, completed: false });
        saveTasks(tasks);
        console.log('Task added successfully.');
        rl.close();
    });
};


const viewTasks = () => {
    const tasks = loadTasks();
    if (tasks.length === 0) {
        console.log('No tasks available.');
    } else {
        tasks.forEach((task, index) => {
            console.log(`${index + 1}. [${task.completed ? 'x' : ' '}] ${task.description}`);
        });
    }
    rl.close();
};

const completeTask = () => {
    const tasks = loadTasks();
    rl.question('Enter the task number to mark as complete: ', (num) => {
        const index = parseInt(num) - 1;
        if (tasks[index]) {
            tasks[index].completed = true;
            saveTasks(tasks);
            console.log('Task marked as complete.');
        } else {
            console.log('Invalid task number.');
        }
        rl.close();
    });
};

const removeTask = () => {
    const tasks = loadTasks();
    rl.question('Enter the task number to remove: ', (num) => {
        const index = parseInt(num) - 1;
        if (tasks[index]) {
            tasks.splice(index, 1);
            saveTasks(tasks);
            console.log('Task removed successfully.');
        } else {
            console.log('Invalid task number.');
        }
        rl.close();
    });
};


const showMenu = () => {
    console.log('\nTask Manager');
    console.log('1. Add a new task');
    console.log('2. View tasks');
    console.log('3. Mark a task as complete');
    console.log('4. Remove a task');
    console.log('5. Exit');
    rl.question('\nChoose an option: ', (option) => {
        switch (option) {
            case '1':
                addTask();
                break;
            case '2':
                viewTasks();
                break;
            case '3':
                completeTask();
                break;
            case '4':
                removeTask();
                break;
            case '5':
                rl.close();
                break;
            default:
                console.log('Invalid option. Please try again.');
                showMenu();
                break;
        }
    });
};

showMenu();

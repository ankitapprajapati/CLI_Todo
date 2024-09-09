const inquirer = require('inquirer').default;
const { Command } = require('commander');
const program = new Command();
const fs = require('fs')

const todoFile = 'todos.json';

function loadTodos() {
  if (!fs.existsSync(todoFile)) {
    return []; 
  }

  const todos = fs.readFileSync(todoFile, 'utf-8'); 

  if (!todos.trim()) {
    return []; 
  }

  try {
    return JSON.parse(todos);
  } 
  catch (error) {
    console.error('Error parsing JSON:', error.message);
    return []; 
  }
}

function saveTodos(todos){
  fs.writeFileSync(todoFile,JSON.stringify(todos),(err)=>{
    if(err){
      console.log(`something is not well during write in file ${err}`);
    }
    else{
      console.log(`Todo added successfully!`)
    }
  })
}

function addTodo(){
  inquirer
    .prompt([{ type:'input', name:'task' , message:'Enter your todo'  }])
    .then(ans=>{
      const todos = loadTodos();
      todos.push({task:ans.task, done:false})
      saveTodos(todos);
      console.log("Todo added succesfully");
      console.log(" ")
      menu();
    })
}

function deleteTodo(){
  let todos = loadTodos();
  if(!todos.length){
    console.log(`No todo exist`);
  }
  
  inquirer
    .prompt([{type:'input',name:'index',message:'Enter no to delete :- '}])
    .then((ans)=>{
      const index = parseInt(ans.index);
      if(index<1 || index>todos.length){
        console.log('todos you want to DELETE does not exits')
        console.log("")
        menu();
        return;
      }else{
        todos= todos.filter((_,i)=>i!==index-1)
        saveTodos(todos);
        console.log(`deleted succesfully !`)
        console.log("")
        menu();
      }
    })
}

function allTodo() {
  const todos = loadTodos();
  if(todos.length==0){
    console.log(`No todo is found `)
    console.log("")
  }else{
    todos.forEach( (todo,index) => {
      console.log(`${index+1}. ${todo.task} ${todo.done}`)
    });
    console.log("")
  }
  menu();
}

function markTodo(){
  const todos = loadTodos();
  if(todos.length==0){
    console.log(`Nothing to done`)
    console.log("")
    menu();
    return ;
  } 
  inquirer
    .prompt([{ type:'input', name:'index', message:'Enter no to mark as done todo'}])
    .then( (ans)=>{
      const index = parseInt(ans.index);
      if(index<1 || index>todos.length){
        console.log('todos you want to mark as DONE does not exits')
        console.log("")
        menu();
      }
      todos[index-1].done = !todos[index-1].done;
      saveTodos(todos)
      menu();
      return;
    })
}

function exit() {
  process.exit(0);
  console.log("")
  menu();
}

function menu(){
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What do you want:-",
        choices: ['Add a todo','Delete a todo','Mark a todo as done','List all todos',   'Exit'  ]
      }
    ])
    .then((ans)=>{
      switch (ans.action){
        case "Add a todo":
          addTodo();
          break;
        case "Delete a todo":
          deleteTodo();
          break;
        case "Mark a todo as done":
          markTodo();
          break;
        case "List all todos":
          allTodo();
          break;
        case "Exit":
          console.log("GoodBye !!")
          exit();
          break;
      }
    })
    .catch(err=>{
      console.log(`Error : ${err}`)
    })
}

program
  .name('start')
  .description('start the CLI_Todo')
  .version('0.8.0');

  program
  .command('startTodo')
  .description('startTodo for start the CLI_TODO')
  .action(() => {
    menu();
  });

program.parse(); 
let addBtn = document.querySelector('.add-btn');
let setActive = document.querySelector('.priority-clr');
let textArea = document.querySelector('.modal-cnt');
let taskMainCnt = document.querySelector('.task-main-cnt');
let colors = ['redColor', 'pinkColor', 'lightGreenColor', 'lightBlueColor'];
let taskPriorityColor = colors[colors.length - 1];
let allPriorityColor = document.querySelectorAll('.priority-clr');
let textAreaCnt = document.querySelector('.textarea-cnt');
let flag = false;
let removeFlag = false;
let closeButton = document.querySelector('.remove-btn');
let allTask = document.querySelector('.task-cnt');
let lockClass = 'fa-lock';
let unlockClass = 'fa-lock-open';
let toolBoxPriorityColor = document.querySelectorAll('.color');
let taskArr = [];
let deletedTask=[];
if(localStorage.getItem('task')){
    taskArr=JSON.parse(localStorage.getItem('task'));
    taskArr.forEach(function(task){
        createTicket(task.taskColors,task.taskValue,task.taskID);
    })
}
for(let i=0;i<toolBoxPriorityColor.length;i++){
    toolBoxPriorityColor[i].addEventListener('click',function(){
        let currentToolBoxColor = toolBoxPriorityColor[i].classList[1];
        let filteredTask = taskArr.filter(function(taskObj){
            return currentToolBoxColor===taskObj.taskColors;
        })
        let allTaskInCnt = document.querySelectorAll(".task-cnt");
        for(let i=0;i<allTaskInCnt.length;i++){
            allTaskInCnt[i].remove();
        }
        for(let i=0;i<filteredTask.length;i++){
            createTicket(filteredTask[i].taskColors,filteredTask[i].taskValue,filteredTask[i].taskID);
        }
    });
    toolBoxPriorityColor[i].addEventListener('dblclick',function(e){
        let allTaskInCnt=document.querySelectorAll('.task-cnt');
        for(let i=0;i<allTaskInCnt.length;i++){
            allTaskInCnt[i].remove();
        }
        taskArr.forEach(function(task){
            createTicket(task.taskColors,task.taskValue,task.taskID);
        })
    })
}
addBtn.addEventListener('click', function (e) {
    if (flag == false) {
        console.log("TextArea Opened!");
        textArea.style.display = 'flex';
        flag = true;
    } else {
        console.log("TextArea Closed!");
        textArea.style.display = 'none';
        flag = false;
    }
})
textArea.addEventListener("keydown", function (e) {
    let clickedKey = e.key;
    if (clickedKey == "Shift") {
        console.log('Creating task')
        createTicket(taskPriorityColor, textAreaCnt.value );
        textArea.style.display = "none";
        flag = false;
        textAreaCnt.value = '';
    }
})
function createTicket(taskColors, taskValue , taskID) {
    let id = taskID || shortid();
    let taskContainer = document.createElement('div');
    taskContainer.setAttribute('class', 'task-cnt');
    taskContainer.innerHTML =
    `<div class="task-color ${taskColors}"></div>
    <div class="task-id">Task-ID#${id}</div>
    <div class="task-detail">${taskValue}</div>
    <div class="lock-cnt">
    <i class="fa-solid fa-lock"></i>
    </div>`
    taskMainCnt.appendChild(taskContainer);
    removeMethod(taskContainer,id);
    handleColor(taskContainer,id);
    handleLock(taskContainer,id);
    if(!taskID){
        taskArr.push({taskColors,taskValue,taskID:id});
        localStorage.setItem('task',JSON.stringify(taskArr));
    }
    

}
allPriorityColor.forEach(function (clrElement) {
    clrElement.addEventListener('click', function (e) {
        allPriorityColor.forEach(function (allClr) {
            allClr.classList.remove('active');
        })
        console.log(clrElement.classList[0]);
        clrElement.classList.add('active');
        taskPriorityColor = clrElement.classList[0];
    })
})

closeButton.addEventListener('click', function () {
    removeFlag = !removeFlag;
    if (removeFlag == true) {
        closeButton.style.color = "red";
    } else {
        closeButton.style.color = "#ced6e0";
    }

})
function removeMethod(taskToBeRemoved,id) {
    taskToBeRemoved.addEventListener('click', function () {
        if (removeFlag == false) return ; 
        let idx = getTaskId(id);
        let deletedElement = taskArr.splice(idx,1);
        deletedTask.push(deletedElement);
        let newTaskArr = JSON.stringify(taskArr);
        localStorage.setItem('task',newTaskArr);
        taskToBeRemoved.remove();

    })
}

function handleLock(task,id){
    let lockElement=task.querySelector('.lock-cnt');
    let taskLock = lockElement.children[0];
    let ticketTaskArea = task.querySelector('.task-detail');
    taskLock.addEventListener('click',function(e){
        let taskIdx = getTaskId(id);
        if(taskLock.classList.contains(lockClass)){
            taskLock.classList.remove(lockClass);
            taskLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute('contenteditable' , 'true')
        }else{
            taskLock.classList.remove(unlockClass);
            taskLock.classList.add(lockClass);
            ticketTaskArea.setAttribute('contenteditable' , 'false')
        }
        taskArr[taskIdx].taskValue=ticketTaskArea.innerText;
        localStorage.setItem('task',JSON.stringify(taskArr));
    })
}

function handleColor(task,id){
    let taskColorStrip = task.querySelector('.task-color');
    taskColorStrip.addEventListener('click',function(e){
        let currentColor = taskColorStrip.classList[1];
        let currentColorIdx = colors.findIndex(function(c){
            return currentColor===c;
        })
        currentColorIdx+=1;
        let newColorIndex= currentColorIdx%colors.length;
        let newColor = colors[newColorIndex];
        taskColorStrip.classList.remove(currentColor);
        taskColorStrip.classList.add(newColor);
        let taskIdx = getTaskId(id);
        taskArr[taskIdx].taskColors= newColor;
        localStorage.setItem('task',JSON.stringify(taskArr));
    })
    
}
function getTaskId(id){
    let taskIdx = taskArr.findIndex(function(taskObj){
        return taskObj.taskID===id;
    });
    return taskIdx; 
}
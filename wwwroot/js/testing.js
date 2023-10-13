import { AssignmentBlock, EqualityBlock, ExpressionBlock, FunctionBlock, LogicBlock, ScopeBlock } from "./classes/CodeBlock.js";

function test(){
    alert("Testing");
}

function allowDrop(ev) 
{
    ev.preventDefault();
}
  
function drop(ev) 
{
  ev.preventDefault();

  if(ev.target.className != "testContainer" && ev.target.className != "code-block-slot")
  {
    return;
  }

  let data = ev.dataTransfer.getData("key");
  let block = document.getElementById(data);

  if(ev.target.className == "code-block-slot")
  {
    let newSlot = document.createElement("div");
    newSlot.className = "code-block-slot";
    newSlot.addEventListener("dragover", function(event){allowDrop(event)});
    newSlot.addEventListener("drop", function(event){drop(event)});

    let newSlot2 = document.createElement("div");
    newSlot2.className = "code-block-slot";
    newSlot2.addEventListener("dragover", function(event){allowDrop(event)});
    newSlot2.addEventListener("drop", function(event){drop(event)});

    //block.before(newSlot);
    //block.after(newSlot2);

    ev.target.replaceWith(block);

    //ev.target.block.before(newSlot);
    return;
  }

  ev.target.appendChild(block);
}

function drag(ev) 
{
  ev.dataTransfer.setData("key", ev.target.id);
}

window.allowDrop = allowDrop;
window.drop = drop;
window.drag = drag;

let test1 = document.getElementById("test1");
let block = new EqualityBlock("==");
//block.element.addEventListener("dragstart", function(event){drag(event)});
let block2 = new AssignmentBlock("=", 1, 1);
let block3 = new FunctionBlock("function");

let block4 = new ExpressionBlock("+");
block4.makeRightSide();

let block5 = new LogicBlock("and");

let block6 = new ScopeBlock("if");

test1.appendChild(block.element);
test1.appendChild(block2.element);
test1.appendChild(block3.element);
test1.appendChild(block4.element);
test1.appendChild(block5.element);
test1.appendChild(block6.element);

let lineContainer = document.getElementById("test2");

lineMaker();
lineMaker();

function lineMaker()
{
    let line = document.createElement("div");
    line.className = "line";


    let blockSlot = document.createElement("div");
    blockSlot.className = "code-block-slot";
    blockSlot.addEventListener("dragover", function(event){allowDrop(event)});
    blockSlot.addEventListener("drop", function(event){drop(event)});

    line.appendChild(blockSlot);

    lineContainer.appendChild(line);
}
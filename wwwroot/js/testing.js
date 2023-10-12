import { AssignmentBlock, EqualityBlock, ExpressionBlock, FunctionBlock } from "./classes/CodeBlock.js";

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

  if(ev.target.className != "testContainer")
  {
    return;
  }

  let data = ev.dataTransfer.getData("key");
  let block = document.getElementById(data);
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


test1.appendChild(block.element);
test1.appendChild(block2.element);
test1.appendChild(block3.element);
test1.appendChild(block4.element);
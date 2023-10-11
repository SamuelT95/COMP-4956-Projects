import * as CodeBlocks from "./classes/CodeBlock.js";

function test(){
    alert("Testing");
}

function allowDrop(ev) {
    ev.preventDefault();
  }
  
  function drag(ev) {
    ev.dataTransfer.setData("key", ev.target.id);
  }
  
  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("key");
    ev.target.appendChild(document.getElementById(data));
  }

  let div = document.getElementById("flexItem2");

  let block = new CodeBlocks.ExpressionBlock("expression", "+", 1, 1);

  div.appendChild(block.element);
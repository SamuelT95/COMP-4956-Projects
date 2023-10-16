import { CodeSlot, AssignmentBlock, EqualityBlock, FunctionBlock,ExpressionBlock, LogicBlock, ScopeBlock } from "./classes/CodeBlock.js";
  
export function allowDrop(ev) 
{
    ev.preventDefault();
}
  
export function drop(ev) 
{
  ev.preventDefault();

  //ensure were only dropping into a code slot
  if(ev.target.className != "code-block-slot")
  {
    return;
  }

  // get the stored element id
  let elementId = ev.dataTransfer.getData("key");
  let draggedBlock = document.getElementById(elementId);

  // if were pulling from the toolbox we need to make a new block
  let element = draggedBlock;
  if(draggedBlock.className.includes("dummy"))
  {
    element = null;
  }

  let block = null;

  switch(draggedBlock.dataset.blockType)
  {
    case "assignment":
      block = new AssignmentBlock(draggedBlock.dataset.subType, element);
      break;
    case "equality":
      block = new EqualityBlock(draggedBlock.dataset.subType, element);
      break;
    case "function":
      block = new FunctionBlock(draggedBlock.dataset.subType, element);
      break;
    case "expression":
      block = new ExpressionBlock(draggedBlock.dataset.subType, element);
      if(ev.target.previousElementSibling != null && ev.target.previousElementSibling.dataset.blockType == "expression")
      {
        block.makeRightSide();
      }
      break;
    case "logic":
      block = new LogicBlock(draggedBlock.dataset.subType, element);
      break;
    case "scope":
      block = new ScopeBlock(draggedBlock.dataset.subType, element);
      break;
    default:
      block = new AssignmentBlock(draggedBlock.dataset.subType, element);
      break;
  }

  // make sure we dot put blocks in the wrong places
  if(block.hasValidNeighbors(ev.target) == false)
  {
    return;
  }
  
  //replace the code slot with the block
  ev.target.replaceWith(block.element);

  // user should never be able to create bad logic
  removeBadLogic(block.element);

  //defunct
  //check to see if we need to put a new code slot before
  // if(block.element.previousElementSibling == null && (block.blockType != "scope" && block.blockType != "function"))
  // {
  //     let newSlot = new CodeSlot();
  //     block.element.parentElement.insertBefore(newSlot.element, block.element);
  // }

  //check to see if we need to put a new code slot after
  if(block.element.nextElementSibling == null && (block.subType != "else" && block.blockType != "function"))
  {
      let newSlot = new CodeSlot();
      block.element.parentElement.appendChild(newSlot.element);
  }

  //handle creating a new line
  let lineContainer = block.element.parentElement.closest(".line-container");
  if(lineContainer == null || lineContainer == undefined)
  {
    lineContainer = document.getElementById("test2");
  }
  
  let lineIndex = Array.prototype.indexOf.call(lineContainer.children, block.element.parentElement);

  // make a whole new space for scopes
  if(block.blockType == "scope")
  {
    newScope(lineContainer);
    lineIndex++;
  }

  //if we are at the end of the line container make a new line
  if(lineIndex == lineContainer.children.length - 1)
  {
      lineMaker(lineContainer);
  }

  removeEmptyLines();

  // responsible for keeping scope blocks the right size
  adjustScopeDividers();
}

function removeBadLogic(element)
{
  let previousElementSibling = element.previousElementSibling;

  if(previousElementSibling != null && previousElementSibling.previousElementSibling != null)
  {
    if(previousElementSibling.previousElementSibling.dataset.blockType == "scope" && previousElementSibling.dataset.blockType == "logic")
    {
      previousElementSibling.remove();
    }
    else if(previousElementSibling.previousElementSibling.dataset.blockType == "logic" && previousElementSibling.dataset.blockType == "logic")
    {
      previousElementSibling.remove();
    }
    else if(previousElementSibling.previousElementSibling.dataset.blockType == "equality" && previousElementSibling.dataset.blockType == "equality")
    {
      previousElementSibling.remove();
    }
  }
}

function adjustScopeDividers()
{
  let dividers = document.getElementsByClassName("scope-divider");

  for(let divider of dividers)
  {
    let lineContainer = divider.nextElementSibling;

    divider.style.height = lineContainer.clientHeight + "px";
  }
}

function newScope(lineContainer)
{
  let scopeContainer = document.createElement("div");
  scopeContainer.className = "scope-container";

  let scopeDivider = document.createElement("div");
  scopeDivider.className = "scope-divider";
  scopeContainer.appendChild(scopeDivider);


  let newLineContainer = document.createElement("div");
  newLineContainer.className = "line-container";

  scopeContainer.appendChild(newLineContainer);
  
  lineMaker(newLineContainer);
  lineContainer.appendChild(scopeContainer);
}



function removeEmptyLines()
{
  let lines = document.getElementsByClassName("line"); 

  for(let line of lines)
  {
    if(lineIsEmpty(line) && line.nextElementSibling != null)
    {
      line.remove();
    }
  }
}

function lineIsEmpty(line)
{
  return line.getElementsByClassName("code-block-slot").length == line.children.length;
}

export function lineMaker(lineContainer)
{
    let line = document.createElement("div");
    line.className = "line";

    let blockSlot = new CodeSlot().element;
    line.appendChild(blockSlot);

    lineContainer.appendChild(line);
}

export function drag(ev) 
{
  ev.dataTransfer.setData("key", ev.target.id);
}

window.allowDrop = allowDrop;
window.drop = drop;
window.drag = drag;
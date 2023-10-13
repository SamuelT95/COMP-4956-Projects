import { CodeSlot,AssignmentBlock, EqualityBlock, FunctionBlock,ExpressionBlock, LogicBlock, ScopeBlock } from "./classes/CodeBlock.js";
  
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
  let block = document.getElementById(elementId);

  // if were pulling from pallete make a new block
  if(block.className.includes("dummy"))
  {
    switch(block.dataset.blockType)
    {
      case "assignment":
        block = new AssignmentBlock(block.dataset.subType).element;
        console.log(block.id);
        break;
      case "equality":
        block = new EqualityBlock(block.dataset.subType).element;
        break;
      case "function":
        block = new FunctionBlock(block.dataset.subType).element;
        break;
      case "expression":
        block = new ExpressionBlock(block.dataset.subType).element;
        //block.makeRightSide();
        break;
      case "logic":
        block = new LogicBlock(block.dataset.subType).element;
        break;
      case "scope":
        block = new ScopeBlock(block.dataset.subType).element;
        break;
      default:
        break;
    }
  }

    //replace the code slot with the block
    ev.target.replaceWith(block);

    //check to see if we need to put a new code slot 
    if(block.previousElementSibling == null)
    {
        let newSlot = new CodeSlot();
        block.parentElement.insertBefore(newSlot.element, block);
    }

    if(block.nextElementSibling == null)
    {
        let newSlot = new CodeSlot();
        block.parentElement.appendChild(newSlot.element);
    }

}

export function drag(ev) 
{
  ev.dataTransfer.setData("key", ev.target.id);
}

window.allowDrop = allowDrop;
window.drop = drop;
window.drag = drag;
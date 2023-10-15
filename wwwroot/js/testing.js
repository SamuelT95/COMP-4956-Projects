import { AssignmentBlock, EqualityBlock, ExpressionBlock, FunctionBlock, LogicBlock, ScopeBlock, CodeSlot } from "./classes/CodeBlock.js";
import { lineMaker } from "./drag_drop.js";
function test(){
    alert("Testing");
}

let test1 = document.getElementById("test1");

let block = new EqualityBlock("==");
block.element.className += " dummy"

let block2 = new AssignmentBlock("=");
block2.element.className += " dummy"

let block3 = new FunctionBlock("function");
block3.element.className += " dummy"

let block4 = new ExpressionBlock("+");
block4.element.className += " dummy"
block4.makeRightSide();

let block5 = new LogicBlock("and");
block5.element.className += " dummy"

let block6 = new ScopeBlock("if");
block6.element.className += " dummy"

test1.appendChild(block.element);
test1.appendChild(block2.element);
test1.appendChild(block3.element);
test1.appendChild(block4.element);
test1.appendChild(block5.element);
test1.appendChild(block6.element);


lineMaker();



import { allowDrop, drop, drag } from "../drag_drop.js";
import { LiteralBlock, DummyLiteralBlock, VariableBlock } from "./ValueBlock.js";

class CodeBlock 
{
    static count = 0;
    static blockTypes = 
    [
        "scope",       // if, else, elif, while
        "function",     // user defined functions, built-in functions
        "assignment",   // =, +=, -=, *=, /=
        "expression",   // +, -, *, /, %
        "equality",     // ==, !=, <, >, <=, >=
        "logic",        // ||, &&
        "special"       // input, return
    ]

    constructor(blockType, subtype, element = null) 
    {
        this.subType = subtype;

        if (CodeBlock.blockTypes.includes(blockType)) 
        {
            this.blockType = blockType;
        }
        else 
        {
            throw new Error("Invalid block type");
        }

        if(element != null)
        {
            this.element = element;
            this.leftBar = element.children[0];
            this.rightBar = element.children[element.children.length - 1];
            return;
        }

        this.element = document.createElement("div");
        this.element.className = "code-block";
        this.element.dataset.blockType = blockType;
        this.element.dataset.subType = subtype;
        this.element.setAttribute("draggable", "true");
        this.element.addEventListener("dragstart", function(event){drag(event)});
        
        this.leftBar = document.createElement("div");
        this.leftBar.className = "sideBar left";
        this.element.appendChild(this.leftBar);
        this.rightBar = document.createElement("div");
        this.rightBar.className = "sideBar right";

        this.element.id = "block_" + CodeBlock.count;
        CodeBlock.count++;
    }

    addRightBar()
    {
        this.element.appendChild(this.rightBar);
    }

    checkNeighbors(slot, goodLeftSide, goodRightSide)
    {
        if(slot.previousElementSibling != null && goodLeftSide.includes(slot.previousElementSibling.dataset.blockType))
        {
            return CodeBlock.checkRightSide(slot, goodRightSide);
        }
        else if(slot.previousElementSibling == null && goodLeftSide.includes(null))
        {
            return CodeBlock.checkRightSide(slot, goodRightSide);
        }
        else
        {
            return false;
        }

    }

    static checkRightSide(slot, goodRightSide)
    {
        if(slot.nextElementSibling == null)
        {
            return true;
        }
        else if(slot.nextElementSibling != null && goodRightSide.includes(slot.nextElementSibling.dataset.blockType))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    addVarLit()
    {
        let varLit = document.createElement("div");
        varLit.className = "varlit";
        varLit.addEventListener("dragover", function(event){allowDrop(event)});
        varLit.addEventListener("drop", function(event){varLitDrop(event)});
        this.element.appendChild(varLit);

        
    }

    addVar()
    {
        let varDiv = document.createElement("div");
        varDiv.className = "var";
        varDiv.addEventListener("dragover", function(event){allowDrop(event)});
        varDiv.addEventListener("drop", function(event){varDrop(event)});
        this.element.appendChild(varDiv);
    }

    addExpression(string)
    {
        let expressionElement = document.createElement("p");
        expressionElement.className = "expression";
        expressionElement.innerText = string;
        this.element.appendChild(expressionElement);
    }
}



export class ScopeBlock extends CodeBlock
{
    static subTypes = 
    [
        "if",
        "elif",
        "else",
        "while"
    ]

    static goodLeftSide =
    [
        null
    ]

    static goodRightSide =
    [
        null,
        "equality"
    ]

    constructor(subType, element = null)
    {
        if (!ScopeBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }
        super("scope", subType, element);

        if(element != null)
        {
            return;
        }

        
        if(subType == "else")
        {
            this.element.className += " else";
        }
        else
        {
            this.element.className += " scope-block";

        }

        this.element.className += " threequarters"

        this.addExpression(subType.toUpperCase());
        this.addRightBar();

        if(this.subType == "else")
        {
            this.rightBar.style.backgroundColor = "inherit";
        }
    }

    hasValidNeighbors(slot)
    {

        if(this.element.parentElement != null && this.element.parentElement.contains(slot))
        {
            return false;
        }
        return this.checkNeighbors(slot, ScopeBlock.goodLeftSide, ScopeBlock.goodRightSide)
    }
}

export class FunctionBlock extends CodeBlock
{
    static goodLeftSide =
    [
        null
    ]

    static goodRightSide 
    [
        null
    ]
    

    constructor(subType, element = null)
    {
        super("function" , subType, element);

        if(element != null)
        {
            return;
        }

        this.element.className += " function-block";

        this.addVarLit();
        this.addVar();
        this.addRightBar();
    }

    hasValidNeighbors(slot)
    {
        return this.checkNeighbors(slot, FunctionBlock.goodLeftSide, FunctionBlock.goodRightSide)
    }
}


export class AssignmentBlock extends CodeBlock
{
    static subTypes =
    [
        "=",
        "+=",
        "-=",
        "*=",
        "/="
    ]

    static goodLeftSide =
    [
        null
    ]

    static goodRightSide =
    [
        "expression",
        null
    ]

    constructor(subType, element = null)
    {
        if (!AssignmentBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }

        super("assignment", subType, element);

        if(element != null)
        {
            return;
        }

        
        this.element.className += " assignment-block";

        this.addVar();
        this.addExpression(subType);
        this.addVarLit();
        this.addRightBar();
    }

    hasValidNeighbors(slot)
    {
        return this.checkNeighbors(slot, AssignmentBlock.goodLeftSide, AssignmentBlock.goodRightSide);
    }
}

export class ExpressionBlock extends CodeBlock
{
    static subTypes =
    [
        "+",
        "-",
        "*",
        "/",
        "%"
    ]

    static goodLeftSide =
    [
        "expression",
        "assignment",
    ]

    static goodRightSide =
    [
        "expression",
        null
    ]


    constructor(subType, element = null)
    {
        if (!ExpressionBlock.subTypes.includes(subType))
        {
            throw new Error("Invalid sub type");
        }

        super("expression", subType, element);

        if(element != null)
        {
            return;
        }

        this.element.className += " expression-block threequarters";

        this.addExpression(subType);
        this.addVarLit();
        this.addRightBar();
    }

    hasValidNeighbors(slot)
    {
        return this.checkNeighbors(slot, ExpressionBlock.goodLeftSide, ExpressionBlock.goodRightSide);
    }
}


export class EqualityBlock extends CodeBlock
{
    static subTypes =
    [
        "==",
        "!=",
        "<",
        ">",
        "<=",
        ">="
    ]

    static goodLeftSide =
    [
        "logic",
        "scope"
    ]

    static goodRightSide =
    [
        "logic",
        null
    ]

    constructor(subType, element = null)
    {
        if (!EqualityBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }

        super("equality", subType, element);

        if(element != null)
        {   
            return;
        }

        this.element.className += " equality-block";

        this.addVarLit();
        this.addExpression(subType);
        this.addVarLit();
        this.addRightBar();
    }

    hasValidNeighbors(slot)
    {
        return this.checkNeighbors(slot, EqualityBlock.goodLeftSide, EqualityBlock.goodRightSide);
    }
}

export class LogicBlock extends CodeBlock
{
    static subTypes =
    [
        "or",
        "and"
    ]

    static goodLeftSide =
    [
        "equality"
    ]

    static goodRightSide =
    [
        "equality",
        null
    ]

    constructor(subType, element = null)
    {
        if (!LogicBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }

        super("logic", subType, element);

        if(element != null)
        {
            return;
        }

        this.element.className += " logic-block threequarters";

        this.addExpression(subType.toUpperCase());
        this.addRightBar();
    }

    hasValidNeighbors(slot)
    {
        return this.checkNeighbors(slot, LogicBlock.goodLeftSide, LogicBlock.goodRightSide);
    }
}

export class CodeSlot
{
    constructor()
    {
        this.element = document.createElement("div");
        this.element.className = "code-block-slot";
        this.element.addEventListener("dragover", function(event){allowDrop(event)});
        this.element.addEventListener("drop", function(event){drop(event)});
    }

    
}

export function isNullOrEmpty(slot)
{
  if(slot == null || slot.className == "code-block-slot")
  {
    return true;
  }

  return false;
}

function varDrop(ev)
{
    ev.preventDefault();

    //ensure were only dropping into a varlit
    if(ev.target.className != "varlit")
    {
      return;
    }
  
    // get the stored element id
    let elementId = ev.dataTransfer.getData("key");
    let draggedBlock = document.getElementById(elementId);


    switch(draggedBlock.dataset.blockType)
    {
        case "dummy_literal":
            let literalBlock = new LiteralBlock(draggedBlock.dataset.subType);
            ev.target.replaceWith(new LiteralBlock(draggedBlock.dataset.subType).element);
            break;
        case "variable":
            let variableBlock = new VariableBlock(draggedBlock.dataset.subType, draggedBlock.dataset.varType, draggedBlock.dataset.varValue);
            ev.target.replaceWith(variableBlock.element);
            break;
        default:
            return;
            break;
    }
}

function varLitDrop(ev)
{

}
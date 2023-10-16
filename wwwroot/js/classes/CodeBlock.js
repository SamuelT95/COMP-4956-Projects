import { allowDrop, drop, drag } from "../drag_drop.js";

class CodeBlock 
{
    static count = 0;
    static blockTypes = 
    [
        "scope",       // if, else, elif, while
        "function",     // user defined functions, built-in functions
        "value",     // variable, literal
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

    newId()
    {
        this.element.id = CodeBlock.count;
        CodeBlock.count++;
    }

    hasValidNeighbors(slot)
    {
        console.log("hasValidNeighbors not implemented");
        return true;
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

    constructor(subType, element = null)
    {
        if (!ScopeBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }
        super("scope", subType, element);

        if(element != null)
        {
            this.expressionElement = element.children[1];
            return;
        }

        this.element.className += " scope-block";

        this.expressionElement = document.createElement("p");
        this.expressionElement.className = "expression";
        this.expressionElement.innerText = subType.toUpperCase();

        this.element.appendChild(this.expressionElement);

        this.addRightBar();

        if(this.subType == "else")
        {
            this.rightBar.style.backgroundColor = "inherit";
        }
    }

    hasValidNeighbors(slot)
    {
        if(this.subType == "else" && isNullOrEmpty(slot.previousElementSibling) && isNullOrEmpty(slot.nextElementSibling))
        {
          return true;
        }
  
        if((isNullOrEmpty(slot.previousElementSibling) || slot.previousElementSibling.className == "code-block-slot" ) && (isNullOrEmpty(slot.nextElementSibling) || slot.nextElementSibling.dataset.blockType == "equality"))
        {
          return true;
        }

        return false;
    }
}

export class FunctionBlock extends CodeBlock
{
    constructor(subType, element = null)
    {
        super("function" , subType, element);

        if(element != null)
        {
            this.inputElement = element.children[1];
            this.outputElement = element.children[2];
            return;
        }

        this.element.className += " function-block";

        this.inputElement = document.createElement("div");
        this.outputElement = document.createElement("div");

        this.inputElement.className = "varlit";
        this.outputElement.className = "var";

        this.element.appendChild(this.inputElement);
        this.element.appendChild(this.outputElement);
        this.addRightBar();
    }

    hasValidNeighbors(slot)
    {
        if(isNullOrEmpty(slot.previousElementSibling) && isNullOrEmpty(slot.nextElementSibling))
        {
          return true;
        }

        return false;
    }
}

export class ValueBlock extends CodeBlock
{
    static subTypes =
    [
        "literal",
        "variable"
    ]

    constructor(blockType, subType, element = null, variableName = null )
    {
        if (!ValueBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }

        super(blockType, subType, element);

        this.element.className += " value-block";
        this.value = value;

        if (subType == "variable")
        {
            this.variableName = variableName;
        }

        this.addRightBar();
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

    constructor(subType, element = null)
    {
        if (!AssignmentBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }

        super("assignment", subType, element);

        if(element != null)
        {
            this.variableElement = element.children[1];
            this.expressionElement = element.children[2];
            return;
        }

        
        this.element.className += " assignment-block";
        this.variableElement = document.createElement("div");
        this.variableElement.className = "varlit";

        this.expressionElement = document.createElement("p");
        this.expressionElement.className = "expression";
        this.expressionElement.innerText = subType;

        this.element.appendChild(this.variableElement);
        this.element.appendChild(this.expressionElement);
        this.addRightBar();
    }

    hasValidNeighbors(slot)
    {
        if(isNullOrEmpty(slot.previousElementSibling) && (isNullOrEmpty(slot.nextElementSibling) || slot.nextElementSibling.dataset.blockType == "expression"))
        {
          return true;
        }
        //this.leftBar = this.leftBar;
        return false;
    }

    // setVariable(variableBlock)
    // {
    //     this.variableElement.children[0] = variableBlock;
    // }


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

    constructor(subType, element = null)
    {
        if (!ExpressionBlock.subTypes.includes(subType))
        {
            throw new Error("Invalid sub type");
        }

        super("expression", subType, element);

        if(element != null)
        {
            this.variableElement = element.children[1];
            this.expressionElement = element.children[2];
            this.secondVariableElement = element.children[3];
            return;
        }

        this.element.className += " expression-block";

        this.variableElement = document.createElement("div");
        this.variableElement.className = "var";

        this.expressionElement = document.createElement("p");
        this.expressionElement.className = "expression";
        this.expressionElement.innerText = subType;

        this.secondVariableElement = document.createElement("div");
        this.secondVariableElement.className = "varlit";

        this.element.appendChild(this.variableElement);
        this.element.appendChild(this.expressionElement);
        this.element.appendChild(this.secondVariableElement);
        this.addRightBar();
    }

    makeRightSide()
    {
        this.variableElement.hidden = true;
    }

    makeLeftSide()
    {
        this.ariableElement.hidden = false;
    }

    hasValidNeighbors(slot)
    {
        if((isNullOrEmpty(slot.previousElementSibling) || slot.previousElementSibling.dataset.blockType == "expression" || slot.previousElementSibling.dataset.blockType == "assignment") && (isNullOrEmpty(slot.nextElementSibling) || slot.nextElementSibling.dataset.blockType == "expression" )) 
        {
          return true;
        }

        return false;
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

    constructor(subType, element = null)
    {
        if (!EqualityBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }

        super("equality", subType, element);

        if(element != null)
        {   
            this.variableElement = element.children[1];
            this.expressionElement = element.children[2];
            this.secondVariableElement = element.children[3];
            return;
        }

        this.element.className += " equality-block";

        this.variableElement = document.createElement("div");
        this.variableElement.className = "varlit";

        this.expressionElement = document.createElement("p");
        this.expressionElement.className = "expression";
        this.expressionElement.innerText = subType;

        this.secondVariableElement = document.createElement("div");
        this.secondVariableElement.className = "varlit";

        this.element.appendChild(this.variableElement);
        this.element.appendChild(this.expressionElement);
        this.element.appendChild(this.secondVariableElement);
        this.addRightBar();
    }

    hasValidNeighbors(slot)
    {
        if((slot.previousElementSibling.dataset.blockType == "logic" || (slot.previousElementSibling.dataset.blockType == "scope" && slot.previousElementSibling.dataset.subType != "else")) && (isNullOrEmpty(slot.nextElementSibling) || slot.nextElementSibling.dataset.blockType == "logic"))
        {
          return true;
        }

        return false;
    }
}

export class LogicBlock extends CodeBlock
{
    static subTypes =
    [
        "or",
        "and"
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
            this.expressionElement = element.children[1];
            return;
        }

        this.element.className += " logic-block";

        this.expressionElement = document.createElement("p");
        this.expressionElement.className = "expression";
        this.expressionElement.innerText = subType.toUpperCase();

        this.element.appendChild(this.expressionElement);
        this.addRightBar();
    }

    hasValidNeighbors(slot)
    {
        if((isNullOrEmpty(slot.previousElementSibling) || slot.previousElementSibling.dataset.blockType == "equality") && (isNullOrEmpty(slot.nextElementSibling) || slot.nextElementSibling.dataset.blockType == "equality"))
        {
          return true;
        }

        return false;
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

function isNullOrEmpty(slot)
{
  if(slot == null || slot.className == "code-block-slot")
  {
    return true;
  }

  return false;
}
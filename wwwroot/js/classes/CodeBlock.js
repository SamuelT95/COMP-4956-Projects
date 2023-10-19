import { allowDrop, drop, drag } from "../drag_drop.js";

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
            this.expressionElement = element.children[1];
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
        return this.checkNeighbors(slot, FunctionBlock.goodLeftSide, FunctionBlock.goodRightSide)
    }
}

export class LiteralBlock
{
    static count = 0;
    static types = 
    [
        "string",
        "number",
        "boolean",
        "float"
    ]

    constructor(type, value, element = null)
    {
        if (!LiteralBlock.types.includes(type))
        {
            throw new Error("Invalid sub type");
        }

        if(element != null)
        {
            this.element = element;
            this.valueInput = element.children[0];
            this.type = element.dataset.subType;
            this.value = element.children[0].value;
            return;
        }

        this.value = value;
        this.type = type;

        this.element = document.createElement("div");
        this.element.id = "literal_" + LiteralBlock.count;
        LiteralBlock.count++;
        this.element.className = "literal-block";
        this.element.dataset.blockType = "literal";
        this.element.dataset.subType = type;
        this.element.setAttribute("draggable", "true");

        switch(type)
        {
            case "string":
                this.valueInput = getStringInput();
                break;
            case "number":
                this.valueInput = getNumberInput();
                break;
            case "boolean":
                this.valueInput = getBooleanInput();
                break;
            case "float":
                this.valueInput = getFloatInput();
                break;
        }

        this.valueInput.value = value;
        this.element.appendChild(this.valueInput);
    }

    getNumberInput()
    {
        let input = document.createElement("input");
        input.type = "number";
        input.className = "number-input";
        return input;
    }

    getBooleanInput()
    {
        let input = document.createElement("input");
        input.type = "checkbox";
        input.className = "boolean-input";
        return input;
    }

    getStringInput()
    {
        let input = document.createElement("input");
        input.type = "text";
        input.className = "string-input";
        return input;
    }

    getFloatInput()
    {
        let input = document.createElement("input");
        input.type = "number";
        input.className = "float-input";
        input.step = "any";
        return input;
    }
}



export class VariableBlock
{
    static count = 0;

    constructor(type, value, name, element = null)
    {
        if(element != null)
        {
            this.element = element;
            this.value = element.children[0];
            this.valueLabel = element.children[1];
            this.value.hidden = true;
            return;
        }

        this.element = document.createElement("div");
        this.element.className += "variable-" + name;
        this.element.id = "variable_" + VariableBlock.count;
        VariableBlock.count++;

        this.element.dataset.blockType = "variable";
        this.element.dataset.name = name;
        this.element.dataset.type = type;

        this.valueLabel = document.createElement("p");
        this.valueLabel.className = "value-label";
        this.valueLabel.innerText = name;

        this.value = document.createElement("p");
        this.value.className = "value";
        this.value.innerText = value;

        this.element.appendChild(this.value);
        this.element.appendChild(this.valueLabel);
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
        "%",
        "none"
    ]

    static goodLeftSide =
    [
        "expression"
    ]

    static goodRightSide =
    [
        "expression",
        null
    ]

    static goodRightSideNone =
    [
        "expression",
        null
    ]

    static goodLeftSideNone =
    [
        "assignment"
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

        this.element.className += " expression-block";

        this.variableElement = document.createElement("div");
        this.variableElement.className = "varlit";

        if(subType != "none")
        {
            this.expressionElement = document.createElement("p");
            this.expressionElement.className = "expression";
            this.expressionElement.innerText = subType;
            this.element.appendChild(this.expressionElement);
        }

        this.element.appendChild(this.variableElement);

        this.addRightBar();
    }

    hasValidNeighbors(slot)
    {
        if(this.subType == "none")
        {
            return this.checkNeighbors(slot, ExpressionBlock.goodLeftSideNone, ExpressionBlock.goodRightSideNone);
        }

        return this.checkNeighbors(slot, ExpressionBlock.goodLeftSide, ExpressionBlock.goodRightSide)
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
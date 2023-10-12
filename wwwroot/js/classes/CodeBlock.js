

class CodeBlock 
{
    static blockTypes = 
    [
        "scope",       // if, else, elif, while
        "function",     // user defined functions, built-in functions
        "value",     // variable, literal
        "assignment",   // =, +=, -=, *=, /=
        "expression",   // +, -, *, /, %
        "equality",     // ==, !=, <, >, <=, >=
        "logic",        // ||, &&, !
        "special"       // input, return
    ]

    constructor(blockType, subtype) 
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

        this.element = document.createElement("div");
        this.element.className = "code-block";
        this.element.dataset.blockType = blockType;
        this.element.setAttribute("draggable", "true");
        this.element.addEventListener("dragstart", function(event){drag(event)});
        this.element.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}

class LineCodeBlock extends CodeBlock
{
    constructor(blockType, subType, lineNumber, linePosition)
    {
        super(blockType, subType);
        this.element.className += " line-code-block";

        if (Number.isInteger(lineNumber) && lineNumber >= 0) 
        {
            this.lineNumber = lineNumber;
        }
        else 
        {
            throw new Error("Invalid line number");
        }

        if (Number.isInteger(linePosition) && linePosition >= 0) 
        {
            this.linePosition = linePosition;
        }
        else 
        {
            throw new Error("Invalid line position");
        }

        this.element.dataset.lineNumber = lineNumber;
        this.element.dataset.linePosition = linePosition;
    }
}

export class ScopeBlock extends LineCodeBlock
{
    static subTypes = 
    [
        "if",
        "elif",
        "else",
        "while"
    ]

    constructor(subType, lineNumber, linePosition, endLineNumber = lineNumber + 1)
    {
        if (!ScopeBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }
        super("scope", subType, lineNumber, linePosition);

        this.element.className += " scope-block";

        if(Number.isInteger(endLineNumber) && endLineNumber >= 0 && endLineNumber > lineNumber)
        {
            this.endLineNumber = endLineNumber;
        }
        else
        {
            throw new Error("Invalid end line number");
        }
    }
}

export class FunctionBlock extends CodeBlock
{
    constructor(subType, lineNumber, linePosition, input = null, output = null)
    {
        super("function", lineNumber, linePosition);
        this.element.className += " function-block";

        this.subType = subType;

        this.inputElement = document.createElement("div");
        this.outputElement = document.createElement("div");

        this.inputElement.className = "varlit";
        this.outputElement.className = "var";

        this.element.appendChild(this.inputElement);
        this.element.appendChild(this.outputElement);
    }
}

export class ValueBlock extends CodeBlock
{
    static subTypes =
    [
        "literal",
        "variable"
    ]

    constructor(blockType, subType, value, variableName = null)
    {
        if (!ValueBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }

        super(blockType, subType);

        this.element.className += " value-block";
        this.value = value;

        if (subType == "variable")
        {
            this.variableName = variableName;
        }
    }
}

export class AssignmentBlock extends LineCodeBlock
{
    static subTypes =
    [
        "=",
        "+=",
        "-=",
        "*=",
        "/="
    ]

    constructor(subType, lineNumber, linePosition)
    {
        if (!AssignmentBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }

        super("assignment", subType, lineNumber, linePosition);

        this.element.className += " assignment-block";
        this.variableElement = document.createElement("div");
        this.variableElement.className = "varlit";

        this.expressionElement = document.createElement("p");
        this.expressionElement.className = "expression";
        this.expressionElement.innerText = subType;

        this.element.appendChild(this.variableElement);
        this.element.appendChild(this.expressionElement);

    }

    setVariable(variableBlock)
    {
        this.variableElement.children[0] = variableBlock;
    }
}

export class FullExpressionBlock extends LineCodeBlock
{
    constructor(blockType, subType, lineNumber, linePosition)
    {
        super("expression", "full", lineNumber, linePosition);

        this.element.className += " expression-block";
        this.element.innerText = "expression";

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
    }
}

export class ExpressionBlock extends LineCodeBlock
{
    static subTypes =
    [
        "+",
        "-",
        "*",
        "/",
        "%"
    ]

    constructor(blockType, subType, lineNumber, linePosition)
    {
        if (!ExpressionBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }

        super("expression", subType, lineNumber, linePosition);

        this.element.classList.add("expression-block");
        this.variableElement = document.createElement("div");
        this.variableElement.className = "varlit";

        this.expressionElement = document.createElement("p");
        this.expressionElement.className = "expression";
        this.expressionElement.innerText = subType;

        this.element.appendChild(this.expressionElement);
        this.element.appendChild(this.variableElement);
    }
}

export class EqualityBlock extends LineCodeBlock
{
    static subTypes =
    [
        "==",
        "!=",
        "<",
        ">",
        "<=",
        ">=",
        "||",
        "&&"
    ]

    constructor(subType, lineNumber, linePosition)
    {
        if (!EqualityBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }

        super("equality", subType, lineNumber, linePosition);

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
    }
}

function drag(ev) 
{
    console.log("dragging");
  ev.dataTransfer.setData("key", ev.target.id);
}
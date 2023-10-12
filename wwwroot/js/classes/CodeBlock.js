

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
        this.element.dataset.subType = subtype;
        this.element.setAttribute("draggable", "true");
        this.element.addEventListener("dragstart", function(event){drag(event)});
        this.element.id = CodeBlock.count;
        CodeBlock.count++;
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

    constructor(subType)
    {
        if (!ScopeBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }
        super("scope", subType);

        this.element.className += " scope-block";
    }
}

export class FunctionBlock extends CodeBlock
{
    constructor(subType, input = null, output = null)
    {
        super("function" , subType);
        this.element.className += " function-block";

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

    constructor(subType)
    {
        if (!AssignmentBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }

        super("assignment", subType);

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

    constructor(subType)
    {
        if (!ExpressionBlock.subTypes.includes(subType))
        {
            throw new Error("Invalid sub type");
        }

        super("expression", subType);

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
    }

    makeRightSide()
    {
        this.variableElement.hidden = true;
    }

    makeLeftSide()
    {
        this.ariableElement.hidden = false;
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
        ">=",
        "||",
        "&&"
    ]

    constructor(subType)
    {
        if (!EqualityBlock.subTypes.includes(subType)) 
        {
            throw new Error("Invalid sub type");
        }

        super("equality", subType);

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
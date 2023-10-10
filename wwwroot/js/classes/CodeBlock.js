

export class CodeBlock 
{
    static blockTypes = 
    [
        "scope",       // if, else, elif, while
        "function",     // user defined functions, built-in functions
        "variable",     // variable, literal
        "assignment",   // =, +=, -=, *=, /=
        "expression",   // +, -, *, /, %
        "equality",     // ==, !=, <, >, <=, >=, ||, &&
        "special"       // input, return
    ]

    constructor(blockType, lineNumber, linePosition) 
    {
        this.subType = "none";

        if (blockTypes.includes(blockType)) 
        {
            this.blockType = blockType;
        }
        else 
        {
            throw new Error("Invalid block type");
        }

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

        this.element = document.createElement("div");
        this.element.className = "code-block";
        this.element.dataset.blockType = blockType;
        this.element.dataset.lineNumber = lineNumber;
        this.element.dataset.linePosition = linePosition;
        this.element.draggable = true;

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

    constructor(lineNumber, linePosition, subType, endLineNumber = lineNumber + 1)
    {
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

        if (this.subType.includes(subType)) 
        {
            this.subType = subType;
        }
        else 
        {
            throw new Error("Invalid sub type");
        }
    }
}

export class FunctionBlock extends CodeBlock
{
    constructor(lineNumber, linePosition, subType, input = null, output = null)
    {
        super("function", lineNumber, linePosition);
        this.element.className += " function-block";

        this.subType = subType;

        this.inputElement = document.createElement("div");
        this.outputElement = document.createElement("div");

        this.inputElement.className = "var/lit";
        this.outputElementElement.className = "var";

        this.element.appendChild(this.inputElement);
        this.element.appendChild(this.outputElement);
    }
}
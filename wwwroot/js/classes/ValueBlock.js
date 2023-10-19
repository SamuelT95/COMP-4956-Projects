import { drag, allowDrop} from "../drag_drop.js";

export class DummyLiteralBlock
{
    static count = 0;

    static types = 
    [
        "string",
        "number",
        "boolean",
        "float"
    ]

    constructor(type)
    {
        if (!DummyLiteralBlock.types.includes(type))
        {
            throw new Error("Invalid sub type");
        }

        DummyLiteralBlock.count++;
        if(DummyLiteralBlock.count > 1)
        {
            throw new Error("Only one dummy literal block allowed");
        }

        this.element = document.createElement("div");
        this.element.id = "dummy_literal";
        this.element.className = "dummy lit";
        this.element.dataset.blockType = "dummy_literal";
        this.element.dataset.subType = type;

        this.element.setAttribute("draggable", "true");
        this.element.addEventListener("dragstart", function(event){drag(event)});

        let typeLabel = document.createElement("p");
        typeLabel.className = "type-label";
        typeLabel.innerText = type;

        this.element.appendChild(typeLabel);
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

    constructor(type, element = null)
    {
        if (!LiteralBlock.types.includes(type))
        {
            throw new Error("Invalid sub type");
        }

        if(element != null)
        {
            this.element = element;

            return;
        }

        this.element = document.createElement("div");
        this.element.id = "literal_" + LiteralBlock.count;
        LiteralBlock.count++;
        this.element.className = "literal-block";
        this.element.dataset.blockType = "literal";
        this.element.dataset.subType = type;
        this.element.setAttribute("draggable", "true");

        let valueInput = null;

        switch(type)
        {
            case "string":
                valueInput = this.getStringInput();
                break;
            case "number":
                valueInput = this.getNumberInput();
                break;
            case "boolean":
                valueInput = this.getBooleanInput();
                break;
            case "float":
                valueInput = this.getFloatInput();
                break;
        }

        this.element.appendChild(valueInput);
    }

    getNumberInput()
    {
        let input = document.createElement("input");
        input.type = "number";
        input.className = "number-input";
        input.value = 0;
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

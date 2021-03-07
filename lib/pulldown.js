"use strict"

class Pulldown{

    constructor(){

        this.width = "150px";
        this.height = 30;
        this.padding = 2;

        this.pulldown = document.createElement("div");
        this.pulldown.classList.add("pulldown");

        this.holder = document.createElement("div");
        this.holder.classList.add("holder");
        this.pulldown.appendChild(this.holder);

        this.selection = document.createElement("div");
        this.selection.classList.add("selection");

        const selectArea = document.createElement("div");
        selectArea.classList.add("select-area");
        this.selectButton = document.createElement("span");
        this.selectButton.classList.add("pulldown-btn");
        this.selectButton.addEventListener("click", this.togglePulldown.bind(this));
        selectArea.appendChild(this.selectButton);

        this.pulldownArea = document.createElement("div");
        this.pulldownArea.classList.add("pulldown-area");

        const searchArea = document.createElement("div");
        searchArea.classList.add("search-text-area");
        const textSpan = document.createElement("span");
        this.textInput = document.createElement("input");
        this.textInput.type = "text";
        this.textInput.classList.add("search-text");
        this.textInput.addEventListener("keyup", this.filter.bind(this));
        this.textInput.addEventListener("blur", this.closePulldown.bind(this));
        textSpan.appendChild(this.textInput);
        const xMark = document.createElement("div");
        xMark.classList.add("clear-text");
        xMark.innerHTML = "&#10006;";
        xMark.addEventListener("mousedown", this.clearFilter.bind(this));
        textSpan.appendChild(xMark);
        searchArea.appendChild(textSpan);

        this.optionArea = document.createElement("ul");
        this.optionArea.classList.add("options");

        this.pulldownArea.appendChild(searchArea);
        this.pulldownArea.appendChild(this.optionArea);

        this.selection.appendChild(selectArea);
        this.selection.appendChild(this.pulldownArea);

        this.pulldown.appendChild(this.selection);

        this.data = [];
        this._data = null;
        this.value = null;

    }

    create(data){

        this._init(data);

        this.addOptions();

        const newWidth = (this.optionArea.offsetWidth + this.padding) + "px";
        this.selection.style["width"] = newWidth;
        this.holder.style["width"] = newWidth;
        this.optionArea.style["min-width"] = this.optionArea.offsetWidth + "px";

        return this.pulldown;
    }

    _init(data){
        this.current = null;
        this.value = null;
        this.closePulldown();
        this.data = data;
        this._data = data;
        this.optionArea.innerHTML = "";
        this.selection.style["width"] = this.width;
        this.holder.style["width"] = this.width;
    }

    addOptions(){
        const options = document.createDocumentFragment();

        this.data.forEach((item) => {
            const option = document.createElement("li");
            const text = document.createElement("a");
            text.addEventListener("mousedown", this.onItemClick.bind(this));
            text.classList.add("option");
            text.textContent = item;
            option.appendChild(text);
            options.appendChild(option);
        })

        this.optionArea.appendChild(options);

    }

    togglePulldown(e){
        if(this.data.length <= 0){
            this.closePulldown();
            return;
        }

        if(this.isOpened()){
            this.closePulldown();
        }else{
            this.openPulldown();
        }
    }

    isOpened(){
        return this.selection.classList.contains("open");
    }

    openPulldown(){
        this.textInput.focus();
        this.selection.classList.add("open");
        const rect = this.selection.getBoundingClientRect()
        this.pulldownArea.style.top = (rect.top + this.height) + "px";
        this.pulldownArea.style.left = rect.left + "px";

        if(this.current){
            this.optionArea.scrollTop = (this.optionArea.scrollTop + (this.current.top - this.optionArea.getBoundingClientRect().top) ) - 2;
        }
    }

    closePulldown(){
        this.selection.classList.remove("open");
        this.pulldownArea.style.top = "";
        this.pulldownArea.style.left = "";
    }

    onItemClick(e){

        if(e.button == 2){
            return;
        }

        if(this.current){
           this.current.node.classList.remove("selected");
        }

        e.target.classList.add("selected");
        this.current = {node: e.target, top: e.target.getBoundingClientRect().top};
        this.value = e.target.childNodes[0].textContent;
        this.selectButton.textContent = this.value;
        this.closePulldown();
    }

    filter(e){

        const value = e.target.value;

        if(value == "" || value == null){
            this.clearFilter();
            return;
        }

        this.optionArea.innerHTML = "";

        const exp = new RegExp(value, 'i');

        this.data = this.data.filter(function(item){
            return exp.test(item);
        })

        this.addOptions();
    }

    clearFilter(e){
        e.preventDefault();
        this.textInput.focus();
        this.optionArea.innerHTML = "";
        this.textInput.value = "";
        this.data = this._data;
        this.addOptions();
    }

}
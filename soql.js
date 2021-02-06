//const soql = function() {
    const _grids = {};
    const tabComponent = new Tab();
    const _sObjects = {};
    const DEFAULT_DATA_TYPE = "";
    const DEFAULT_CONTENT_TYPE = null;
    const POST = "post";


    $("#executeSoqlBtn").on("click", function(e){
        executeSoql();
    });

    $("#soqlArea .rerun").on("click", ".rerun", function(e){
        rerun();
    });

    $("#soqlArea .export").on("click", function(e){
        exportResult();
    });

    $("#soqlHistoryBtn").on("click", function(e){

        if (document.getElementById("soqlContent").classList.contains("history-opened")) {

            document.getElementById("soqlContent").classList.remove("history-opened");

        } else {

            document.getElementById("soqlContent").classList.add("history-opened");

        }

    });

    $("#closeHistoryBtn").on("click", function(e){
        closeSoqlHistory();
    });

    $("#soqlHistory").on("mouseover", "li", function(e) {
        e.target.setAttribute("title", e.target.textContent);
    });

    $("#soqlHistory").on("mouseout", "li", function(e) {
        e.target.setAttribute("title", "");
    });

    $("#soqlHistory").on("dblclick", "li", function(e) {
        document.getElementById("inputSoql").value = e.target.textContent;
    });

    //------------------------------------------------
    // Execute SOQL
    //------------------------------------------------
    export function executeSoql() {

        if ($.isAjaxBusy()) {
            return;
        }

        hideMessageArea();

        const soql = document.getElementById("inputSoql").value;
        const tooling = document.getElementById("useTooling").checked;

        const params = {soql: soql, tooling: tooling, tabId: getActiveTabElementId()};
        const options = $.getAjaxOptions("/soql", POST, params, DEFAULT_DATA_TYPE, DEFAULT_CONTENT_TYPE);
        const callbacks = $.getAjaxCallbacks(displayQueryResult, displayError, null);

        $.executeAjax(options, callbacks);
    };

    function displayQueryResult(json){

        const selectedTabId = json.soqlInfo.tabId;
        document.getElementById("soqlInfo" + selectedTabId).textContent = json.soqlInfo.timestamp;
        const history = document.createElement("li");
        history.textContent = json.soqlInfo.soql;
        document.getElementById("soqlList").appendChild(history);

        const elementId = "soqlGrid" + json.soqlInfo.tabId;

        if(_grids[elementId]){
            _grids[elementId].destroy();
        }

        _grids[elementId] = new GridTable(document.getElementById(elementId), json);
    };

    //------------------------------------------------
    // Rerun SOQL
    //------------------------------------------------
    function rerun(){
        if ($.isAjaxBusy()) {
            return;
        }

        const elementId = getActiveGridElementId();

        if (_sObjects[elementId]) {
            executeSoql({soql_info:_sObjects[elementId].soql_info, afterCrud: false});
        }
    }

    //------------------------------------------------
    // Export
    //------------------------------------------------
    function exportResult(){
        const elementId = getActiveGridElementId();
        const grid = _grids[elementId];

        if(grid){
            grid.export({
                fileName: "query_result",
                bom: true
            });
        }
    }

    //------------------------------------------------
    // Create tab
    //------------------------------------------------
    function createTab(newTab){
        const newTabId = newTab.tabIndex;

        tabComponent.activate(newTab.tabIndex);

        const parent = document.createElement("div");
        parent.classList.add("result-tab");
        parent.setAttribute("tabId", newTabId)

        const resultDiv = document.createElement("div");
        resultDiv.classList.add("result-info");
        resultDiv.setAttribute("tabId", newTabId);

        const soqlInfoDiv = document.createElement("div");
        soqlInfoDiv.id = "soql" + newTabId;

        const btn = document.createElement("button");
        btn.name = "rerunBtn"
        btn.classList.add("rerun");
        btn.classList.add("btn");
        btn.classList.add("btn-sub");
        btn.classList.add("grid-btn");
        btn.innerText = "Rerun";
        soqlInfoDiv.appendChild(btn);

        const infoDiv = document.createElement("div");
        infoDiv.id = "soqlInfo"+ newTabId;
        infoDiv.innerText = "0 rows";

        resultDiv.appendChild(soqlInfoDiv)
        resultDiv.appendChild(infoDiv)

        const gridDiv = document.createElement("div");
        gridDiv.id = "soqlGrid" + newTabId;
        gridDiv.classList.add("result-grid")
        gridDiv.setAttribute("tabId",newTabId)

        parent.appendChild(resultDiv)
        parent.appendChild(gridDiv)

        newTab.content.appendChild(parent);
    };

    //------------------------------------------------
    // Active grid
    //------------------------------------------------
    function getActiveTabElementId(){
        return tabComponent.activeTabIndex;
    };

    function getActiveGridElementId(){
        return "soqlGrid" + getActiveTabElementId();
    };

    //------------------------------------------------
    // message
    //------------------------------------------------
    function displayError(json){
        const messageArea = document.getElementById("soqlArea").querySelector(".message");
        messageArea.textContent = json.error;
        messageArea.style.display = "block";
    };

    function hideMessageArea(){
        const messageArea = document.getElementById("soqlArea").querySelector(".message");
        messageArea.textContent = "";
        messageArea.style.display = "none";
    };

    //------------------------------------------------
    // page load actions
    //------------------------------------------------
    export function prepareSoql(){
        tabComponent.afterAddTab(createTab);
        tabComponent.create(document.getElementById("soqlTabArea"), "soqlTab", "Grid");
        tabComponent.addTab();
    }
//};

 //   $(document).ready(soql);
   // $(document).on("page:load", soql);
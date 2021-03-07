import * as constants from "../lib/constants.js";

(function(){
    // --test
    let _grid = null;
    $("#test").on("click", function(e){
        const options = $.getAjaxOptions("/test", "post", {}, "", null);
        const callbacks = $.getAjaxCallbacks(displayQueryResult3, displayQueryResult3, null);
        $.executeAjax(options, callbacks);
    });

    const displayQueryResult3 = (json) => {
        var _selectedTabId = $("#soqlArea .tab-area .ui-tabs-panel:visible").attr("tabId");
        _selectedTabId = 0;
        const elementId = "#soqlArea #soqlGrid" + _selectedTabId;
        json.readOnly = [2,4];
        _grid = new GridTable(document.querySelector(elementId), json);
    };
    // --

    $(document).on("keydown", (e) => {

        if (e.ctrlKey && (e.key === "r" || e.keyCode === 13)) {
            e.preventDefault();

            if (e.target.id === "inputSoql"){
                soql.executeSoql();
                return false;
            }

            if(e.target.id === "apexCode") {
                executeAnonymous();
            }
        }

        // tab
        if (e.keyCode === 9) {
            if (e.target.id === "inputSoql" || e.target.id === "apexCode") {
                insertTab(e);
                return false;
            }
        }

    });

    //------------------------------------------------
    // Menu
    //------------------------------------------------
    $("#menus").on("click", "a", function(e) {

        if (e.target.classList.contains("displayed")) {
            return;
        }

        changeDisplayDiv(e.target);

    });

    $(document).on("mousedown", ".dropdown-menu a", function(e){

        if(e.target.classList.contains("checkmark")){
            return;
        }

        document.querySelectorAll(".dropdown-menu a").forEach(element => element.classList.remove("checkmark"));

        e.target.classList.add("checkmark");

        document.getElementById("username").textContent = e.target.textContent;

    });

    $("#username").on("click", function(e){
        const userList = document.getElementById("userList");
        if(userList.classList.contains("open")){
            userList.classList.remove("open");
        }else{
            userList.classList.add("open");
        }
    })

    $("#username").on("blur", function(e){
        document.getElementById("userList").classList.remove("open");
    })

    //------------------------------------------------
    // SOQL
    //------------------------------------------------
    $("#executeSoqlBtn").on("click", function(e){
        soql.executeSoql();
    });

    $("#soqlArea .rerun").on("click", ".rerun", function(e){
        soql.rerun();
    });

    $("#soqlArea .export").on("click", function(e){
        soql.exportResult();
    });

    $("#soqlHistoryBtn").on("click", function(e){
        soql.toggleSoqlHistory();
    });

    $("#closeHistoryBtn").on("click", function(e){
        soql.closeSoqlHistory();
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
    // Describe
    //------------------------------------------------
    $("#listSobjectBtn").on("click", function(e){
        describe.listSobjects();
    });

    $("#abc").on("click", function(e){
        const pul = document.getElementById("pul");
        if(pul.classList.contains("open")){
            pul.classList.remove("open");
        }else{
            pul.classList.add("open")
        }
    });

    //------------------------------------------------
    // Apex
    //------------------------------------------------
    $("#apexArea #executeAnonymousBtn").on("click", (e) => {
        apex.executeAnonymous();
    });

    $("#apexArea").on("click", "input.debug-only", function(e) {
        apex.onDebugOnly(e.target);
    });

    $("#apexArea .export").on("click", (e) => {
        apex.exportLog();
    });

    //------------------------------------------------
    // Insert Tab
    //------------------------------------------------
    function insertTab(e) {
        const elem = e.target;
        const start = elem.selectionStart;
        const end = elem.selectionEnd;
        elem.value = "" + (elem.value.substring(0, start)) + "\t" + (elem.value.substring(end));
        elem.selectionStart = elem.selectionEnd = start + 1;
    };

    //------------------------------------------------
    // prepareUser
    //------------------------------------------------
    function prepareUser(){

        document.getElementById("username").textContent = constants.defaultUser;

        const dropdown = document.getElementById("dropdownMenu");

        constants.users.forEach(user => {
            const list = document.createElement("li");
            list.classList.add("user");
            const checkmark = document.createElement("a");
            checkmark.href = "javascript:void(0)";
            checkmark.textContent = user;
            if(user == constants.defaultUser){
                checkmark.classList.add("checkmark");
            }
            list.appendChild(checkmark);
            dropdown.appendChild(list);
        });
    }

    //------------------------------------------------
    // Menu list
    //------------------------------------------------
    function changeDisplayDiv(target){

        document.querySelectorAll(".menu-item").forEach(element => element.classList.remove("displayed"));
        target.classList.add("displayed");

        document.getElementById("mainArea").className = "";
        document.getElementById("mainArea").classList.add(target.id);

    };

    //------------------------------------------------
    // page load actions
    //------------------------------------------------
    prepareUser();
    soql.prepare();
    describe.prepare();
    apex.prepare();
}());
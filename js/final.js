/*
 * Final Project for Bryan Miller
 * CSCI E-3
 * Spring semester, 2015
 *
 * Here are the 4 requirements I chose to fulfill:
 * 1.)  DOM element creation
 * 2.)  Capturing and handling events
 * 3.)  Creating and handling a data structure (JSON)
 * 4.)  Form validation
 *
 * Inspired by Larry Bouthillier's "Geocode" and Star Trek
 */

window.onload = function(){

    //This variable gets the JSON response from the Google geo location
    var json_response = '';
    var json_parsed_results = '';
    var my_json_string = '';

    // This counts how many log entries there are so far
    var counter = 1;

    //This array tests to see if all data forms have been filled out correctly.
    //If not, it will prevent clicking the submit button
    var canSubmitTest = [];

    //This is how many tests there are
    var numOfTests = 5;

    //Initializing all of the tests
    for(var i = 0; i < numOfTests; i++){
        canSubmitTest[i] = false;
    }
    var btnTest = false;
    var button = document.getElementById("btn");
    button.disabled = true;

    //Decimal validation
    var zip = document.getElementById("zip");
    document.getElementById("zip_hint").style.display = "none";
    zip.addEventListener("keyup", testZipDigits);
    function testZipDigits() {
        //regex expression created with help from https://www.debuggex.com
        if (/^\d{5}$/.test(zip.value)) {
            document.getElementById("zip_hint").style.display = "none";
            canSubmitTest[0] = true;
        } else {
            document.getElementById("zip_hint").style.display = "block";
            canSubmitTest[0] = false;
        }
    }

    //Integer input validation
    var stardate = document.getElementById("stardate");
    document.getElementById("stardate_hint").style.display = "none";
    stardate.addEventListener("keyup", testStardateDigits);
    function testStardateDigits() {
        //regex expression created with help from https://www.debuggex.com
        if (/^\d{4}\.{1}\d{1}$/.test(stardate.value)) {
            document.getElementById("stardate_hint").style.display = "none";
            canSubmitTest[1] = true;
        } else {
            document.getElementById("stardate_hint").style.display = "block";
            canSubmitTest[1] = false;
        }
    }

    //Button error checking
    document.addEventListener("keyup", noEmptyFieldsCheck);
    function noEmptyFieldsCheck(){

        if(zip.value == ''){
            document.getElementById("button_zip_hint").style.display = "block";
            canSubmitTest[2] = false;
        } else{
            document.getElementById("button_zip_hint").style.display = "none";
            canSubmitTest[2] = true;
        }

        if(stardate.value == ''){
            document.getElementById("button_stardate_hint").style.display = "block";
            canSubmitTest[3] = false;
        } else{
            document.getElementById("button_stardate_hint").style.display = "none";
            canSubmitTest[3] = true;
        }

        if(document.getElementById("log_content").value == ''){
            document.getElementById("button_log_hint").style.display = "block";
            canSubmitTest[4] = false;
        } else {
            document.getElementById("button_log_hint").style.display = "none";
            canSubmitTest[4] = true;
        }

        //Test to see if all the input forms were filled out correctly
        //Disable ability to submit if errors remain
        var btnTest = false;
        for(var i = 0; i < numOfTests; i++){
            if(canSubmitTest[i] == false){
                btnTest = true;
            }
        }

        if(btnTest){
            button.disabled = true;
        } else {
            button.disabled = false;
        }
    }

    // The below creates separate log entries by creating HTML elements and
    // appends them to the newNode element.
    button.addEventListener("click", createOutput);
    function createOutput(){
        var titleCol = document.createElement("H3");
        var titleText = document.createTextNode("Log Entry: #" + counter);
        counter++;
        titleCol.style.fontWeight = "bold";
        titleCol.appendChild(titleText);

        var stardateCol = document.createElement("SPAN");
        var starDateText = document.createTextNode("Stardate: " + stardate.value);
        stardateCol.style.fontWeight = "bold";
        stardateCol.appendChild(starDateText);

        var zipCol = document.createElement("SPAN");
        var zipText = document.createTextNode("Location: " + zip.value);
        zipCol.style.marginLeft = "20px";
        zipCol.style.fontWeight = "bold";
        zipCol.appendChild(zipText);

        var logCol = document.createElement("SPAN");
        var logText = document.createTextNode("Log Entry: " + document.getElementById("log_content").value);
        logCol.style.marginLeft = "20px";
        logCol.style.fontWeight = "bold";
        logCol.appendChild(logText);

        var extraLocationInfo = document.createElement("DIV");
        var extraLocationText = 'Geo Analysis of Location: ';
        for(var i = 0; i < json_parsed_results.results[0].address_components.length; i++) {
            extraLocationText += json_parsed_results.results[0].address_components[i].long_name + " - ";
        }
        extraLocationText += "Latitude: " + json_parsed_results.results[0].geometry.location.lat +
        " - Longitude: " + json_parsed_results.results[0].geometry.location.lng;

        var extraLocationTextNode = document.createTextNode(extraLocationText);
        extraLocationInfo.style.marginTop = "7px";
        extraLocationInfo.appendChild(extraLocationTextNode);

        var newNode = document.createElement("DIV");
        newNode.className = "well well-lg";
        newNode.appendChild(titleCol);
        newNode.appendChild(stardateCol);
        newNode.appendChild(zipCol);
        newNode.appendChild(logCol);
        newNode.appendChild(extraLocationInfo);
        document.getElementById("log_entry_output").appendChild(newNode);

    }

    // The below retrieves and parses JSON information from Google's API regarding
    // the zip code that was entered by the user
    zip.addEventListener("change", getGeo);
    function getGeo(){
        // Make an XmlHttpRequest
        var x = new XMLHttpRequest();
        x.open("GET", "http://maps.googleapis.com/maps/api/geocode/json?address=" + this.value, true);

        // Send the XmlHttpRequest
        x.send();

        // Listener for the XmlHttpRequest response
        x.onreadystatechange = function(){
            if (this.readyState==4 && this.status==200){
                json_response = this.response;

                // Parse the JSON response
                json_parsed_results = JSON.parse(this.response);
            }
        }
    }
}
/**
 * Created by zigapk on 7/17/15.
 */

var filters = ["grade1", "grade2", "grade3", "grade4", "classA", "classB", "classC", "classD", "classE", "classF", "male", "female"];
var years = [];
var server = "localhost";
var port = 8080;

function refresh(e) {
    setTimeout(refreshFactsAndStats(), 500);    
}

function refreshFactsAndStats() {
    var url = generateURL("http://"+server+":"+port+"/data");

    $.getJSON(url, function(data){
        //facts
        $("#vzorec-cel-dijaki").text(data["Facts"]["AllStudents"]);
        $("#vzorec-tren-dijaki").text(data["Facts"]["CurrentStudents"]);
        $("#vzorec-cel-fantje").text(data["Facts"]["AllMale"]);
        $("#vzorec-tren-fantje").text(data["Facts"]["CurrentMale"]);
        $("#vzorec-cel-dekleta").text(data["Facts"]["AllFemale"]);
        $("#vzorec-tren-dekleta").text(data["Facts"]["CurrentFemale"]);

        //stats
        $("#povp-uspeh").text(data["Stats"]["AverageGrade"]);
        $("#povp-izostanki").text(data["Stats"]["AverageAbsence"]);
        $("#povp-opravicene").text(data["Stats"]["ExcusableAbsence"]);
        $("#povp-neopravicene").text(data["Stats"]["InexcusableAbsence"]);
        $("#delez-opraviceni").text(data["Stats"]["ExcusableStudentsPercent"] + " % (" + data["Stats"]["ExcusableStudents"] + ")");
        $("#delez-neopraviceni").text(data["Stats"]["InexcusableStudentsPercent"] + " % (" + data["Stats"]["InexcusableStudents"] + ")");
    });
}

function onLoad() {
    //get availible years
    var yearsStr = httpGet("http://"+server+":"+port+"/years")
    years = yearsStr.split(",");

    generateYearsHtml()

    refresh();
}

function generateYearsHtml(){
    var html = "";
    var closed = true;

    for (var i = 0; i < years.length; i++) {
        if(i%2 == 0) {
            html += "<tr>";
            closed = false;
        }
        html += "<td><paper-button toggles raised active id='" + years[i] + "'>" + years[i].replace("-", "/") + "</paper-button></td>";
        if(i%2 == 1) {
            html += "</tr>";
            closed = true;
        }
    }

    if(!closed) {
        html += "</tr>";
    }

    $("#year-chooser-table").html(html);
}

function generateURL(base) {
    var url = base + "?";
    var endNeeded = false;

    for (var id of filters) {
        if(!$("#"+id).prop("checked")){
            if(endNeeded) {
                url += "&";
            }
            url += id+"=false";
            endNeeded = true;
        }
    }
    for (var id of years) {
        if(!$("#"+id).prop("active")){
            if(endNeeded) {
                url += "&";
            }
            url += id+"=false";
            endNeeded = true;
        }
    }
    return url;
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
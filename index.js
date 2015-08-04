/**
 * Created by zigapk on 7/17/15.
 */


var filters = ["grade1", "grade2", "grade3", "grade4", "classA", "classB", "classC", "classD", "classE", "classF", "male", "female"];
var years = [];
var server = "localhost";
var port = 8080;

function refresh(e) {
    setTimeout(refreshFactsAndStats(), 1);

    var temp;
    if ($("#povprecni-uspeh").prop("checked")) {
        temp = "povprečno oceno";
    } else {
        temp = "končnim uspehom";
    }
    setTimeout(drawChart("chart_excusable", "excusable", "Povezava med "+temp+" in številom opravičenih ur"), 1);
    setTimeout(drawChart("chart_inexcusable", "inexcusable", "Povezava med "+temp+" in številom neopravičenih ur"), 1);
}

function refreshFactsAndStats() {
    var url = generateURL("http://" + server + ":" + port + "/data", []);

    $.getJSON(url, function (data) {
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
    var yearsStr = httpGet("http://" + server + ":" + port + "/years")
    years = yearsStr.split(",");

    generateYearsHtml()

    refresh();
}

function generateYearsHtml() {
    var html = "";
    var closed = true;

    for (var i = 0; i < years.length; i++) {
        if (i % 2 == 0) {
            html += "<tr>";
            closed = false;
        }
        html += "<td><paper-button toggles raised active id='" + years[i] + "'>" + years[i].replace("-", "/") + "</paper-button></td>";
        if (i % 2 == 1) {
            html += "</tr>";
            closed = true;
        }
    }
    if (!closed) {
        html += "</tr>";
    }

    $("#year-chooser-table").html(html);
}

function generateURL(base, optionalParameters) {
    var url = base + "?";
    var endNeeded = false;

    for (var id of filters) {
        if (!$("#" + id).prop("checked")) {
            if (endNeeded) {
                url += "&";
            }
            url += id + "=false";
            endNeeded = true;
        }
    }
    for (var id of years){
        if (!$("#" + id).prop("active")) {
            if (endNeeded) {
                url += "&";
            }
            url += id + "=false";
            endNeeded = true;
        }
    }

    for (var param of optionalParameters)    {
        if (endNeeded) {
            url += "&";
        }
        url += param;
        endNeeded = true;
    }

    //for radio buttons
    if (endNeeded) {
        url += "&";
    }
    endNeeded = true;
    if ($("#povprecni-uspeh").prop("checked")) {
        url += "gradeType=average";
    } else {
        url += "gradeType=final";
    }
    return url;
}

function drawChart(chartID, absenceType, graphTitle) {
    var tempUrl = generateURL("http://" + server + ":" + port + "/graph", ["absenceType="+absenceType]);
    console.log(tempUrl)
    var jsonData = $.ajax({
        url: tempUrl,
        dataType: "json",
        async: false
    }).responseText;

    // Create our data table out of JSON data loaded from server.
    var data = new google.visualization.DataTable(jsonData);

    var options = {
        title: graphTitle,
        curveType: 'function',
        legend: {position: 'bottom'},
        backgroundColor: "#f9f9f9"
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.LineChart(document.getElementById(chartID));
    chart.draw(data, options);

}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
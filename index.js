/**
 * Created by zigapk on 7/17/15.
 */

function refresh(e) {
    //year and grade type choosers missing

    var url = "http://127.0.0.1:8080?";
    var endNeeded = false;

    //grades
    if(!document.getElementById("grade-1").hasAttribute("checked")) {
        if(endNeeded) {
            url += "&";
            endNeeded = true;
        }
        url += "grade1=false"
    }
    if(!document.getElementById("grade-2").hasAttribute("checked")) {
        if(endNeeded) {
            url += "&";
            endNeeded = true;
        }
        url += "grade2=false"
    }
    if(!document.getElementById("grade-3").hasAttribute("checked")) {
        if(endNeeded) {
            url += "&";
            endNeeded = true;
        }
        url += "grade3=false"
    }
    if(!document.getElementById("grade-4").hasAttribute("checked")) {
        if(endNeeded) {
            url += "&";
            endNeeded = true;
        }
        url += "grade4=false"
    }

    //class chooser missing

    //gender chooser
    if(!document.getElementById("male-checkbox").hasAttribute("checked")) {
        if(endNeeded) {
            url += "&";
            endNeeded = true;
        }
        url += "male=false"
    }
    if(!document.getElementById("male-checkbox").hasAttribute("checked")) {
        if(endNeeded) {
            url += "&";
            endNeeded = true;
        }
        url += "female=false"
    }

    $.getJSON(url, function(data){
        //$('#output').html(data.contents);
        alert(data["Facts"]["CurrentStudents"])
    });

}


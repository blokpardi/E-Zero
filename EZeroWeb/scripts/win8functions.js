var frameLoc = "http://localhost:50719";  //"ms-appx://" + document.location.hostname;
var networkState = "internet";

$(document).ready(function () {
    $('#mainPage').load('mainpage.html', function () {
        $('#btnFindState').show();
        window.parent.postMessage("getConnectionStatus", "*");
        onDeviceReady();
        window.addEventListener("message", actionFromHost, false);
    });
});

function onDeviceReady() {
    $.ajaxSetup({
        beforeSend: function () {
            if (!checkConnection()) {
                initnoNet();
            }
        }
    });
    initSetup();
}



function getPosition() {
    //navigator.geolocation.getCurrentPosition(getStateFromLoc, geoError);
    window.parent.postMessage("getLocation", "*");
}

function actionFromHost(e) {
    var msgSpl = e.data.split(":");
    switch(msgSpl[0])
    {
        case "getLocationResult":
            getStateFromLoc(msgSpl[1]);
            break;
        case "locationError":
            geoError(e.data);
            break;
        case "connectionstatus":
            if (msgSpl[1] == "internet") {
                networkState = "internet";
            }
            else {
                networkState = "NONE";
            }
    }
}

function geoError(err) {
    gotStateFromLoc(false);
}

function getStateFromLoc(position) {

    var latlong = position; //.coords.latitude + ',' + position.coords.longitude;
    $.ajax({
        url: "http://dev.virtualearth.net/REST/v1/Locations/" + latlong + "?includeEntityTypes=address&key=AnuhfIBvShX9nD_OR6s2oomIor3x2NexZimxQw8eCKnjy96boqq21XTuVMxBKWR4",
        contentType: "application/json",
        dataType: "jsonp",
        jsonp: "jsonp",
        success: function (R) {
            setState(R.resourceSets[0].resources[0].address.adminDistrict);
            gotStateFromLoc(true);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            stateChooser();
        }
    });
}


function getData() {
    $('#pageContent').html('&nbsp;');
    startActivity();
    if (getCookie('listdata') == null) {
        getAjaxData();
    }
    else {
        var R = getCookie('listdata');
        if (R != '') {
            setupList(R);
        }
        else {
            getAjaxData();
        }
    }
}

function saveData(data) {
   setCookie('listdata', data);
}

function clearListCache() {
    deleteCookie('listdata');
}


function checkConnection() {
    if (networkState == 'NONE') {
        return false;
    }
    else {
        return true;
    }
}

function taalert(val) {
    //navigator.notification.alert(val);
}

function stopActivity() {
    //navigator.notification.activityStop();
    $("#messagePage").hide();
}


function startActivity() {
    $("#mSpan").text("Loading...");
    $("#messagePage").show();
    //navigator.notification.activityStart();
}

function getCookie(check_name) {
    // note: document.cookie only returns name=value, not the other components
    var a_all_cookies = document.cookie.split(';');
    var a_temp_cookie = '';
    var cookie_name = '';
    var cookie_value = '';
    var b_cookie_found = false; // set boolean t/f default f
    var i = '';

    for (i = 0; i < a_all_cookies.length; i++) {
        a_temp_cookie = a_all_cookies[i].split('=');

        cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

        if (cookie_name == check_name) {
            b_cookie_found = true;
            // we need to handle case where cookie has no value but exists (no = sign, that is):
            if (a_temp_cookie.length > 1) {
                cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
            }
            // in cases where cookie is initialized but no value, null is returned
            return cookie_value;
            break;
        }
        a_temp_cookie = null;
        cookie_name = '';
    }
    if (!b_cookie_found) {
        return null;
    }
}

function setCookie(name, value, expires, path, domain, secure) {
    var today = new Date();
    today.setTime(today.getTime());
    if (expires) {
        expires = expires * 1000 * 60; // * 60 * 24;
    }
    else
    { expires = 365 * 1000 * 60 * 60 * 24; }
    var expires_date = new Date(today.getTime() + (expires));
    var newexp = expires_date.toGMTString();

    document.cookie = name + "=" + escape(value) +
		((expires) ? ";expires=" + expires_date.toGMTString() : "") + //expires.toGMTString()
		((path) ? ";path=" + path : "") +
		((domain) ? ";domain=" + domain : "") +
		((secure) ? ";secure" : "");
}

function deleteCookie(name, path, domain) {
    if (getCookie(name)) document.cookie = name + "=" +
			((path) ? ";path=" + path : "") +
			((domain) ? ";domain=" + domain : "") +
			";expires=Thu, 01-Jan-1970 00:00:01 GMT";
} 
 
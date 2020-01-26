
$(document).ready(function () {
    $('#mainPage').load('mainpage.html', function () {
        $('#btnFindState').show();
        document.addEventListener("deviceready", onDeviceReady, false);
    });
});

function onDeviceReady(e) {
    $.ajaxSetup({
        beforeSend: function () {
            if (!checkConnection()) {
                initnoNet();
            }
        }
    });
    navigator.notification.activityStop();
    initSetup();
}

function getPosition() {
    navigator.geolocation.getCurrentPosition(getStateFromLoc, geoError);
}

function geoError(err) {
    gotStateFromLoc(false);
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

function getStateFromLoc(position) {
    
    var latlong = position.coords.latitude + ',' + position.coords.longitude;
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
            gotStateFromLoc(false);
        }
    });
}

function checkConnection() {
    var networkState = navigator.network.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';
    // navigator.notification.alert('Connection type: ' + networkState);
    if (networkState == 'NONE') {
        return false;
    }
    else {
        return true;
    }
}

function taalert(val) {
    navigator.notification.alert(val);
}

function stopActivity() {
    navigator.notification.activityStop();
    $("#messagePage").hide();
}


function startActivity() {
    $("#mSpan").text("Loading...");
    $("#messagePage").show();
    navigator.notification.activityStart();
}

function getCookie(name) {
    try {
        return window.localStorage.getItem(name);
    }
    catch (err) {
        return null;
    }

}

function setCookie(name, value, vexpires, vpath, domain, secure) {
    window.localStorage.setItem(name, value);
}

function deleteCookie(name, path, domain) {
    window.localStorage.removeItem(name);
}


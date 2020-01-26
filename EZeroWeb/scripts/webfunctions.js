var currPg, prevPg = null;
$(document).ready(function () {
    $('head').append('<link rel="stylesheet" href="stylesheets/master.css" type="text/css" />');
    $('#mainPage').load('mainpage.html', function () {
        onDeviceReady();
    });
});

function onDeviceReady(e) {
    initSetup();
}
function taalert(val) {
   alert(val);
}

function stopActivity() {
    $("#messagePage").fadeOut('fast');
}

function getData() {
    $('#pageContent').html('&nbsp;');
    startActivity();
    getAjaxData();
}

function saveData(data) { }

function clearListCache() { }


function startActivity() {
    $("#mSpan").text("Loading...");
    $("#messagePage").fadeIn('fast');
}

function getPosition() {
    taalert("Unable to get your location. Please choose a state or province.");
   gotStateFromLoc(false);
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
 
var f1, f2;
var count = 0; // to count form1 and form2
$('.form2').hide(); // init

function doAjaxPost(formnum) {
    var fn = '.form' + formnum;
    var queryString = $(fn).serialize();
    return queryString;
}

function queryStringToArray(queryString) {
    var params = [], queries, temp, i, l;

    // Split into key/value pairs
    queries = queryString.split("&");

    // Convert the array of strings into an array of objects
    for (i = 0, l = queries.length; i < l; i++) {
        temp = queries[i].split('=');
        var obj = {};
        obj[temp[0]] = temp[1];
        params.push(obj);
    }
    return params;
}

// We have two arrays of object and compare them
function whatsNew() {
//    console.log(f1);
//    console.log(f2);

    // check numbers of params
    if (f1.length < f2.length) {
        var text = 'Form1 has less (' + f1.length + ') params then Form2 (' + f2.length + ').';
        console.log(text);
        $('body').append(text);
    } else if (f1.length > f2.length) {
        var text = 'Form1 has more (' + f1.length + ') params then Form2 (' + f2.length + ').';
        console.log(text);
        $('body').append(text);
    }

}

function run(formnum) {
    var str = doAjaxPost(formnum);
    var res = queryStringToArray(str);

    var fn = '.form' + formnum;
    $(fn).remove();

    if (count++ == 0) {
        f1 = res;
        $('.info').text('Now fill 2nd form:');
        $('.form2').show();
    } else {
        f2 = res;
        $('.info').text('Now fill 1st form:');
    }

    if (count > 1) {
        $('.info').text('Here what we got:');
        whatsNew();
    }
    // console.log(res);
}
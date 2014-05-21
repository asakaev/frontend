var f1, f2;
var count = 0; // to count form1 and form2
$('.form2').hide(); // init

function doAjaxPost(formnum) {
    var fn = '.form' + formnum;
    return $(fn).serialize();
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

function countSameKeys(arr) {
    var j;
    var histogram = {};
    var res = {};

    // like histogram
    for (j = 0; j < arr.length; j++) {
        var key = Object.keys(arr[j])[0]; // get key from object that live in array

        if (!histogram[key]) {
            histogram[key] = 1
        } else {
            histogram[key] = histogram[key] + 1;
        }
    }

    // transfer all key-val that has more than one occurrence
    for (var index in histogram) {
        if (histogram.hasOwnProperty(index) && histogram[index] > 1) {
            res[index] = histogram[index];
        }
    }
    return res;
}

// check how many params in form1 and form2
function paramsCheck() {
    var text;

    if (f1.length < f2.length) {
        text = 'Form1 has less (' + f1.length + ') params then Form2 (' + f2.length + ').';
        console.log(text);
        $('body').append('<p>' + text + '</p>');
    } else if (f1.length > f2.length) {
        text = 'Form1 has more (' + f1.length + ') params then Form2 (' + f2.length + ').';
        console.log(text);
        $('body').append('<p>' + text + '</p>');
    }
}

// check how many duplicates in each form and its names
function duplicatesCheck() {
    var text, index;

    var f1same = countSameKeys(f1); // {Extra: 2, Extra2: 2}
    var f2same = countSameKeys(f2);

    var f1sameCount = Object.keys(f1same).length; // 2
    var f2sameCount = Object.keys(f2same).length;
    var f1sameKeys = []; // ["Extra", "Extra2"]
    var f2sameKeys = [];

    // getting keys from object
    if (f1sameCount > 0) {
        for (index in f1same) {
            if (f1same.hasOwnProperty(index)) {
                f1sameKeys.push(index);
            }
        }
    }

    if (f2sameCount > 0) {
        for (index in f2same) {
            if (f2same.hasOwnProperty(index)) {
                f2sameKeys.push(index);
            }
        }
    }

    // output string formatting
    if (f1sameCount > f2sameCount) {
        text = 'Form1 has more (' + f1sameCount + ') keys duplicates (' + f1sameKeys.join(", ") +
            ') then Form2 (' + f2sameCount;
        if (f2sameCount > 0) {
            text += '), keys: (' + f2sameKeys.join(", ") + ').'
        } else {
            text += ').'
        }
        console.log(text);
        $('body').append('<p>' + text + '</p>');
    } else if (f1sameCount < f2sameCount) {
        text = 'Form2 has more (' + f2sameCount + ') keys duplicates (' + f2sameKeys.join(", ") +
            ') then Form1 (' + f1sameCount + ').';
        if (f1sameCount > 0) {
            text += '), keys: (' + f2sameKeys.join(", ") + ').'
        } else {
            text += ').'
        }
        console.log(text);
        $('body').append('<p>' + text + '</p>');
    }

    // need this later to compare values
    var res = [];
    res[0] = f1sameKeys;
    res[1] = f2sameKeys;
    return res;
}

function dupesValuesCheck(keys) {
    console.log(keys);
}

// We have two arrays of object and compare them
function whatsNew() {
    paramsCheck();
    var dupeKeys = duplicatesCheck();
    dupesValuesCheck(dupeKeys);
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
        $('.info').text('What has changed in the parameters?');
        whatsNew();
    }
    // console.log(res);
}
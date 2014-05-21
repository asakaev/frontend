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

function arrayUnique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
}

function isUnique(val, arr) {
    var i;
    for (i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            return false;
        }
    }
    return true;
}

function getValueByKey(key, arr) {
    var i, k;
    for (i = 0; i < arr.length; i++) {
        k = Object.keys(arr[i]);
        if (k == key) {
            return arr[i][k];
        }
    }
    return false;
}

function compareUniqueWithout(dupes) {
    var i, j;
    var k1 = dupes[0];
    var k2 = dupes[1];

    var con = k1.concat(k2);
    var dupeKeys = arrayUnique(con);

    var res = {};

    // compare form1 and form2 params Values
    for (i = 0; i < f1.length; i++) {
        var key1 = Object.keys(f1[i]).toString();
        for (j = 0; j < f2.length; j++) {
            var key2 = Object.keys(f2[j]).toString();

            // if keys are unique and matched
            if (isUnique(key1, dupeKeys) && isUnique(key2, dupeKeys) && (key1 == key2)) {
//                console.log(key1 + ':' + key2);
                var val1 = getValueByKey(key1, f1);
                var val2 = getValueByKey(key2, f2);
                if (val1 != val2) {
//                    console.log('not match');
                    var a = [];
                    a.push(val1);
                    a.push(val2);
                    res[key1] = a;
                }
            }

        }
    }
    return res; // {ID: Array[2], Name: Array[2]}
}

function showChangedValues(obj) {
    for (var k in obj) {
        var text = 'Parameter "' + k + '" was changed from "' + obj[k][0] + '" to "' + obj[k][1] + '".';
        console.log(text);
        $('body').append('<p>' + text + '</p>');
    }
}

// We have two arrays of object and compare them
function whatsNew() {
    paramsCheck();
    var dupeKeys = duplicatesCheck();
    var changes = compareUniqueWithout(dupeKeys);
    showChangedValues(changes);
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
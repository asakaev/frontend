var f1, f2;
var count = 0;
$('.form2').hide(); // init

function doAjaxPost (formnum) {
	var fn = '.form' + formnum;
    var queryString = $(fn).serialize();
    return queryString;
}

function whatsNew () {
	console.log(f1.Name + f2.Name);
}

function run (formnum) {
	var str = doAjaxPost(formnum);
	var res = parseQueryString(str);

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
	console.log(res);
}
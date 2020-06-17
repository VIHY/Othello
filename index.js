// 内置http模块，提供了http服务器和客户端功能
let http = require("http");
// 内置文件处理模块
let fs = require('fs');
// 请求并获得数据
let req;
let index = 1; // 起始页码
let endIndex = 99; // 终止页码
let Vol_start = 1
let Vol_end = 2
// 包一层函数
// http://comic.kkkkdm.com/comiclist/5/
let startUrl = ['0015A025H', '00156025J', '00156025J', '00156025J', '0015A025H', '0014X025N', '0014X025N', '00156025J', '0014X025N', '0015E025F', '00158025I', '00158025I', '0015A025H', '0015A025H', '0015A025H', '0015A025H', '0015A025H', '0015A025H', '00156025J', '0015C025G']
let startImg = startUrl[Vol_start - 1]
let startPage = startImg.substr(0, 3)

function init() {
	startImg = startUrl[Vol_start - 1]
	startPage = startImg.substr(0, 3)
	a = startImg[3]
	b = startImg[4]
	c = startImg[5]
	d = startImg[6]
	e = startImg[7]
	f = startImg[8]
}
let a = startImg[3]
let b = startImg[4]
let c = startImg[5]
let d = startImg[6]
let e = startImg[7]
let f = startImg[8]
let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y']

function add(s, flag, number) {
	let n = flag ? arr.indexOf(s) + number : arr.indexOf(s) - number
	n = n + 35
	return arr[n % 35]
}

function start(i) {
	let A, B, C, D, E, F;
	[A, B, C, D, E, F] = [a, b, c, d, e, f]
	f = add(f, true, 1)
	e = add(e, false, 1)
	/**
		d: 当c为0时，A->C，
		d: 当c为0时，C->D，
		d: 当c为1时，A->C，
		d: 当c为1时，C->E，
		d: 当c为2时，B->C，
		d: 当c为2时，C->E，
		d: 当c为4时，A->B，
		d: 当c为4时，B->D，
	*/
	if (d == 'A' && (arr.indexOf(c) + 4) % 8 == 0) {
		d = add(d, true, 1)
	} else if (d == 'B' && (arr.indexOf(c) + 2) % 4 == 0) {
		d = add(d, true, 1)
	} else if (d == 'C' && arr.indexOf(c) % 4 == 0) {
		d = add(d, true, 1)
	} else {
		d = add(d, true, 2)
	}
	c = d == '0' || d == '1' ? add(c, true, 1) : c
	// b: 当a为0时，D->C，
	// b: 当a为0时，C->A，
	// b: 当a为4时，D->B，
	if (b == 'B' && arr.indexOf(a) % 2 == 0) {
		b = a == '0' || a == '4' ? add(b, false, 1) : add(b, false, 2)
	} else if (b == 'C' && (arr.indexOf(a) + 2) % 4 == 0) {
		b = add(b, false, 1)
	} else if (b == 'D' && arr.indexOf(a) == 0) {
		b = add(b, false, 1)
	} else {
		b = add(b, false, 2)
	}
	a = b == 'X' || b == 'Y' ? add(a, false, 1) : a
	downloadImg(i, A, B, C, D, E, F);
}

function downloadImg(pageNumber, A, B, C, D, E, F) {
	console.log("开始读取第" + pageNumber + "页", Vol_start);
	let page = parseInt(startPage) - 1 + pageNumber
	let vol = Vol_start
	vol = vol > 9 ? '' + vol : '0' + vol
	page = page > 9 ? '' + page : '0' + page
	console.log('path:', 'v2.kukudm.com/kuku3comic3/mztkn/Vol_' + vol + '/0' + page + A + B + C + D + E + F + '.jpg')
	let options = {
		hostname: 'v2.kukudm.com', // 这里别加http://，否则会出现ENOTFOUND错误
		port: 80,
		path: '/kuku3comic3/mztkn/Vol_' + vol + '/0' + page + A + B + C + D + E + F + '.jpg', // 子路径
		method: 'GET',
	};
	req = http.request(options, (resp) => {
		let imgData = "";
		resp.setEncoding("binary");

		resp.on('data', function (chunk) {
			imgData += chunk;
		});

		resp.on('end', function () {
			let opPath = options.path
			let vol = opPath.substr(opPath.indexOf('Vol') + 4, 2)
			let fileName = "./conan_" + vol + "/" + vol + '_' + (parseInt(startPage) - 1 + pageNumber) + ".jpg";
			fs.writeFile(fileName, imgData, "binary", function (err) {
				if (err) console.log(err)
				if (err) {
					console.log("文件" + fileName + "下载失败.");
				} else console.log("文件" + fileName + "下载成功.")
			});
		});
	});

	// 超时处理
	req.setTimeout(5000, function () {
		req.abort();
	});

	// 出错处理
	req.on('error', function (err) {
		if (err.code == "ECONNRESET") {
			console.log('socket端口连接超时。');
		} else {
			console.log('请求发生错误，err.code:' + err.code);
		}
	});

	// 请求结束
	req.end();

	if (index < endIndex) {
		index++;
		console.log(`继续第${Vol_start}卷，第${index}页`)
		start(index);
	} else if (Vol_start < Vol_end) {
		index = 1
		Vol_start++
		init()
		console.log(`继续第${Vol_start}卷，第${index}页`)
		start(index);
	}
}

// 开始
start(index);
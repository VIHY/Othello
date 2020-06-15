// 内置http模块，提供了http服务器和客户端功能
var http = require("http");
// 内置文件处理模块
var fs = require('fs');
// 请求参数JSON
var options;
// 请求并获得数据
var req;
var index = 1; // 起始页码
var endIndex = 50; // 终止页码
// 包一层函数
let startImg = '0542B31M0'
let startPage = startImg.substr(0, 3)
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
let dF = false
function start(i) {
	if(parseInt(startPage) + i > 93)return
	let A, B, C, D, E, F
	[A, B, C, D, E, F] = [a, b, c, d, e, f]
	f = add(f, true, 1)
	e = add(e, false, 1)
	if (d == 'A') {
		dF = true
		d = 'B'
	} else if (d == 'B') {
		if (dF) {
			d = add(d, true, 2)
			dF = false
		} else {
			d = add(d, true, 2)
		}
	} else {
		d = add(d, true, 2)
	}
	c = d == '0' || d == '1' ? add(c, true, 1) : c
	if ((b == 'D') && arr.indexOf(a) % 2 == 0) {
		b = b=='C'?'B':'C'
	} else {
		b = add(b, false, 2)
	}
	a = b == 'X' || b == 'Y' ? add(a, false, 1) : a
	downloadImg(i, A, B, C, D, E, F);
}
function downloadImg(pageNumber, A, B, C, D, E, F) {
	console.log("开始读取第" + pageNumber + "页");
	console.log('path:', 'v2.kukudm.com/kuku3comic3/mztkn/Vol_16/0' + (parseInt(startPage) - 1 + pageNumber) + A + B + C + D + E + F + '.jpg')
	options = {
		hostname: 'v2.kukudm.com',// 这里别加http://，否则会出现ENOTFOUND错误
		port: 80,
		path: '/kuku3comic3/mztkn/Vol_16/0' + (parseInt(startPage) - 1 + pageNumber) + A + B + C + D + E + F + '.jpg',// 子路径
		method: 'GET',
	};

	req = http.request(options, function (resp) {
		var imgData = "";
		resp.setEncoding("binary");

		resp.on('data', function (chunk) {
			imgData += chunk;
		});

		resp.on('end', function () {
			var fileName = "./conan/" + pageNumber + ".jpg";
			fs.writeFile(fileName, imgData, "binary", function (err) {
				if (err) console.log(err)
				if (err) {
					console.log("文件" + fileName + "下载失败.");
				}
				else console.log(fileName + "下载成功");
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

	// 43页调完
	if (index < endIndex) {
		index++;
		console.log('继续第' + index + '页');
		start(index);
	}
}


// 开始
start(index);

const http = require("http");
const urlModule = require('url');
const fs = require('fs');
const pathModule = require('path');


function processPath(pathUrl, res)
{
	let rootFolder = "D:\\Dev\\Project\\vs\\cpp\\FFmpegPlayer\\x64\\Release\\";
	//let rootFolder = "D:\\Dev\\Project\\vs\\cpp\\FFmpegPlayer\\";
	let path = rootFolder+pathUrl;
	console.log("-pathUrl==",pathUrl, "path=", path);	
	
	let stat = fs.lstatSync(path, {throwIfNoEntry:false});
	if(!stat){
		res.write("404 - no file");
		res.end();
		return;
	}
	let isDir = stat.isDirectory();
	
	if(isDir){
		res.setHeader("Content-Type", "text/html; charset=utf-8;");
				
		res.write("<table border=1>");
		res.write("<td>isDir</td><td>file</td><td>size</td><td>atime</td>");
		res.write("<tr>");
		
		let linkUrl = pathModule.dirname(pathUrl);
		res.write("<td>DIR</td><td><a href='"+linkUrl+"'>..</a></td><td>-</td><td>-</td>");
		res.write("<tr>");
		fs.readdirSync(path).forEach(file => {
			
			let fullPath = path + "/" + file;
			let stat = fs.lstatSync(fullPath);
			let isDir = stat.isDirectory() ? "DIR" : "FILE";
			console.log("=", file, "===", isDir)
			
			//console.log("=", stat, "===");
			
			let linkUrl = pathUrl + "/" + file;
			if(pathUrl=='/'){
				linkUrl = file;
			}
			res.write("<td>"+isDir+"</td><td><a href='"+linkUrl+"'>"+ file +"</a></td><td>" + (stat.size/1024/1024).toFixed(2) +"MB</td><td>"+ stat.atime.toISOString() +"</td>");
			res.write("<tr>");
		});
		res.write("</table>");
		res.end();
	}
	else {
		let buff = fs.readFileSync(path);
		console.log("-----buff length==", buff.length);	
		res.write(buff)
		res.end();
	}
}


let newReqFunc = async function (req, res) {
	var url = urlModule.parse(req.url, true);
	var query = url.query;
	let pathname = url.pathname;
	
	console.log("----------------",pathname, query.key);		
	try{
		processPath(pathname, res);
	}
	catch(e){
		console.log("ERROR==", e);
	}
	
}

http.createServer(newReqFunc).listen(5000, '127.0.0.1');
http.createServer(newReqFunc).listen(5000, '192.168.0.100');

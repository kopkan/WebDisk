const http = require("http");
const urlModule = require('url');
const fs = require('fs');
const pathModule = require('path');


class HtmlTable
{
	begin(border=1){
		return "<table border="+border+">";
	}
	row(...args){
		let res = "<tr>";
		
		for(let arg of args){
			res += "<td>"+arg+"</td>";
		}
		res += "</tr>";
		return res;
	}
	end(){
		return "</table>";
	}
}

function processPath(pathUrl, res)
{
	let rootFolder = "D:\\Dev\\Project\\vs\\cpp\\FFmpegPlayer\\x64\\Release\\";
	//let rootFolder = "D:\\Dev\\Project\\vs\\cpp\\FFmpegPlayer\\";
	let path = rootFolder+pathUrl;
	console.log("-pathUrl==",pathUrl, "path=", path);	
	
	let stat = fs.lstatSync(path, {throwIfNoEntry:false});
	if(!stat){
		res.statusCode = 404;
		res.write("404 - no file");
		res.end();
		return;
	}
	
	let isDir = stat.isDirectory();
	if(isDir){
		res.setHeader("Content-Type", "text/html; charset=utf-8;");
		
		res.write("dir path="+ path + "<br>");
		
		let tableRender = new HtmlTable;
		
		res.write(tableRender.begin(5));
		res.write(tableRender.row("isDir", "file", "size", "atime"));
				
		let linkUrl = pathModule.dirname(pathUrl);
		
		res.write(tableRender.row("-", "<a href='"+linkUrl+"'>..</a>", "-", "-"));
		
		let filesAr = fs.readdirSync(path);
		for(file of filesAr) {
			let fullPath = path + file;
			let stat = fs.lstatSync(fullPath);
			let isDir = stat.isDirectory() ? "DIR" : "FILE";
			console.log("=", file, "===", isDir)
			
			let linkUrl = pathUrl + "/" + file;
			if(pathUrl=='/'){
				linkUrl = file;
			}
			res.write(tableRender.row(
				isDir,
				"<a href='"+linkUrl+"'>"+file+"</a>",
				(stat.size/1024/1024).toFixed(2) +"MB",
				stat.atime.toISOString()
			));
		}
		res.write(tableRender.end());
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
	let url = urlModule.parse(req.url, true);
	let query = url.query;
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
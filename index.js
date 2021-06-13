const express = require("express");
const fs = require("fs");
const app = express();

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get("/video", (req, res) => {
	const range = req.headers.range; // it defines what part of the video we want to send back

	if (!range) {
		res.status(400).send("Requires range header");
	}
	console.log("Range" + range);
	const videoPath = "Silicon.mp4";
	const videoSize = fs.statSync(videoPath).size; // It defines the video size

	//parse Range
	//ex:"bytes=32334-"
	const CHUNK_SIZE = 10 ** 6; //equivalent to 1mb\

	const start = Number(range.replace(/\D/g, "")); // It will remove all the non-digit characters
	console.log("Starting byte" + start);

	const end = Math.min(start + CHUNK_SIZE, videoSize - 1); //It will return the smallest of the 2 arguments given
	console.log("Ending byte" + end);

	const contentLength = end - start + 1;
	const headers = {
		"Content-Range": `Bytes ${start}-${end}/${videoSize}`,
		"Accept-Ranges": "bytes",
		"Content-Length": contentLength,
		"Content-Type": "video/mp4",
	};

	res.writeHead(206, headers); // 206 for partial content data because we are sending 1mb at a time to the server

	const videoStream = fs.createReadStream(videoPath, { start, end });
	videoStream.pipe(res);
});

app.listen(8000, () => {
	console.log("Server started on the port 8000");
});

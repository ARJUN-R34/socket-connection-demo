const io = require("socket.io-client")
const ioClient = io.connect("http://localhost:8000");

async function  rawTx() {
    const from;
    const to;
}

module.exports = { rawTx }
/* eslint-disable no-console */
const io = require('socket.io-client');

const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/b3a845111c5f4e3eaf646c79bcb4d4c0'));

const ioClient = io.connect('http://localhost:8000');

async function rawtx({
  from, to, value, privateKey,
}) {
  const gasPrice = await web3.eth.getGasPrice();

  const count = await web3.eth.getTransactionCount(from);
  const nonce = await web3.utils.toHex(count);

  const rawTx = {
    from,
    nonce,
    to,
    value: web3.utils.numberToHex(value),
    gasPrice: web3.utils.numberToHex(gasPrice),
    data: '0x00',
    chainId: 3,
  };

  ioClient.emit('rawTx', { rawTx, privateKey });
}

ioClient.on('signedTx', async (msg) => {
  console.log('Message = ', msg.stringTx);
});

module.exports = { rawtx };

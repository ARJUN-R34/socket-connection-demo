/* eslint-disable no-console */
const io = require('socket.io');
const Tx = require('ethereumjs-tx').Transaction;

const server = io.listen(8000);

const
  sequenceNumberByClient = new Map();

// event fired every time a new client connects:
server.on('connection', (socket) => {
  console.log(`Client connected [id=${socket.id}]`);
  // initialize this client's sequence number
  sequenceNumberByClient.set(socket, 1);

  // when socket disconnects, remove it from the list:
  socket.on('disconnect', () => {
    sequenceNumberByClient.delete(socket);
    console.log(`Client gone [id=${socket.id}]`);
  });

  socket.on('rawTx', async (msg) => {
    console.log('Message = ', msg.rawTx);

    const pkey = Buffer.from(msg.privateKey, 'hex');
    const tx = new Tx(msg.rawTx);

    tx.sign(pkey);
    const stringTx = `0x${tx.serialize().toString('hex')}`;

    server.emit('signedTx', { stringTx });
  });
});

// sends each client its current sequence number
setInterval(() => {
  for (const [ client, sequenceNumber ] of sequenceNumberByClient.entries()) {
    client.emit('seq-num', sequenceNumber);
    sequenceNumberByClient.set(client, sequenceNumber + 1);
  }
}, 1000);

import { Server } from 'socket.io';

// Use a global variable to store the io instance
// This ensures it persists across hot reloads in development
const globalForSocket = global as unknown as {
  ioInstance: Server | null;
};

export const setupSocket = (io: Server) => {
  console.log('Setting up socket with io instance:', !!io);
  globalForSocket.ioInstance = io;
  console.log('ioInstance set to global variable');
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle messages
    socket.on('message', (msg: { text: string; senderId: string }) => {
      // Echo: broadcast message only the client who send the message
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle inventory updates
    socket.on('inventoryUpdate', (data: { productId: string; stock: number; productName: string }) => {
      // Broadcast inventory update to all connected clients
      io.emit('inventoryUpdate', {
        productId: data.productId,
        stock: data.stock,
        productName: data.productName,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to WebSocket Echo Server!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};

// Function to get the io instance
export const getIO = () => {
  console.log('Getting ioInstance from global variable:', !!globalForSocket.ioInstance);
  return globalForSocket.ioInstance;
};
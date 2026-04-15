
import { io } from "socket.io-client";
import { BASE_URL } from "../MVC/Model/apiHelper"
 
let socket = null;

// Callback registry for socket events
const eventCallbacks = {
  new_order_offer: [],
};

// Register a callback for a specific socket event
export const onSocketEvent = (event, callback) => {
  if (eventCallbacks[event]) {
    eventCallbacks[event].push(callback);
  }
};

// Remove a callback for a specific socket event
export const offSocketEvent = (event, callback) => {
  if (eventCallbacks[event]) {
    const index = eventCallbacks[event].indexOf(callback);
    if (index > -1) {
      eventCallbacks[event].splice(index, 1);
    }
  }
};

// Emit event to all registered callbacks
const emitEvent = (event, data) => {
  if (eventCallbacks[event]) {
    eventCallbacks[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} callback:`, error);
      }
    });
  }
};

// ✅ Helper to log all socket events
const logSocketEvent = (event, data) => {
  if (__DEV__) {
    console.log(`\n🔌 SOCKET EVENT: ${event}`);
    console.log('📥 Data:', JSON.stringify(data, null, 2));
    console.log('─────────────────────────');
  }
};

export const connectSocket = (token) => { 
  if (socket) {
    console.log('⚠️ Disconnecting existing socket'); 
    socket.disconnect();
  }

  socket = io(BASE_URL, {
    transports: ["websocket"],
    auth: {
      token: token,
      type: "driver"
    },
  }); 

  // ── Connection events ──────────────────────────────
  socket.on("connect", () => {
    console.log('\n✅ Socket Connected');
    console.log('🆔 Socket ID:', socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log('\n❌ Socket Disconnected');
    console.log('📌 Reason:', reason);
  });

  socket.on("connect_error", (err) => {
    console.log('\n🚨 Socket Connection Error');
    console.log('📌 Message:', err.message);
    console.log('📌 Description:', err.description);
  });

  // ✅ Log ALL incoming events automatically
  socket.onAny((event, ...args) => {
    console.log(`\n📩 INCOMING EVENT: ${event}`);
    console.log('📥 Data:', JSON.stringify(args, null, 2));
    console.log('─────────────────────────');
  });

  // ✅ Handle new order offer events
  socket.on('new_order_offer', (data) => {
    logSocketEvent('new_order_offer', data);
    emitEvent('new_order_offer', data);
  });

  return socket;
}; 

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    console.log('\n🔌 Socket manually disconnected');
    socket.disconnect();
    socket = null;
  }
};

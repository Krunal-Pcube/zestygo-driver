import { io } from "socket.io-client";
import { BASE_URL } from "../MVC/Model/apiHelper"

let socket = null;
let currentToken = null;

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

// Helper to log all socket events
const logSocketEvent = (event, data) => {
  if (__DEV__) {
    console.log(`\n🔌 SOCKET EVENT: ${event}`);
    console.log('📥 Data:', JSON.stringify(data, null, 2));
    console.log('─────────────────────────');
  }
};

export const connectSocket = (token) => {
  // Skip if already connected with the same token
  if (socket?.connected && currentToken === token) {
    console.log('⚠️ Socket already connected with same token, skipping reconnect');
    return socket;
  }

  // Disconnect existing socket if different token or reconnect needed
  if (socket) {
    console.log('⚠️ Disconnecting existing socket');
    socket.disconnect();
    socket = null;
  }

  currentToken = token;

  socket = io(BASE_URL, {
    transports: ["polling", "websocket"],  // ✅ changed
    reconnection: true,
    reconnectionAttempts: Infinity,  // never give up
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,      // cap backoff at 5s
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
 
  socket.on("reconnect", (attemptNumber) => {
  console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
  socket.emit("authenticate", { token: currentToken, type: "driver" });
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






// offer: {
//       order_id: order.id,
//       assignment_id: assignment.id,
//       offer_expires_at: assignment.offer_expires_at,
//       is_reassignment: assignment.is_reassignment,
//       is_broadcast: isBroadcast ? "1" : "0"
//     },

//     payout: {
//       delivery_fee_amount: parseFloat(checkout?.delivery_fee_amount || 0),
//       tip_amount: parseFloat(checkout?.tip_amount || 0)
//     },

//     restaurant: {
//       name: restaurant.restaurant_name,
//       address: buildRestaurantAddress(restaurant),
//       latitude: restaurant.latitude,
//       longitude: restaurant.longitude
//     },

//     customer: {
//       name: order.user?.name || "Customer",
//       address: buildCustomerAddress(drop),
//       latitude: drop.latitude,
//       longitude: drop.longitude
//     },

//     route: {
//       to_restaurant_km: parseFloat(distanceKm.toFixed(2)),
//       to_customer_km: parseFloat(dropDistanceKm.toFixed(2))
//     },

//     eta: {
//       to_restaurant_minutes: Math.ceil(distanceKm * 3),
//       to_customer_minutes: Math.ceil(dropDistanceKm * 3)
//     },

//     order: {
//       order_number: order.order_number,
//       store_order_number: order.store_order_number,
//       order_type: order.order_type,
//       schedule_type: checkout?.schedule_type,
//       scheduled_date: checkout?.scheduled_date,
//       scheduled_start_time: checkout?.scheduled_start_time,
//       scheduled_end_time: checkout?.scheduled_end_time,
//     } 
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   RefreshControl,
// } from 'react-native';
// import { Bike, MapPin, CheckCircle2, XCircle } from 'lucide-react-native';
// import { colors } from '../utils/colors';
// import fonts from '../utils/fonts/fontsList';
// import { scale, moderateScale } from 'react-native-size-matters';
// import Header from '../components/Header';
// import { getDriverEarningsController } from '../MVC/controllers/driverEarningController';
// import { useAuth } from '../MVC/context/AuthContext';

// // ─── Helpers ────────────────────────────────────────────────────────────────

// const pad = (n) => String(n).padStart(2, '0');

// /** Returns "YYYY-MM-DD" for a Date object */
// const toISODate = (d) =>
//   `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// /** Returns "D Month YYYY" e.g. "21 April 2026" */
// const formatDisplayDate = (isoStr) => {
//   const [y, m, day] = isoStr.split('-').map(Number);
//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December',
//   ];
//   return `${day} ${months[m - 1]} ${y}`;
// };

// /** Returns short day name "Mon", "Tue" … */
// const shortDayName = (isoStr) => {
//   const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   const [y, m, d] = isoStr.split('-').map(Number);
//   return days[new Date(y, m - 1, d).getDay()];
// };

// /** Subtract `n` days from today and return "YYYY-MM-DD" */
// const subtractDays = (n) => {
//   const d = new Date();
//   d.setDate(d.getDate() - n);
//   return toISODate(d);
// };

// /** Build last-N-days date options for the horizontal day picker */
// const buildDateOptions = (count = 7) =>
//   Array.from({ length: count }, (_, i) => {
//     const iso = subtractDays(count - 1 - i);
//     return {
//       fullDate: iso,
//       day: shortDayName(iso),
//       date: String(Number(iso.split('-')[2])), // "21" without leading zero
//     };
//   });

// // ─── Constants ───────────────────────────────────────────────────────────────

// const PERIOD_TABS = ['day', 'week', 'month'];
// const STATUS_TABS = ['completed', 'cancelled'];
// const DATE_OPTIONS = buildDateOptions(7);
// const TODAY = toISODate(new Date());

// // ─── Screen ──────────────────────────────────────────────────────────────────

// const AllOrdersScreen = ({ navigation }) => {
//   const { auth } = useAuth();
//   const [periodTab, setPeriodTab] = useState('day');
//   const [statusTab, setStatusTab] = useState('completed');
//   const [selectedDate, setSelectedDate] = useState(TODAY);
//   const [earningsData, setEarningsData] = useState([]);
//   const [apiSummary, setApiSummary] = useState(null); // top-level totals from API
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   // ── Fetch ─────────────────────────────────────────────────────────────────

//   const fetchEarnings = useCallback(
//     async (isRefresh = false) => {
//       isRefresh ? setRefreshing(true) : setLoading(true);

//       // Map UI tabs → API params
//       const orderStatus =
//         statusTab === 'completed' ? 'delivered' : 'cancelled';

//       const params = {
//         date_type: periodTab,
//         order_status: orderStatus,
//         delivery_partner_id: auth?.delivery_partner_id,
//       };

//       if (periodTab === 'day') {
//         params.date = selectedDate;
//       }

//       await getDriverEarningsController({
//         params,
//         onSuccess: (data, fullResponse) => {
//           // `data` = res.data.data (array)
//           // Store full response so we can grab top-level totals
//           setEarningsData(data || []);
//           setApiSummary(fullResponse?.data || null);
//         },
//       });

//       isRefresh ? setRefreshing(false) : setLoading(false);
//     },
//     [periodTab, statusTab, selectedDate],
//   );

//   useEffect(() => {
//     fetchEarnings();
//   }, [fetchEarnings]);

//   // ── Derived data ──────────────────────────────────────────────────────────

//   /**
//    * Flatten all orders from the nested structure.
//    * Filter by the active statusTab so switching tabs works client-side too
//    * (API also filters, but this guards against stale data).
//    */
//   const flatOrders = React.useMemo(() => {
//     const targetStatus = statusTab === 'completed' ? 'delivered' : 'cancelled';
//     const list = [];

//     earningsData.forEach((earning) => {
//       earning.trip_earnings?.forEach((tripEarning) => {
//         const trip = tripEarning.delivery_trip;
//         trip?.delivery_trip_orders?.forEach((order) => {
//           if (order.status !== targetStatus) return;

//           const pickup = order.delivery_route_stops?.find(
//             (s) => s.stop_type === 'pickup',
//           );
//           const drop = order.delivery_route_stops?.find(
//             (s) => s.stop_type === 'drop',
//           );

//           list.push({
//             key: `${trip.id}-${order.id}`,
//             orderId: order.id,
//             tripNumber: trip.trip_number,
//             tripStatus: trip.status,
//             orderStatus: order.status,
//             deliveryAmount: order.delivery_amount ?? 0,
//             tipAmount: order.tip_amount ?? 0,
//             totalAmount: (order.delivery_amount ?? 0) + (order.tip_amount ?? 0),
//             pickupName: pickup?.place_name ?? '',
//             pickupAddress: pickup?.address ?? '',
//             dropName: drop?.place_name ?? '',
//             dropAddress: drop?.address ?? '',
//             earningDate: earning.earning_date, // "YYYY-MM-DD"
//           });
//         });
//       });
//     });

//     return list;
//   }, [earningsData, statusTab]);

//   /** Group flat orders by earning_date for section headers */
//   const groupedByDate = React.useMemo(() => {
//     const map = {};
//     flatOrders.forEach((o) => {
//       if (!map[o.earningDate]) map[o.earningDate] = [];
//       map[o.earningDate].push(o);
//     });
//     // Sort dates descending (newest first)
//     return Object.entries(map).sort(([a], [b]) => (a < b ? 1 : -1));
//   }, [flatOrders]);

//   /** Stats shown in the card — use API top-level totals when available */
//   const stats = React.useMemo(() => {
//     if (apiSummary) {
//       return {
//         totalOrders: apiSummary.total_orders_delivered ?? 0,
//         totalEarnings: apiSummary.total_earnings ?? 0,
//       };
//     }
//     // Fallback: sum from local earningsData
//     return earningsData.reduce(
//       (acc, e) => ({
//         totalOrders: acc.totalOrders + (e.total_orders_delivered ?? 0),
//         totalEarnings: acc.totalEarnings + (e.total_earnings ?? 0),
//       }),
//       { totalOrders: 0, totalEarnings: 0 },
//     );
//   }, [apiSummary, earningsData]);

//   // ── Render helpers ────────────────────────────────────────────────────────

//   const renderPeriodTabs = () => (
//     <View style={styles.periodTabs}>
//       {PERIOD_TABS.map((tab) => (
//         <TouchableOpacity
//           key={tab}
//           style={[styles.periodTab, periodTab === tab && styles.periodTabActive]}
//           onPress={() => setPeriodTab(tab)}
//           activeOpacity={0.7}
//         >
//           <Text
//             style={[
//               styles.periodTabText,
//               periodTab === tab && styles.periodTabTextActive,
//             ]}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );

//   const renderDateSelector = () => {
//     if (periodTab !== 'day') return null;
//     return (
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.dateSelector}
//       >
//         {DATE_OPTIONS.map((item) => {
//           const isActive = selectedDate === item.fullDate;
//           return (
//             <TouchableOpacity
//               key={item.fullDate}
//               style={[styles.dateBox, isActive && styles.dateBoxActive]}
//               onPress={() => setSelectedDate(item.fullDate)}
//               activeOpacity={0.7}
//             >
//               <Text style={[styles.dateDay, isActive && styles.dateTextActive]}>
//                 {item.day}
//               </Text>
//               <Text style={[styles.dateNum, isActive && styles.dateTextActive]}>
//                 {item.date}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </ScrollView>
//     );
//   };

//   const renderStatsCard = () => (
//     <View style={styles.statsCard}>
//       <View style={styles.statItem}>
//         <Text style={styles.statValue}>{stats.totalOrders}</Text>
//         <Text style={styles.statLabel}>Complete Orders</Text>
//       </View>
//       <View style={styles.statDivider} />
//       <View style={styles.statItem}>
//         <Text style={styles.statValue}>${stats.totalEarnings.toFixed(2)}</Text>
//         <Text style={styles.statLabel}>Order Earnings</Text>
//       </View>
//     </View>
//   );

//   const renderStatusTabs = () => (
//     <View style={styles.statusTabs}>
//       {STATUS_TABS.map((tab) => (
//         <TouchableOpacity
//           key={tab}
//           style={[styles.statusTab, statusTab === tab && styles.statusTabActive]}
//           onPress={() => setStatusTab(tab)}
//           activeOpacity={0.7}
//         >
//           <Text
//             style={[
//               styles.statusTabText,
//               statusTab === tab && styles.statusTabTextActive,
//             ]}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );

//   const renderOrderCard = (order) => {
//     const isDelivered = order.orderStatus === 'delivered';
//     return (
//       <View key={order.key} style={styles.orderCard}>
//         {/* Header row: trip number + amount */}
//         <View style={styles.orderHeader}>
//           <View style={styles.orderTypeRow}>
//             <Bike size={18} color={colors.darkText} />
//             <Text style={styles.orderType} numberOfLines={1}>
//               {order.tripNumber}
//             </Text>
//           </View>
//           <View style={styles.orderAmountRow}>
//             <Text style={styles.orderAmount}>
//               ${order.totalAmount.toFixed(2)}
//             </Text>
//             {isDelivered ? (
//               <CheckCircle2 size={16} color={colors.green} />
//             ) : (
//               <XCircle size={16} color={colors.red ?? '#FF3B30'} />
//             )}
//           </View>
//         </View>

//         {/* Pickup */}
//         <View style={styles.addressRow}>
//           <MapPin size={14} color={colors.grey} />
//           <View style={styles.addressContent}>
//             {order.pickupName ? (
//               <Text style={styles.addressName}>{order.pickupName}</Text>
//             ) : null}
//             <Text style={styles.addressText} numberOfLines={1}>
//               {order.pickupAddress}
//             </Text>
//           </View>
//         </View>

//         {/* Drop */}
//         <View style={styles.addressRow}>
//           <MapPin size={14} color={colors.primary ?? colors.grey} />
//           <View style={styles.addressContent}>
//             {order.dropName ? (
//               <Text style={styles.addressName}>{order.dropName}</Text>
//             ) : null}
//             <Text style={styles.addressText} numberOfLines={1}>
//               {order.dropAddress}
//             </Text>
//           </View>
//         </View>

//         {/* Tip badge */}
//         {order.tipAmount > 0 && (
//           <View style={styles.tipRow}>
//             <Text style={styles.tipText}>
//               Tip: ${order.tipAmount.toFixed(2)}
//             </Text>
//           </View>
//         )}
//       </View>
//     );
//   };

//   const renderOrderList = () => {
//     if (loading) {
//       return (
//         <ActivityIndicator
//           size="large"
//           color={colors.primary}
//           style={styles.loader}
//         />
//       );
//     }

//     if (flatOrders.length === 0) {
//       return (
//         <View style={styles.emptyState}>
//           <Text style={styles.emptyText}>
//             No {statusTab} orders found
//           </Text>
//         </View>
//       );
//     }

//     return groupedByDate.map(([date, orders]) => (
//       <View key={date}>
      
//         {orders.map(renderOrderCard)}
//       </View>
//     ));
//   };

//   // ── Main render ───────────────────────────────────────────────────────────

//   return (
//     <View style={styles.container}>
//       <Header title="All Orders" showBack={true} />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={() => fetchEarnings(true)}
//             tintColor={colors.primary}
//           />
//         }
//       >
//         {renderPeriodTabs()}
//         {renderDateSelector()}
//         {renderStatsCard()}

//         <View style={styles.orderHistorySection}>
//           <Text style={styles.sectionTitle}>Order History</Text>
//           {renderStatusTabs()}
//           {renderOrderList()}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// // ─── Styles ───────────────────────────────────────────────────────────────────

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//   },

//   // ── Period tabs
//   periodTabs: {
//     flexDirection: 'row',
//     paddingHorizontal: scale(16),
//     paddingVertical: scale(12),
//     gap: scale(8),
//   },
//   periodTab: {
//     flex: 1,
//     backgroundColor: colors.veryLightGrey,
//     paddingVertical: scale(10),
//     borderRadius: scale(8),
//     alignItems: 'center',
//   },
//   periodTabActive: {
//     backgroundColor: colors.secondary,
//   },
//   periodTabText: {
//     fontSize: moderateScale(14),
//     fontFamily: fonts.semiBold,
//     color: colors.darkText,
//   },
//   periodTabTextActive: {
//     color: colors.primary,
//   },

//   // ── Date selector
//   dateSelector: {
//     paddingHorizontal: scale(16),
//     paddingVertical: scale(8),
//     gap: scale(10),
//   },
//   dateBox: {
//     backgroundColor: colors.veryLightGrey,
//     borderRadius: scale(10),
//     paddingHorizontal: scale(14),
//     paddingVertical: scale(12),
//     alignItems: 'center',
//     minWidth: scale(56),
//   },
//   dateBoxActive: {
//     backgroundColor: colors.secondary,
//   },
//   dateDay: {
//     fontSize: moderateScale(12),
//     color: colors.mediumGrey,
//     marginBottom: scale(2),
//   },
//   dateNum: {
//     fontSize: moderateScale(16),
//     fontFamily: fonts.bold,
//     color: colors.darkText,
//   },
//   dateTextActive: {
//     color: colors.primary,
//   },

//   // ── Stats card
//   statsCard: {
//     flexDirection: 'row',
//     marginHorizontal: scale(16),
//     marginVertical: scale(16),
//     backgroundColor: colors.white,
//     borderRadius: scale(12),
//     borderWidth: 1,
//     borderColor: colors.divider,
//     paddingVertical: scale(16),
//   },
//   statItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   statValue: {
//     fontSize: moderateScale(20),
//     fontFamily: fonts.bold,
//     color: colors.darkText,
//     marginBottom: scale(4),
//   },
//   statLabel: {
//     fontSize: moderateScale(12),
//     color: colors.mediumGrey,
//   },
//   statDivider: {
//     width: 1,
//     backgroundColor: colors.divider,
//   },

//   // ── Order history section
//   orderHistorySection: {
//     paddingHorizontal: scale(16),
//     paddingBottom: scale(24),
//   },
//   sectionTitle: {
//     fontSize: moderateScale(16),
//     fontFamily: fonts.bold,
//     color: colors.darkText,
//     marginBottom: scale(12),
//   },

//   // ── Status tabs
//   statusTabs: {
//     flexDirection: 'row',
//     gap: scale(8),
//     marginBottom: scale(16),
//   },
//   statusTab: {
//     backgroundColor: colors.veryLightGrey,
//     paddingHorizontal: scale(16),
//     paddingVertical: scale(8),
//     borderRadius: scale(8),
//   },
//   statusTabActive: {
//     backgroundColor: colors.secondary,
//   },
//   statusTabText: {
//     fontSize: moderateScale(13),
//     fontFamily: fonts.semiBold,
//     color: colors.darkText,
//   },
//   statusTabTextActive: {
//     color: colors.primary,
//   },

//   // ── Date group header
//   dateHeader: {
//     fontSize: moderateScale(14),
//     fontFamily: fonts.semiBold,
//     color: colors.darkText,
//     marginBottom: scale(10),
//     marginTop: scale(4),
//   },

//   // ── Order card
//   orderCard: {
//     backgroundColor: colors.white,
//     borderRadius: scale(12),
//     borderWidth: 1,
//     borderColor: colors.divider,
//     padding: scale(14),
//     marginBottom: scale(12),
//   },
//   orderHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: scale(12),
//   },
//   orderTypeRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: scale(8),
//     flex: 1,
//     marginRight: scale(8),
//   },
//   orderType: {
//     fontSize: moderateScale(13),
//     fontFamily: fonts.semiBold,
//     color: colors.darkText,
//     flex: 1,
//   },
//   orderAmountRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: scale(6),
//   },
//   orderAmount: {
//     fontSize: moderateScale(15),
//     fontFamily: fonts.bold,
//     color: colors.green,
//   },

//   // ── Address rows
//   addressRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: scale(8),
//     marginBottom: scale(6),
//   },
//   addressContent: {
//     flex: 1,
//   },
//   addressName: {
//     fontSize: moderateScale(12),
//     fontFamily: fonts.semiBold,
//     color: colors.darkText,
//     marginBottom: scale(1),
//   },
//   addressText: {
//     fontSize: moderateScale(12),
//     color: colors.grey,
//   },

//   // ── Tip badge
//   tipRow: {
//     marginTop: scale(6),
//     alignSelf: 'flex-start',
//     backgroundColor: colors.veryLightGrey,
//     borderRadius: scale(6),
//     paddingHorizontal: scale(10),
//     paddingVertical: scale(4),
//   },
//   tipText: {
//     fontSize: moderateScale(12),
//     fontFamily: fonts.semiBold,
//     color: colors.primary,
//   },

//   // ── Empty / loader
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: scale(48),
//   },
//   emptyText: {
//     fontSize: moderateScale(14),
//     color: colors.mediumGrey,
//     fontFamily: fonts.semiBold,
//   },
//   loader: {
//     marginTop: scale(48),
//   },
// });

// export default AllOrdersScreen;





import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Bike, Calendar } from 'lucide-react-native';
import { colors } from '../utils/colors';
import fonts from '../utils/fonts/fontsList';
import { scale, moderateScale } from 'react-native-size-matters';
import Header from '../components/Header';
import { getDriverEarningsController } from '../MVC/controllers/driverEarningController';
import { useAuth } from '../MVC/context/AuthContext';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const pad = (n) => String(n).padStart(2, '0');

const toISODate = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const formatDisplayDate = (isoStr) => {
  const [y, m, day] = isoStr.split('-').map(Number);
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];
  return `${day} ${months[m - 1]} ${y}`;
};

const shortDayName = (isoStr) => {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const [y, m, d] = isoStr.split('-').map(Number);
  return days[new Date(y, m - 1, d).getDay()];
};

const subtractDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISODate(d);
};

const buildDateOptions = (count = 7) =>
  Array.from({ length: count }, (_, i) => {
    const iso = subtractDays(count - 1 - i);
    return {
      fullDate: iso,
      day: shortDayName(iso),
      date: String(Number(iso.split('-')[2])),
    };
  });

// ─── Constants ────────────────────────────────────────────────────────────────

const PERIOD_TABS  = ['day', 'week', 'month', 'custom'];
const STATUS_TABS  = ['completed', 'cancelled'];
const DATE_OPTIONS = buildDateOptions(7);
const TODAY        = toISODate(new Date());

// ─── Screen ───────────────────────────────────────────────────────────────────

const AllOrdersScreen = ({ navigation }) => {
  const { auth } = useAuth();

  const [periodTab,       setPeriodTab]       = useState('day');
  const [statusTab,       setStatusTab]       = useState('completed');
  const [selectedDate,    setSelectedDate]    = useState(TODAY);
  const [startDate,       setStartDate]       = useState(subtractDays(7));
  const [endDate,         setEndDate]         = useState(TODAY);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker,   setShowEndPicker]   = useState(false);
  const [earningsData,    setEarningsData]    = useState([]);
  const [apiSummary,      setApiSummary]      = useState(null);
  const [loading,         setLoading]         = useState(false);
  const [refreshing,      setRefreshing]      = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchEarnings = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);

    const orderStatus = statusTab === 'completed' ? 'delivered' : 'cancelled';
    const params = {
      'search[order_status]': orderStatus,
      delivery_partner_id: auth?.delivery_partner_id,
    };

    if (periodTab === 'custom') {
      params.date_type  = 'custom';
      params.start_date = startDate;
      params.end_date   = endDate;
    } else {
      params.date_type = periodTab;
      if (periodTab === 'day') params.date = selectedDate;
    }

    await getDriverEarningsController({
      params,
      onSuccess: (data, fullResponse) => {
        setEarningsData(data || []);
        setApiSummary(fullResponse?.data || null);
      },
    });

    isRefresh ? setRefreshing(false) : setLoading(false);
  }, [periodTab, statusTab, selectedDate, startDate, endDate]);

  useEffect(() => { fetchEarnings(); }, [fetchEarnings]);

  // ── Derived: trips grouped by date ────────────────────────────────────────

  /**
   * For TRIP-2026-00000001 with 2 orders:
   *
   *   Order #1  → pickup seq=2 (Culture Crust)  drop seq=4 (Vansajada)  $77 + $11.02 tip
   *   Order #6  → pickup seq=1 (Culture Crust)  drop seq=3 (SS Sparrow) $115.5 + $12.73 tip
   *
   *   Merged route sorted by sequence_number:
   *     seq 1 → pickup  (Order #6)
   *     seq 2 → pickup  (Order #1)
   *     seq 3 → drop    (Order #6)  → shows $128.23
   *     seq 4 → drop    (Order #1)  → shows $88.02
   *
   *   Trip total: $216.25  (from trip.total_earnings)
   */
  const groupedByDate = React.useMemo(() => {
    const targetStatus = statusTab === 'completed' ? 'delivered' : 'cancelled';
    const byDate = {};

    earningsData.forEach((earning) => {
      earning.trip_earnings?.forEach((te) => {
        const trip = te.delivery_trip;
        if (!trip) return;

        // Only keep orders matching the active status tab
        const matchingOrders = (trip.delivery_trip_orders ?? []).filter(
          (o) => o.status === targetStatus,
        );
        if (matchingOrders.length === 0) return;

        // Merge ALL stops from ALL matching orders into one flat array
        // then sort by sequence_number to get the real route order
        const route = [];
        matchingOrders.forEach((order) => {
          (order.delivery_route_stops ?? []).forEach((stop) => {
            route.push({
              ...stop,
              orderId:        order.id,
              orderStatus:    order.status,
              deliveryAmount: order.delivery_amount ?? 0,
              tipAmount:      order.tip_amount      ?? 0,
            });
          });
        });
        route.sort((a, b) => a.sequence_number - b.sequence_number);

        // Build a per-order amount lookup  { orderId → { deliveryAmount, tipAmount, total } }
        const orderAmounts = {};
        matchingOrders.forEach((o) => {
          orderAmounts[o.id] = {
            deliveryAmount: o.delivery_amount ?? 0,
            tipAmount:      o.tip_amount      ?? 0,
            total:         (o.delivery_amount ?? 0) + (o.tip_amount ?? 0),
          };
        });

        const tripEntry = {
          tripId:             trip.id,
          tripNumber:         trip.trip_number,
          tripStatus:         trip.status,
          totalEarnings:      trip.total_earnings       ?? 0,  // full trip total
          baseDeliveryAmount: trip.base_delivery_amount ?? 0,
          totalTips:          trip.total_tips           ?? 0,
          orderCount:         matchingOrders.length,
          route,         // stops in sequence order
          orderAmounts,  // per-order breakdown
          earningDate:   earning.earning_date,
        };

        if (!byDate[earning.earning_date]) byDate[earning.earning_date] = [];
        byDate[earning.earning_date].push(tripEntry);
      });
    });

    return Object.entries(byDate).sort(([a], [b]) => (a < b ? 1 : -1));
  }, [earningsData, statusTab]);

  // Summary stats
  const stats = React.useMemo(() => {
    if (apiSummary && periodTab !== 'day') {
      return {
        totalOrders:   apiSummary.total_orders_delivered ?? 0,
        totalEarnings: apiSummary.total_earnings         ?? 0,
      };
    }
    let orders = 0, earnings = 0;
    groupedByDate.forEach(([, trips]) => {
      trips.forEach((t) => {
        orders   += t.orderCount;
        earnings += t.totalEarnings;
      });
    });
    return { totalOrders: orders, totalEarnings: earnings };
  }, [apiSummary, groupedByDate, periodTab]);

  // ── Render helpers ────────────────────────────────────────────────────────

  const renderPeriodTabs = () => (
    <View style={styles.periodTabs}>
      {PERIOD_TABS.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.periodTab, periodTab === tab && styles.periodTabActive]}
          onPress={() => setPeriodTab(tab)}
          activeOpacity={0.7}
        >
          <Text style={[styles.periodTabText, periodTab === tab && styles.periodTabTextActive]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDateSelector = () => {
    if (periodTab !== 'day') return null;
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateSelector}
      >
        {DATE_OPTIONS.map((item) => {
          const isActive = selectedDate === item.fullDate;
          return (
            <TouchableOpacity
              key={item.fullDate}
              style={[styles.dateBox, isActive && styles.dateBoxActive]}
              onPress={() => setSelectedDate(item.fullDate)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dateDay, isActive && styles.dateTextActive]}>{item.day}</Text>
              <Text style={[styles.dateNum, isActive && styles.dateTextActive]}>{item.date}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderCustomDateRange = () => {
    if (periodTab !== 'custom') return null;
    const startDateObj = new Date(startDate + 'T00:00:00');
    const endDateObj   = new Date(endDate   + 'T00:00:00');

    return (
      <View style={styles.customRangeContainer}>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => { setShowEndPicker(false); setShowStartPicker(true); }}
          activeOpacity={0.7}
        >
          <Calendar size={14} color={colors.primary} />
          <View style={styles.datePickerContent}>
            <Text style={styles.datePickerLabel}>From</Text>
            <Text style={styles.datePickerValue}>{formatDisplayDate(startDate)}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => { setShowStartPicker(false); setShowEndPicker(true); }}
          activeOpacity={0.7}
        >
          <Calendar size={14} color={colors.primary} />
          <View style={styles.datePickerContent}>
            <Text style={styles.datePickerLabel}>To</Text>
            <Text style={styles.datePickerValue}>{formatDisplayDate(endDate)}</Text>
          </View>
        </TouchableOpacity>

        {showStartPicker && (
          <DateTimePicker
            value={startDateObj}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            maximumDate={endDateObj}
            onChange={(event, date) => {
              if (Platform.OS === 'android') setShowStartPicker(false);
              if (event.type === 'set' && date) setStartDate(toISODate(date));
            }}
          />
        )}
        {showStartPicker && Platform.OS === 'ios' && (
          <TouchableOpacity style={styles.pickerDoneButton} onPress={() => setShowStartPicker(false)}>
            <Text style={styles.pickerDoneText}>Done</Text>
          </TouchableOpacity>
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDateObj}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            minimumDate={startDateObj}
            maximumDate={new Date()}
            onChange={(event, date) => {
              if (Platform.OS === 'android') setShowEndPicker(false);
              if (event.type === 'set' && date) setEndDate(toISODate(date));
            }}
          />
        )}
        {showEndPicker && Platform.OS === 'ios' && (
          <TouchableOpacity style={styles.pickerDoneButton} onPress={() => setShowEndPicker(false)}>
            <Text style={styles.pickerDoneText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderStatsCard = () => (
    <View style={styles.statsCard}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.totalOrders}</Text>
        <Text style={styles.statLabel}>
          {statusTab === 'completed' ? 'Completed Orders' : 'Cancelled Orders'}
        </Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statValue}>${stats.totalEarnings.toFixed(2)}</Text>
        <Text style={styles.statLabel}>Total Earnings</Text>
      </View>
    </View>
  );

  const renderStatusTabs = () => (
    <View style={styles.statusTabs}>
      {STATUS_TABS.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.statusTab, statusTab === tab && styles.statusTabActive]}
          onPress={() => setStatusTab(tab)}
          activeOpacity={0.7}
        >
          <Text style={[styles.statusTabText, statusTab === tab && styles.statusTabTextActive]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  /**
   * One card per trip.
   * Shows route stops in sequence order.
   * Each DROP stop shows its individual order amount + tip.
   * Footer shows total order count + trip.total_earnings.
   */
  const renderTripCard = (trip) => (
    <View key={trip.tripId} style={styles.tripCard}>

      {/* Trip header */}
      <View style={styles.tripHeader}>
        <Bike size={15} color={colors.darkText} />
        <Text style={styles.tripNumber} numberOfLines={1}>
          {trip.tripNumber}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Route stops */}
      {trip.route.map((stop, index) => {
        const isPickup = stop.stop_type === 'pickup';
        const isLast   = index === trip.route.length - 1;
        const amounts  = trip.orderAmounts[stop.orderId];

        return (
          <View key={`${stop.id}-${index}`} style={styles.routeRow}>

            {/* Dot + connector */}
            <View style={styles.routeLineCol}>
              <View style={[styles.routeDot, isPickup ? styles.dotPickup : styles.dotDrop]}>
                <Text style={styles.dotLabel}>{isPickup ? 'P' : 'D'}</Text>
              </View>
              {!isLast && <View style={styles.routeConnector} />}
            </View>

            {/* Stop detail */}
            <View style={[styles.routeContent, !isLast && styles.routeContentSpaced]}>
              {stop.place_name ? (
                <Text style={styles.stopName}>{stop.place_name}</Text>
              ) : null}
              <Text style={styles.stopAddress} numberOfLines={2}>
                {stop.address}
              </Text>

              {/* Per-order amount — only on drop stops */}
              {!isPickup && amounts && (
                <View style={styles.orderAmountRow}>
                  <Text style={styles.orderIdText}>Order #{stop.orderId}</Text>
                  <View style={styles.orderAmountBadge}>
                    <Text style={styles.orderAmountText}>
                      ${amounts.deliveryAmount.toFixed(2)}
                    </Text>
                  </View>
                  {amounts.tipAmount > 0 && (
                    <View style={styles.tipBadge}>
                      <Text style={styles.tipText}>
                        + Tip ${amounts.tipAmount.toFixed(2)}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.orderTotalText}>
                    = ${amounts.total.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        );
      })}

      <View style={styles.divider} />

      {/* Trip footer */}
      <View style={styles.tripFooter}>
        <Text style={styles.tripOrderCount}>
          {trip.orderCount} order{trip.orderCount !== 1 ? 's' : ''}
        </Text>
        <View style={styles.tripTotalCol}>
          {trip.totalTips > 0 && (
            <Text style={styles.tripTipText}>
              incl. tip ${trip.totalTips.toFixed(2)}
            </Text>
          )}
          <Text style={styles.tripTotalAmount}>
            ${trip.totalEarnings.toFixed(2)}
          </Text>
        </View>
      </View>

    </View>
  );

  const renderOrderList = () => {
    if (loading) {
      return (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      );
    }

    if (groupedByDate.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No {statusTab} orders found</Text>
        </View>
      );
    }

    return groupedByDate.map(([date, trips]) => (
      <View key={date}>
        <Text style={styles.dateHeader}>{formatDisplayDate(date)}</Text>
        {trips.map(renderTripCard)}
      </View>
    ));
  };

  // ── Main render ───────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <Header title="All Orders" showBack={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchEarnings(true)}
            tintColor={colors.primary}
          />
        }
      >
        {renderPeriodTabs()}
        {renderDateSelector()}
        {renderCustomDateRange()}
        {renderStatsCard()}

        <View style={styles.orderHistorySection}>
          <Text style={styles.sectionTitle}>Order History</Text>
          {renderStatusTabs()}
          {renderOrderList()}
        </View>
      </ScrollView>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },

  periodTabs: { flexDirection: 'row', paddingHorizontal: scale(16), paddingVertical: scale(12), gap: scale(8) },
  periodTab: { flex: 1, backgroundColor: colors.veryLightGrey, paddingVertical: scale(10), borderRadius: scale(8), alignItems: 'center' },
  periodTabActive: { backgroundColor: colors.secondary },
  periodTabText: { fontSize: moderateScale(13), fontFamily: fonts.semiBold, color: colors.darkText },
  periodTabTextActive: { color: colors.primary },

  dateSelector: { paddingHorizontal: scale(16), paddingVertical: scale(8), gap: scale(10) },
  dateBox: { backgroundColor: colors.veryLightGrey, borderRadius: scale(10), paddingHorizontal: scale(14), paddingVertical: scale(12), alignItems: 'center', minWidth: scale(56) },
  dateBoxActive: { backgroundColor: colors.secondary },
  dateDay: { fontSize: moderateScale(12), color: colors.mediumGrey, marginBottom: scale(2) },
  dateNum: { fontSize: moderateScale(16), fontFamily: fonts.bold, color: colors.darkText },
  dateTextActive: { color: colors.primary },

  customRangeContainer: { marginHorizontal: scale(16), marginTop: scale(4), marginBottom: scale(8) },
  datePickerButton: { flexDirection: 'row', alignItems: 'center', gap: scale(10), backgroundColor: colors.veryLightGrey, borderRadius: scale(10), paddingHorizontal: scale(14), paddingVertical: scale(12), marginBottom: scale(8) },
  datePickerContent: { flex: 1 },
  datePickerLabel: { fontSize: moderateScale(11), color: colors.mediumGrey, marginBottom: scale(2) },
  datePickerValue: { fontSize: moderateScale(14), fontFamily: fonts.semiBold, color: colors.darkText },
  pickerDoneButton: { alignSelf: 'flex-end', backgroundColor: colors.secondary, borderRadius: scale(8), paddingHorizontal: scale(20), paddingVertical: scale(8), marginTop: scale(4), marginBottom: scale(8) },
  pickerDoneText: { fontSize: moderateScale(14), fontFamily: fonts.semiBold, color: colors.primary },

  statsCard: { flexDirection: 'row', marginHorizontal: scale(16), marginVertical: scale(16), backgroundColor: colors.white, borderRadius: scale(12), borderWidth: 1, borderColor: colors.divider, paddingVertical: scale(16) },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: moderateScale(20), fontFamily: fonts.bold, color: colors.darkText, marginBottom: scale(4) },
  statLabel: { fontSize: moderateScale(12), color: colors.mediumGrey },
  statDivider: { width: 1, backgroundColor: colors.divider },

  orderHistorySection: { paddingHorizontal: scale(16), paddingBottom: scale(24) },
  sectionTitle: { fontSize: moderateScale(16), fontFamily: fonts.bold, color: colors.darkText, marginBottom: scale(12) },

  statusTabs: { flexDirection: 'row', gap: scale(8), marginBottom: scale(16) },
  statusTab: { backgroundColor: colors.veryLightGrey, paddingHorizontal: scale(16), paddingVertical: scale(8), borderRadius: scale(8) },
  statusTabActive: { backgroundColor: colors.secondary },
  statusTabText: { fontSize: moderateScale(13), fontFamily: fonts.semiBold, color: colors.darkText },
  statusTabTextActive: { color: colors.primary },

  dateHeader: { fontSize: moderateScale(14), fontFamily: fonts.semiBold, color: colors.darkText, marginBottom: scale(10), marginTop: scale(4) },

  // Trip card
  tripCard: { backgroundColor: colors.white, borderRadius: scale(12), borderWidth: 1, borderColor: colors.mediumGrey, marginBottom: scale(14), overflow: 'hidden' },

  tripHeader: { flexDirection: 'row', alignItems: 'center', gap: scale(8), paddingHorizontal: scale(14), paddingVertical: scale(12) },
  tripNumber: { fontSize: moderateScale(13), fontFamily: fonts.semiBold, color: colors.darkText, flex: 1 },

  divider: { height: 1, backgroundColor: colors.divider },

  // Route
  routeRow: { flexDirection: 'row', paddingHorizontal: scale(14), paddingTop: scale(12) },
  routeLineCol: { alignItems: 'center', width: scale(26), marginRight: scale(10) },
  routeDot: { width: scale(22), height: scale(22), borderRadius: scale(11), alignItems: 'center', justifyContent: 'center' },
  dotPickup: { backgroundColor: colors.mediumGrey ?? '#888' },
  dotDrop:   { backgroundColor: colors.primary },
  dotLabel:  { fontSize: moderateScale(10), fontFamily: fonts.bold, color: colors.white },
  routeConnector: { width: 1.5, flex: 1, minHeight: scale(18), backgroundColor: colors.divider, marginTop: scale(3) },
  routeContent: { flex: 1 },
  routeContentSpaced: { paddingBottom: scale(12) },
  stopName: { fontSize: moderateScale(13), fontFamily: fonts.semiBold, color: colors.darkText, marginBottom: scale(2) },
  stopAddress: { fontSize: moderateScale(12), color: colors.grey, lineHeight: moderateScale(17) },

  // Per-order amount (on drop stops)
  orderAmountRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: scale(5), marginTop: scale(6), marginBottom: scale(2) },
  orderIdText: { fontSize: moderateScale(11), color: colors.mediumGrey, fontFamily: fonts.semiBold },
  orderAmountBadge: { backgroundColor: colors.secondary, borderRadius: scale(6), paddingHorizontal: scale(8), paddingVertical: scale(3) },
  orderAmountText: { fontSize: moderateScale(12), fontFamily: fonts.bold, color: colors.primary },
  tipBadge: { backgroundColor: colors.veryLightGrey, borderRadius: scale(6), paddingHorizontal: scale(8), paddingVertical: scale(3) },
  tipText: { fontSize: moderateScale(11), fontFamily: fonts.semiBold, color: colors.mediumGrey },
  orderTotalText: { fontSize: moderateScale(12), fontFamily: fonts.bold, color: colors.green },

  // Trip footer
  tripFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: scale(14), paddingVertical: scale(12) },
  tripOrderCount: { fontSize: moderateScale(12), color: colors.mediumGrey, fontFamily: fonts.semiBold },
  tripTotalCol: { alignItems: 'flex-end' },
  tripTipText: { fontSize: moderateScale(11), color: colors.mediumGrey, marginBottom: scale(1) },
  tripTotalAmount: { fontSize: moderateScale(16), fontFamily: fonts.bold, color: colors.green },

  emptyState: { alignItems: 'center', paddingVertical: scale(48) },
  emptyText: { fontSize: moderateScale(14), color: colors.mediumGrey, fontFamily: fonts.semiBold },
  loader: { marginTop: scale(48) },
});

export default AllOrdersScreen;
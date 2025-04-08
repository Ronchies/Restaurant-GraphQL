import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { FontAwesome5 } from '@expo/vector-icons';
import globalStyles from '../../assets/styles/globalStyles'; // Update the path as needed

export default function Tab() {
  // Mock data
  const orderData = [
    { id: '1', table: '3', time: '10:30:00 AM', status: 'Served' },
    { id: '1', table: '3', time: '10:30:00 AM', status: 'Served' },
    { id: '1', table: '3', time: '10:30:00 AM', status: 'Served' },
  ];

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        data: [2000, 4500, 3500, 5500, 4000, 6000, 4500],
      },
    ],
  };

  const screenWidth = Dimensions.get('window').width - 40;

  return (
    <ScrollView style={globalStyles.layout.scrollView}>
      <View style={globalStyles.layout.container}>
        {/* Header with Overview and Profile */}
        <View style={globalStyles.layout.header}>
          <View style={globalStyles.buttons.overview}>
            <Text style={globalStyles.buttons.overviewText}>Overview</Text>
          </View>
          <View style={globalStyles.layout.headerRight}>
            <View style={globalStyles.icons.bell}>
              <FontAwesome5 name="bell" size={24} color="black" />
            </View>
            <View style={globalStyles.icons.profile}>
              <Text style={globalStyles.text.profileText}>👤</Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={{ marginBottom: globalStyles.spacing.large }}>
          <View style={globalStyles.layout.spaceBetween}>
            <View style={globalStyles.cards.stats}>
              <View style={globalStyles.icons.statsBlue}>
                <Text style={{ fontSize: globalStyles.typography.fontSize.large }}>📋</Text>
              </View>
              <View>
                <Text style={globalStyles.text.statsLabel}>Active Orders</Text>
                <Text style={globalStyles.text.statsValue}>456</Text>
              </View>
            </View>

            <View style={globalStyles.cards.stats}>
              <View style={globalStyles.icons.statsBlue}>
                <Text style={{ fontSize: globalStyles.typography.fontSize.large }}>🍽️</Text>
              </View>
              <View>
                <Text style={globalStyles.text.statsLabel}>Available Tables</Text>
                <Text style={globalStyles.text.statsValue}>10</Text>
              </View>
            </View>
          </View>

          <View style={{ ...globalStyles.layout.spaceBetween, marginTop: globalStyles.spacing.large }}>
            <View style={globalStyles.cards.stats}>
              <View style={globalStyles.icons.statsBlue}>
                <Text style={{ fontSize: globalStyles.typography.fontSize.large }}>$</Text>
              </View>
              <View>
                <Text style={globalStyles.text.statsLabel}>Total Revenue</Text>
                <Text style={globalStyles.text.statsValue}>50,000k</Text>
              </View>
            </View>

            <View style={globalStyles.cards.stats}>
              <View style={globalStyles.icons.statsBlue}>
                <Text style={{ fontSize: globalStyles.typography.fontSize.large }}>$</Text>
              </View>
              <View>
                <Text style={globalStyles.text.statsLabel}>Today's Sales</Text>
                <Text style={globalStyles.text.statsValue}>50,000k</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Status Section */}
        <View style={globalStyles.cards.standard}>
          <Text style={globalStyles.text.sectionTitle}>Order Status</Text>
          
          {orderData.map((order, index) => (
            <View key={index} style={globalStyles.listItems.order}>
              <View style={globalStyles.listItems.orderInfo}>
                <Text style={globalStyles.text.orderTitle}>Order #{order.id} - Table {order.table}</Text>
                <Text style={globalStyles.text.orderTime}>{order.time}</Text>
              </View>
              <View style={globalStyles.listItems.orderActions}>
                <View style={globalStyles.badges.success}>
                  <Text style={globalStyles.text.statusText}>{order.status}</Text>
                </View>
                <View style={globalStyles.buttons.view}>
                  <Text style={globalStyles.buttons.viewText}>View</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Monthly Revenue Chart */}
        <View style={globalStyles.cards.standard}>
          <Text style={globalStyles.text.sectionTitle}>Monthly Revenue</Text>
          <LineChart
            data={monthlyData}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: globalStyles.colors.white,
              backgroundGradientFrom: globalStyles.colors.white,
              backgroundGradientTo: globalStyles.colors.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: globalStyles.borderRadius.xlarge,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#0066cc',
              },
            }}
            bezier
            style={globalStyles.charts.standard}
          />
        </View>
      </View>
    </ScrollView>
  );
}
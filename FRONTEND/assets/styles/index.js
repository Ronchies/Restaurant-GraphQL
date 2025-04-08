import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellContainer: {
    marginRight: 15,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#55b9f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 24,
    color: '#ffffff',
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '48%',
    alignItems: 'center',
  },
  statsIconBlue: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statsIconText: {
    fontSize: 20,
  },
  statsLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 5,
  },
  statsValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderTime: {
    fontSize: 12,
    color: '#888888',
  },
  orderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#e6f9e6',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
  },
  statusText: {
    color: '#4caf50',
    fontSize: 12,
  },
  viewButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  },
});

export default styles;
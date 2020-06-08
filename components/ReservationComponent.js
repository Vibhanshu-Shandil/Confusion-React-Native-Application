import React, { Component } from 'react';
import { Text, View, StyleSheet, Picker, Switch, Button, Alert, Platform } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Animatable from 'react-native-animatable';
import * as Calendar from 'expo-calendar';

class Reservation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guests: 1, 
            smoking: false,
            date: ''
        }
    }

    static navigationOption = {
        title: 'Reserve Table',
    };

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: ''
        });
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }

    async obtainCalenderPermission() {
        let permission = await Calendar.requestCalendarPermissionsAsync();
        if (permission.status === 'granted') {
            return true;
        }
        return false;
    }

    async addReservationToCalender(date) {
        const calendarPermission = this.obtainCalenderPermission;
        let calendar = null;
        if (Platform.OS === 'ios') {
            calendar = await Calendar.getDefaultCalendarAsync();
          } else {
            const calendars = await Calendar.getCalendarsAsync();
            calendar = (calendars) ?
              (calendars.find(el => el.isPrimary) || calendars[0])
              : null;
          }
  
          let calendarId = null;
          if (calendar !== null) {
              calendarId = calendar.id;
          } else {
              calendarId = null;
          }
  
          let start = new Date(Date.parse(date));
          let end = new Date((Date.parse(date)) + (2*60*60*1000));
  
          if (calendarPermission && calendarId !== null) {
              let event = await Calendar.createEventAsync(calendarId, {
                  title: 'Con Fusion Table Reservation',
                  startDate: start,
                  endDate: end,
                  timeZone: 'Asia/Hong_Kong',
                  location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
              })
              .then( event => {
                  console.log('success', event);
              })
              .catch( error => {
                  console.log('failure', error);
              });
          }
    }

    render() {
        const date = new Date();
        const handleReservation = () => 
                    Alert.alert(
                        'Your Reservation OK?',
                        `Number of Guests: ${this.state.guests}\nSmoking? ${this.state.smoking ? 'Yes' : 'No'}\nDate and Time: ${this.state.date}`,
                        [
                            { 
                                text: 'Cancel', 
                                onPress: () => this.resetForm(),
                                style: ' cancel'
                            },
                            {
                                text: 'OK',
                                onPress: () => {                                    
                                    this.presentLocalNotification(this.state.date);
                                    this.addReservationToCalender(this.state.date);
                                    this.resetForm();  
                                }
                            }
                        ],
                        { cancelable: false }
                    );
                    

        return(
            <Animatable.View animation="zoomIn" duration={2000} delay={1000}>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Number of Guests</Text>
                    <Picker
                        style={styles.formItem}
                        selectedValue={this.state.guests}
                        onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}>
                        <Picker.Item label="1" value="1" />
                        <Picker.Item label="2" value="2" />
                        <Picker.Item label="3" value="3" />
                        <Picker.Item label="4" value="4" />
                        <Picker.Item label="5" value="5" />
                        <Picker.Item label="6" value="6" />
                    </Picker>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                    <Switch
                        style={styles.formItem}
                        value={this.state.smoking}
                        onTintColor='#512DA8'
                        onValueChange={(value) => this.setState({smoking: value})}>
                    </Switch>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Date and Time</Text>
                    <DatePicker
                        style={{flex: 2, marginRight: 20}}
                        date={this.state.date}
                        format=''
                        mode="datetime"
                        placeholder="select date and Time"
                        minDate={date.toString()}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                        }}
                        onDateChange={(date) => {this.setState({date: date})}}
                    />
                </View>
                <View style={styles.formRow}>
                    <Button
                    onPress={handleReservation}
                    title="Reserve"
                    color="#512DA8"
                    accessibilityLabel="Learn more about this purple button"
                    />
                </View>
            </Animatable.View>
        );
    }
};

const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
     },
     modalTitle: {
         fontSize: 24,
         fontWeight: 'bold',
         backgroundColor: '#512DA8',
         textAlign: 'center',
         color: 'white',
         marginBottom: 20
     },
     modalText: {
         fontSize: 18,
         margin: 10
     }
});

export default Reservation;
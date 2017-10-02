const Homey = require('homey');
const bleManager = Homey.wireless('ble');

class Braava240Driver extends Homey.Driver {

    // onPair( socket ) {

    //     var devices = [
    //         {
    //             "name": "My Device",
    //             "data": { "id": "abcd" }
    //         }
    //     ]

    //     socket.on('list_devices', function( data, callback ) {

    //         // emit when devices are still being searched
    //         socket.emit('list_devices', devices );

    //         // fire the callback when searching is done
    //         callback( null, devices );    

    //         // when no devices are found, return an empty array
    //         callback( null, [] );

    //         // or fire a callback with Error to show that instead
    //         callback( new Error('Something bad has occured!') );        

    //     });

    // }

    // alternatively, use the shorthand method
    onPairListDevices(data, callback) {

        let devices = []
        // let devices = [
        //     {
        //         "name": "My Device",
        //         "data": { "id": "abcd" }
        //     }
        // ]

        bleManager.discover([], 5000, (err, advertisements) => {
            console.log('DISCOVER', advertisements.length);

            advertisements = advertisements || [];
            advertisements = advertisements.filter(advertisement => !this.getDevice(advertisement.uuid));
            if (advertisements.length === 0) {
                return callback(null, []);
            }
            let failedCount = 0;
            advertisements.forEach(advertisement => {
                console.log('checking advertisement', advertisement.uuid, advertisement.serviceUuids);
                devices.push({ "name": advertisement.name, "data": { "id": advertisement.uuid } })
                // if (advertisement.serviceUuids.some(uuid => uuid === this.SERVICE_CONTROL)) {
                //     console.log('connecting to', advertisement);
                //     advertisement.connect((err, peripheral) => {
                //         if (err) {
                //             if (++failedCount === advertisements.length) {
                //                 console.log('called callback 1', failedCount, advertisements.length);
                //                 callback(null, []);
                //             }
                //             return;
                //         }
                //         peripheral.read(SERVICE_MANUFACTURER, CHAR_SERIALNR, (err, serialNumber) => {
                //             console.log('serialnr', err, (serialNumber || '').toString());
                //             if (err || (serialNumber || '').toString().indexOf(this.SERIAL_NR) !== 0) {
                //                 peripheral.disconnect();
                //                 if (++failedCount === advertisements.length) {
                //                     console.log('called callback 2', failedCount, advertisements.length);
                //                     callback(null, []);
                //                 }
                //                 return;
                //             }
                //             const deviceData = {
                //                 data: {
                //                     id: peripheral.uuid,
                //                 },
                //             };

                //             const listDevice = () => {
                //                 const onNameRead = (err, name) => {
                //                     peripheral.disconnect();
                //                     if (err) {
                //                         if (++failedCount === advertisements.length) {
                //                             console.log('called callback 3', failedCount, advertisements.length);
                //                             callback(null, []);
                //                         }
                //                         return;
                //                     }
                //                     deviceData.name = name.toString();
                //                     if (callback) {
                //                         console.log('RETURN CLALBACK', [deviceData]);
                //                         callback(null, [deviceData]);
                //                         callback = null;
                //                     } else {
                //                         console.log('EMIT DEVICE', [deviceData]);
                //                         socket.emit('list_devices', [deviceData]);
                //                     }
                //                 };
                //                 if (isNaN(deviceData.data.NAME_HANDLE)) {
                //                     peripheral.read(this.SERVICE_CONTROL, CHAR_NAME, onNameRead);
                //                 } else {
                //                     peripheral.readHandle(deviceData.data.NAME_HANDLE, onNameRead);
                //                 }
                //             };

                //             peripheral.getService(this.SERVICE_CONTROL, (err, service) => {
                //                 if (service) {
                //                     service.discoverCharacteristics((err, characteristics) => {
                //                         if (characteristics) {
                //                             characteristics.forEach(characteristic => {
                //                                 if (typeof characteristic.handle === 'number') {
                //                                     if (characteristic.uuid === CHAR_COLOR) {
                //                                         deviceData.data.COLOR_HANDLE = characteristic.handle;
                //                                     } else if (characteristic.uuid === CHAR_EFFECT) {
                //                                         deviceData.data.EFFECT_HANDLE = characteristic.handle;
                //                                     } else if (characteristic.uuid === CHAR_NAME) {
                //                                         deviceData.data.NAME_HANDLE = characteristic.handle;
                //                                     }
                //                                 }
                //                             });
                //                         }
                //                         listDevice();
                //                     });
                //                 } else {
                //                     listDevice();
                //                 }
                //             });
                //         });
                //     });
                // } else if (++failedCount === advertisements.length) {
                //     console.log('called callback 0', failedCount, advertisements.length);
                //     callback(null, []);
                // }
            });
        });

        callback(null, devices);

    }

}

module.exports = Braava240Driver;
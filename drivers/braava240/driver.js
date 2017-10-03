const SERVICE_UUID = '5cf821a18df2';
const SERVICE_MANUFACTURER = '180a';

const Homey = require('homey');
const bleManager = Homey.ManagerBLE;

class Braava240Driver extends Homey.Driver {

	constructor(config) {
		this.PERIPHERAL_UUID = config.PERIPHERAL_UUID;
		this.SERVICE_CONTROL = config.SERVICE_CONTROL;

		this.devices = new Map();
		this.state = new Map();
		this.setColorLock = new Map();
    }

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
            advertisements = advertisements.filter(advertisement => advertisement.uuid == SERVICE_UUID);
            if (advertisements.length === 0) {
                return callback(null, []);
            }
            let failedCount = 0;
            advertisements.forEach(advertisement => {
                console.log('checking advertisement', advertisement.uuid, advertisement.serviceUuids);
                devices.push({ "name": advertisement.localName, "data": { "id": advertisement.uuid } })
                console.log('DISCOVER', advertisement.id, advertisement.uuid, advertisement.address, advertisement.addressType, advertisement.connectable, advertisement.localName, advertisement.manufacturerData, advertisement.serviceData, advertisement.serviceUuids, advertisement.rssi);
                advertisement.printInfo((err, infoString) => {
                    console.log(infoString)
                })
                advertisement.connect((err, peripheral) => {
                    console.log(peripheral)
                    peripheral.uuid
                    peripheral.discoverAllServicesAndCharacteristics((err, services) => {
                        services.forEach(service => {
                            console.log(service)
                        })
                    })
                    peripheral.disconnect()
                })
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

            callback(null, devices);
        });
    }

}

module.exports = Braava240Driver;
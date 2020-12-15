const BLE_ERROR_SERVICE_UUID = 0x1200;
const BLE_ERROR_CHARACTERISTIC_UUID = 0x1201;
const BLE_PPG_SERVICE_UUID = 0x1165;
const BLE_PPG_CHARACTERISTIC_UUID = 0x1166;
let errorStatus;

async function onConnectButtonClick() {
  console.log("Requesting any Bluetooth device...");
  const device = await navigator.bluetooth.requestDevice({
    // open dialog for the user to pair with a device
    acceptAllDevices: true,
    optionalServices: [BLE_ERROR_SERVICE_UUID],
  });
  console.log("Requested " + device.name + " (" + device.id + ")");

  const server = await device.gatt.connect(); // Connects to the chosen device
  console.log("server", server);

  const service = await server.getPrimaryService(BLE_ERROR_SERVICE_UUID); // Get the selected service
  console.log("service", service);

  const errorCharacteristic = await service.getCharacteristic(BLE_ERROR_CHARACTERISTIC_UUID); // Get the selected characteristic
  console.log("characteristic", errorCharacteristic);

  const value = await errorCharacteristic.readValue(); // Read the error buffer
  const IMUError = value.getUint8(0); // Extract the value for each sensors
  const PPGError = value.getUint8(1);
  console.log('IMUError: ', IMUError, ' PPGError: ', PPGError)
  document.getElementById("IMU-state").classList = IMUError ? "status-ko" : "status-ok"; // Update DOM
  document.getElementById("PPG-state").classList = PPGError ? "status-ko" : "status-ok";

  //   await errorCharacteristic.startNotifications() // Enable notification from the characteristic
  //   console.log('Notifications started')
  //   errorCharacteristic.addEventListener('characteristicvaluechanged', handleErrorNotifications)
}

window.onload = () => {
  // wait for the page to load so that the DOM elements are available
  console.log(navigator.bluetooth ? "Web-BLE Available" : "Web-BLE Unavailable");
  document.getElementById("connect-btn").addEventListener("click", onConnectButtonClick);
};

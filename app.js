const { Vue, Highcharts, HighchartsVue, ChartModuleMore, HCSoldGauge, draggable, createRouter, createWebHashHistory, createI18n } = Bundle;
// console.log(Bundle)

const app = Vue.createApp({
  data() {
    return {
    tabs: [
      {
        name: 'Data log',
        settings: ['showLatestData'],
        data: []
      },
      {
        name: 'Received',
        settings: ['showLatestData'],
        data: []
      },
      {
        name: 'Sent',
        settings: ['showLatestData'],
        data: []
      },
    ],
    activePage: 'Home',
    // activePage: 'Projects',
    device: null,
    fakeInput: null,
    intervalTime: 5,
    intervalId: null,
    isConnectedWebUSB: false,
    isConnectedWebUSBProgress: false,
    isLogging: false,
    isSending: false,
    isSheetListVisible: false,
    isSpreadsheetLoading: false,
    liveData: [],
    spreadSheetUrl: '',
    spreadsheetError: '',
    spreadsheetName: '',
    sheets: [],
    sheetName: '',
    momentFormat: 'YYYY-MM-DDTHH:mm:ss',
    isModalActive: false,
    modalTitle: '',
    modalBody: '',
    isConnectModalActive: false,
    isConnectedBluetooth: false,
    isConnectedBluetoothProgress: false,
    keysPressed: '',
    dataTransferStatus: true,
    keyboardReading: true,
    keyboardReadingLastState: true,
    stringToSend: '',
    receivedStringBuffer: '',
    measurementsData: [],
    measurementsLastRow: [],
    receivedData: [],
    settings: {
      bluetoothSendInterval: 300,
      webUSBSendInterval: 300,
      consoleVisible: true,
      isMockDataButtonVisible: false,
      synchronisationEnabled: true
    },
    isConfirmationVisible: false,
    confirmationText: '',
    connectionTime: null,
    HighchartsColors: Highcharts.getOptions().colors,
  }},
  created() {
    if (!this.isBrowserSupported) {
      this.showWarningNotSupportedBrowser()
    }

    var key = [];

    document.addEventListener('keydown', (event) => {
      var e = e || event;
      key[e.keyCode] = e.type == 'keydown';
    })

    document.addEventListener('keyup', (event) => {
      var e = e || event;
      key[e.keyCode] = e.type == 'keydown';
    })

    let lastPressed = '';
    let self = this;
    (function loop() {
      // ctx.clearRect(0,0,W,H);
      var y = 0, l = key.length, i, t;
      let pressed = '';
      for (i = 0; i < l; i++) {
        if (key[i]) {
          t = i + ' (0x' + i.toString(16) + ')';
          // ctx.fillText(t,canvas.width/2,y);
          pressed += i + ';';
          y += 22;
        }
      }

      if (pressed != lastPressed) {
        lastPressed = pressed;
        self.keysPressed = pressed;
      }
      setTimeout(loop, 1000 / 24);
    })();

    this.getLocalSettings('settings', this)

    if (!this.settings.hasOwnProperty('synchronisationEnabled')){
      this.settings.synchronisationEnabled = true;
    }

    // Language
    i18n.global.locale = 'en'
  },
  computed: {
    isBrowserSupported() {
      return true;
      var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
      var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);
      var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

      return isChrome || isEdgeChromium || isOpera;
    },
    addTimestamp() {
      return this.consoleSettings.includes('addTimestamp')
    },
    isReceivingData() {
      return this.dataTransferStatus;
    },
    isTransmittingData() {
      return this.dataTransferStatus;
    }
  },
  watch: {
    keysPressed(data) {
      if (!this.keyboardReading){
        return;
      }

      // Sorting keys codes
      let array = data.split(';');
      array.pop()
      array.sort()
      let out = array.join(';') + ';';

      this.sendData(out)
    },
    settings: {
      deep: true,
      handler(newVal){
        // Saving settings in Local Storage.
        localStorage.setItem('settings', JSON.stringify(this.settings));
      }
    }
  },
  methods: {
    getLocalSettings(name, target){
      let localStorage = window.localStorage;
      let localStorageData = localStorage.getItem(name);
      // console.log('localStorageData', localStorageData)
      if (localStorageData){
        try {
          target[name] = JSON.parse(localStorageData);
        } catch(err){
          console.log(err)
        }
      }
    },
    processData(row) {
      let data = row.split(',');

      // Sometimes from WebUSB a letter is send.
      if (/^[a-zA-Z]+\d+/.test(data[0])){
        return
      }

      data = data.map((x, i) => {
        if (i >= 0){
          if (x == 'null' || x == '' || x == '-Infinity' || x == 'NaN'){
            return null
          } else {
            return Number(x)
          }
        } else {
          return x
        }
      });

      if (data[0] == 0){
        return
      }

      // Synchronise data time with current time.
      if (!this.connectionTime){
        let m = moment().local();
        this.connectionTime = m.format("x") - data[0];
      }

      data[0] += this.connectionTime

      if (data.length > 1){
        if (this.dataTransferStatus) {
          this.measurementsData.push(data)
          this.measurementsLastRow = data;
        }
      } else {
        this.receivedData.push(row)
      }
    },
    showWarningNotSupportedBrowser() {
      this.modalTitle = 'Warning';
      this.modalBody = 'Communication between micro:bit and PC is available only in browsers: Chrome, Edge and Opera. Pleasechange a browser.';
      this.isModalActive = true;
    },
    timestamp() {
      return moment().format(this.momentFormat);
    },
    toggleFakeInput() {
      if (!this.fakeInput) {
        this.fakeInput = setInterval(() => {
          if (this.fakeInput && this.dataTransferStatus) {
            let row = [new Date().getTime()];

            // for (let i=0; i<10; i++){
            //   row.push(getRandomIntInclusive(0, 40))
            // }

            row.push(getRandomIntInclusive(0, 40))
            row.push(getRandomIntInclusive(40, 80))
            row.push(Math.random() > 0.5 ? getRandomIntInclusive(40, 80) : null)
            row.push(Math.random() > 0.5 ? getRandomIntInclusive(0, 40) : 'null')

            let item = {
              data: row.join(','),
              direction: 0,
              timestamp: this.timestamp(),
              status: this.isTransmittingData
            }

            this.processData(item.data)

            this.tabs[0].data.push(item);
            if (!item.direction){
              this.tabs[1].data.push(item);
            } else {
              this.tabs[2].data.push(item);
            }
          }
        }, 1000)
      } else {
        clearInterval(this.fakeInput)
        this.fakeInput = null;
      }
    },
    uBitEventHandler(reason, device, data) {
      switch (reason) {
        case "connected":
          console.log("Connected!")
          this.isConnectedWebUSBProgress = false;
          this.isConnectedWebUSB = true;
          this.device = device;
          this.connectionTime = null;
          break
        case "disconnected":
          console.log("Disconnected")
          this.isConnectedWebUSB = false;
          setTimeout(() => {
            this.sendData('usbOff')
          }, 500);
          break
        case "connection failure":
          this.isConnectedWebUSBProgress = false;
          break
        case "error":
          console.log("Error", data)
          break
        case "console":
          // console.log("Console Data: " + data.data)
          if (this.dataTransferStatus) {
            let item = {
              data: data.data,
              direction: 0,
              timestamp: this.timestamp(),
              status: true
            }

            this.tabs[0].data.push(item);
            this.tabs[1].data.push(item);
          }

          this.processData(data.data)

          break
        case "graph-event":
          console.log(`Graph Event:  ${data.data} (for ${data.graph}${data.series.length ? " / series " + data.series : ""})`)
          break
        case "graph-data":
          console.log(`Graph Data: ${data.data} (for ${data.graph}${data.series.length ? " / series " + data.series : ""})`)
          break
      }
    },
    connectWebUSB() {
      if (!this.isConnectedWebUSB){
        this.isConnectedWebUSBProgress = true;

        try {
          this.$uBitConnectDevice(this.uBitEventHandler);
        } catch (err) {
          console.log(err)
          this.isConnectedWebUSBProgress = false;
          this.showWarningNotSupportedBrowser()
        }
      } else {
        this.disconnect()
      }
    },
    disconnect() {
      if (this.isConnectedWebUSB){
        this.$uBitDisconnect(this.device);
      } else if (this.isConnectedBluetooth){
        this.disconnectBluetooth();
      }
    },
    connectBluetooth() {
      if (!this.isConnectedBluetooth){
        this.isConnectedBluetoothProgress = true;

        this.$uBitConnectBluetooth(this.uBitBluetoothEventHandler).then(resp => {
          this.isConnectedBluetooth = resp;
        }).catch(err => {
          console.log(err)
          this.showWarningNotSupportedBrowser()
        }).finally(() => {
          this.isConnectedBluetoothProgress = false;
          this.connectionTime = null;
        })
      } else {
        this.disconnectBluetooth()
      }
    },
    disconnectBluetooth() {
      this.$uBitDisconnectBluetooth().then(resp => {
        this.isConnectedBluetooth = false;
      })
    },
    uBitBluetoothEventHandler(event) {
      if (!this.dataTransferStatus) {
        return;
      }

      let receivedData = [];
      for (var i = 0; i < event.target.value.byteLength; i++) {
        receivedData[i] = event.target.value.getUint8(i);
      }
      const receivedString = String.fromCharCode.apply(null, receivedData);

      if (receivedString.indexOf('\n') != -1){
        this.receivedStringBuffer += receivedString.slice(0,receivedString.indexOf('\n'))

        let item = {
          data: this.receivedStringBuffer,
          direction: 0,
          timestamp: this.timestamp(),
          status: true
        }
  
        this.tabs[0].data.push(item)
        this.tabs[1].data.push(item)

        this.processData(this.receivedStringBuffer)

        this.receivedStringBuffer = ''
      } else {
        this.receivedStringBuffer += receivedString;
      }
    },
    sendData(data){
      let item = {
        data: data,
        direction: 1,
        timestamp: this.timestamp(),
        status: true
      }

      this.tabs[0].data.push(item)

      if (this.isConnectedBluetooth){
        this.$sendDataBluetooth(data)
      }

      if (this.isConnectedWebUSB){
        this.$sendDataWebUSB(this.device, data)
      }

      if (this.isConnectedBluetooth || this.isConnectedWebUSB){
        this.tabs[2].data.push(item)
      }
    },
    changeKeyboardReading(status) {
      this.keyboardReading = status;
    },
    toggleDataTransferStatus() {
      this.dataTransferStatus = !this.dataTransferStatus
    },
    confirmationAction(action){
      this.isConfirmationVisible = false;
    },
    confirm(text, action){
      this.confirmationText = text;
      this.confirmationAction = () => {
        this.isConfirmationVisible = false;
        action();
      }
      this.isConfirmationVisible = true;
    }
  },
  provide() {
    return {
      sendData: this.sendData,
      getLocalSettings: this.getLocalSettings,
      isConnectedWebUSB: Vue.computed(() => this.isConnectedWebUSB),
      isConnectedWebUSBProgress: Vue.computed(() => this.isConnectedWebUSBProgress),
      isConnectedBluetooth: Vue.computed(() => this.isConnectedBluetooth),
      isConnectedBluetoothProgress: Vue.computed(() => this.isConnectedBluetoothProgress),
      // $isConnectedWebUSB: () => this.isConnectedWebUSB,
      // $isConnectedWebUSBProgress: () => this.isConnectedWebUSBProgress,
      // $isConnectedBluetooth: () => this.isConnectedBluetooth,
      // $isConnectedBluetoothProgress: () => this.isConnectedBluetoothProgress,
      measurementsData: this.measurementsData,
      receivedData: this.receivedData,
      dataTransferStatus: Vue.computed(() => this.dataTransferStatus),
      toggleDataTransferStatus: this.toggleDataTransferStatus,
      toggleFakeInput: this.toggleFakeInput,
      confirm: this.confirm,
      fakeInput: Vue.computed(() => this.fakeInput),
      keyboardReading: Vue.computed(() => this.keyboardReading),
      tabs: Vue.computed(() => this.tabs),
      measurementsLastRow: Vue.computed(() => this.measurementsLastRow),
      settings: Vue.computed(() => this.settings),
      measurementsLastRow: Vue.computed(() => this.measurementsLastRow),
      HighchartsColors: this.HighchartsColors,
      connectWebUSB: this.connectWebUSB,
      connectBluetooth: this.connectBluetooth,
      keysPressed: Vue.computed(() => this.keysPressed),
    }
  }
})

app.config.globalProperties.$uBitConnectDevice = uBitConnectDevice;
app.config.globalProperties.$uBitDisconnect = uBitDisconnect;
app.config.globalProperties.$uBitConnectBluetooth = connectBluetooth;
app.config.globalProperties.$uBitDisconnectBluetooth = disconnectButtonPressed;
app.config.globalProperties.$sendDataBluetooth = sendData;
app.config.globalProperties.$sendDataWebUSB = uBitSend;

app.config.unwrapInjectedRef = true

const i18n = createI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
  // If you need to specify other options, you can set other options
  // ...
})

app.use(i18n)
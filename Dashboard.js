const ComponentDashboard = {
  inject: {
    data: 'measurementsLastRow',
    webusb: 'isConnectedWebUSB',
    bluetooth: 'isConnectedBluetooth',
    sendData: 'sendData',
    getLocalSettings: 'getLocalSettings',
    measurementsData: 'measurementsData',
    receivedData: 'receivedData',
    dataTransferStatus: 'dataTransferStatus',
    toggleDataTransferStatus: 'toggleDataTransferStatus',
    toggleFakeInput: 'toggleFakeInput',
    fakeInput: 'fakeInput',
    confirm: 'confirm',
    settings: 'settings',
    keyboardReading: 'keyboardReading',
    connectWebUSB: 'connectWebUSB',
    connectBluetooth: 'connectBluetooth',
    isConnectedWebUSB: 'isConnectedWebUSB',
    isConnectedWebUSBProgress: 'isConnectedWebUSBProgress',
    isConnectedBluetooth: 'isConnectedBluetooth',
    isConnectedBluetoothProgress: 'isConnectedBluetoothProgress'
  },
  components: {
    draggable,
  },
  // props: ['data', 'tabs', 'settings', 'bluetooth', 'webusb'],
  data() {
    let defaultWidgets = [{ "id": 1649065272948, "key": "temp", "name": "Temperature", "data": [[null, "34"], [null, "9"]], "value": 0, "status": true, "interval": 100, "plotBands": [{ "from": -55, "to": -39, "color": "blue" }, { "from": -39, "to": "0", "color": "lightblue" }, { "from": "0", "to": "50", "color": "lightgreen" }, { "from": 41, "to": 62, "color": "yellow" }, { "from": 62, "to": 100, "color": "orange" }, { "from": "100", "to": "125", "color": "red" }], "min": -55, "max": 125, "delta": 2, "dataColumn": 1, "startAngle": -150, "stopAngle": 50, "endAngle": 150 }, { "id": 1650565901724, "type": "chart", "chartType": "line", "title": "Temperature", "subtitle": "", "yAxisTitle": "Temperature (°C)", "width": 2, "series": [{ "name": "Temperature", "dataColumn": 1, "color": "", "data": [[1650781693916, 33]] }], "dataLabels": true, "enableMouseTracking": false, "xAxisDataColumn": "0", "fromColumn": 2 }, { "id": 1649091226117, "key": "light", "name": "Light", "data": [], "value": 0, "status": true, "plotBands": [{ "from": 0, "to": "51", "color": "#b3b300" }, { "from": "51", "to": "102", "color": "#e6e600" }, { "from": "102", "to": "153", "color": "#ffff1a" }, { "from": "153", "to": "204", "color": "#ffff80" }, { "from": "204", "to": "255", "color": "#ffffcc" }], "min": 0, "max": 255, "interval": 100, "delta": 20, "dataColumn": 2 }, { "id": 1650861805948, "type": "chart", "chartType": "line", "title": "Light", "subtitle": "", "xAxisDataColumn": 0, "yAxisTitle": "Light level", "fromColumn": 2, "span": null, "series": [{ "name": "Light", "dataColumn": 2, "color": "orange" }], "dataLabels": true, "enableMouseTracking": false }, { "id": 1649494166722, "key": "sound", "name": "Sound", "data": [], "value": 0, "status": false, "plotBands": [], "min": 0, "max": 255, "dataColumn": 3, "interval": 20, "delta": 20 }, { "id": 1651235141001, "type": "chart", "chartType": "column", "title": "Sound", "subtitle": "", "xAxisDataColumn": 0, "yAxisTitle": "Sound level", "fromColumn": 2, "span": null, "series": [{ "name": "Sound", "dataColumn": 3 }], "dataLabels": true, "enableMouseTracking": false }, { "id": 1649272300766, "key": "ax", "name": "Acceleration X", "data": [], "value": 0, "status": true, "plotBands": [], "min": -1024, "max": 1024, "interval": 500, "delta": 20, "dataColumn": 4 }, { "id": 1649446513751, "key": "ay", "name": "Acceleration Y", "data": [], "value": 0, "status": true, "plotBands": [], "min": -1024, "max": 1024, "dataColumn": 5, "interval": 500, "delta": 20 }, { "id": 1650400190944, "key": "ay", "name": "Acceleration Z", "data": [], "value": 0, "status": true, "plotBands": [], "min": -1500, "max": 1500, "dataColumn": 6, "interval": 500, "delta": 20 }, { "key": "compas", "status": false, "name": "Compas", "dataColumn": 7, "interval": 100, "plotBands": [{ "from": 0, "to": "45", "color": "lightblue", "label": { "text": "" } }, { "from": "315", "to": "360", "color": "lightblue", "label": { "text": "" } }, { "from": "135", "to": "225", "color": "OrangeRed", "label": { "text": "" } }, { "from": "45", "to": "135", "color": "yellow", "label": { "text": "" } }, { "from": "225", "to": "315", "color": "lightgreen", "label": { "text": "" } }], "min": 0, "max": 360, "startAngle": 1, "endAngle": 360, "delta": 5, "id": 1650112694192 }, { "id": 1651607250891, "key": "ax", "name": "Strength 2D", "data": [], "value": 0, "status": false, "plotBands": [], "min": -1024, "max": 1024, "interval": 500, "delta": 20, "dataColumn": 8 }, { "id": 1651607412515, "key": "ax", "name": "Strength 3D", "data": [], "value": 0, "status": false, "plotBands": [], "min": -1500, "max": 1500, "interval": 500, "delta": 20, "dataColumn": 9 }];

    return {
      settingsVisible: false,
      newGaugeFormVisible: false,
      newChartFormVisible: false,
      newControlFormVisible: false,
      newCodeFormVisible: false,
      drag: false,
      measurements: defaultWidgets,
      defaultWidgets: defaultWidgets,
      isSynchronizing: false,
      isMockDataButtonVisible: false
    }
  },
  created() {
    this.getLocalSettings('measurements', this)

    if (this.bluetooth || this.webusb) {
      this.syncSensors();
    }
  },
  watch: {
    measurements: {
      deep: true,
      handler(newVal) {
        localStorage.setItem('measurements', JSON.stringify(this.measurements));
      }
    },
    bluetooth(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.syncSensors();
        }, 500);
      }
    },
    webusb(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.syncSensors();
        }, 1000);
      }
    },
    settingsVisible(visible) {
      this.$emit('keyboard', !visible)
    },
    receivedData: {
      deep: true,
      handler(newVal) {
        let lastCommandParts = newVal[newVal.length - 1].split(';');

        let command = lastCommandParts[0]

        if (command == 'clearDashboard') {
          this.clearData()
        } else if (command == 'start') {
          if (!this.dataTransferStatus) {
            this.toggleDataTransferStatus()
          }
        } else if (command == 'stop') {
          if (this.dataTransferStatus) {
            this.toggleDataTransferStatus()
          }
        } else if (command == 'alert') {
          alert(lastCommandParts[1])
        }
      }
    },
  },
  methods: {
    exportWidgets() {
      var link = document.createElement("a");
      link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(JSON.stringify(this.measurements)));
      link.setAttribute("download", 'dashboard.mmw');
      document.body.appendChild(link);

      link.click();
    },
    addSensor(sensor) {
      this.measurements.push(sensor);
      this.$nextTick(() => {
        let container = this.$refs.widgetsContainer.targetDomElement;
        container.scrollTop = container.scrollHeight;
      });
    },
    add(sensor) {
      this.addSensor(sensor)
      this.newGaugeFormVisible = false;
      this.newChartFormVisible = false;
      this.newControlFormVisible = false;
      this.newCodeFormVisible = false;
      console.log(this.measurements)
    },
    cancel() {
      this.newGaugeFormVisible = false;
      this.newChartFormVisible = false;
      this.newControlFormVisible = false;
      this.newCodeFormVisible = false;
    },
    remove(id) {
      let index = null;
      for (let i = 0; i < this.measurements.length; i++) {
        if (this.measurements[i].id == id) {
          index = i;
          break;
        }
      }
      if (index != null) {
        this.measurements.splice(index, 1)
      }
    },
    copy(sensor) {
      this.addSensor(sensor)
    },
    syncSensors() {
      if (!this.settings.synchronisationEnabled) {
        return
      }

      this.isSynchronizing = true;
      let messages = [];

      if (this.webusb) {
        messages.push('usbOff\n')
      }

      if (this.bluetooth) {
        messages.push('btOff\n')
      }

      messages.push(['bt', this.settings.bluetoothSendInterval].join(';') + '\n')
      messages.push(['usb', this.settings.webUSBSendInterval].join(';') + '\n')

      for (let n in this.measurements) {
        let sensor = this.measurements[n];

        if (!sensor.type || sensor.type == 'gauge') {
          messages.push(['set', sensor.dataColumn, sensor.status ? 1 : 0, sensor.interval, sensor.delta != '' ? sensor.delta : -1].join(';') + '\n')
        }
      }

      if (this.webusb) {
        messages.push('usbOn\n')
      }

      if (this.bluetooth) {
        messages.push('btOn\n')
      }

      messages.push('get\n')

      let intervalId = setInterval(() => {
        if (messages.length) {
          this.sendData(messages.shift())
        } else {
          clearInterval(intervalId);
          this.isSynchronizing = false;
        }
      }, this.bluetooth ? 700 : 700);
    },
    clearData() {
      // while(this.measurementsData.length) {
      //   this.measurementsData.pop()
      // }
      this.measurementsData.splice(0, this.measurementsData.length)
    },
    confirmClearData() {
      this.confirm('Are you sure you want to clear all chart data?', this.clearData)
    },
    removeAll() {
      this.confirm('Are you sure you want to remove all widgets?', () => {
        this.measurements = []
      })
    },
    restoredefault() {
      this.confirm('Are you sure you want to restore the default widgets?', () => {
        this.measurements = this.defaultWidgets;
      })
    },
    toggleMockDataButton() {
      this.settings.isMockDataButtonVisible = !this.settings.isMockDataButtonVisible;
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;

      if (!files.length) {
        return;
      }

      var reader = new FileReader();
      reader.readAsText(files[0], "UTF-8");
      reader.onload = (evt) => {
        if (this.measurements.length) {
          this.confirm('Are you sure you want to overwrite the current widgets?', () => {
            this.measurements = JSON.parse(evt.target.result);
          })
        } else {
          this.measurements = JSON.parse(evt.target.result);
        }

        e.target.value = ''
      }
      reader.onerror = function (evt) {
        console.log('error reading file')
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    keyboard(value) {
      this.$emit('keyboard', value)
    }
  },
  template: `
      <div class="gauges" :class="{'gauges-console-opened': settings.consoleVisible}">
        <gauge-settings v-if="newGaugeFormVisible" :settings="settings" @save="add" @cancel="cancel" @keyboard="keyboard"></gauge-settings>
        <chart-settings v-if="newChartFormVisible" :settings="settings" @save="add" @cancel="cancel" @keyboard="keyboard"></chart-settings>
        <control-settings v-if="newControlFormVisible" :settings="settings" @save="add" @cancel="cancel" @keyboard="keyboard"></control-settings>
        <code-settings v-if="newCodeFormVisible" :settings="settings" @save="add" @cancel="cancel" @keyboard="keyboard"></code-settings>
  
        <settings :settings="settings" v-if="settingsVisible" @save="settingsVisible = false" @cancel="settingsVisible = false" :bluetooth="bluetooth" :webusb="webusb" @removeall="removeAll" @restoredefault="restoredefault" @keyboard="keyboard"></settings>
        
        <draggable ref="widgetsContainer" class="gauges-container" v-model="measurements" item-key="id" handle=".handle"
        @start="drag=true" 
        @end="drag=false" :force-fallback="true" :scroll-sensitivity="200" :animation="150">
          <template #item="{element}">
            <gauge :sensor="element" :data="data" :settings="settings" @remove="remove" @copywidget="copy" :is-synchronizing="isSynchronizing" @keyboard="keyboard" v-if="element.type == 'gauge' || !element.type"></gauge>
            <chart :chart="element" :data="data" :settings="settings" @remove="remove" @copywidget="copy" @keyboard="keyboard" v-else-if="element.type == 'chart'"></chart>
            <control :item="element" :data="data" :settings="settings" @remove="remove" @copywidget="copy" @keyboard="keyboard" v-else-if="element.type == 'control'"></control>
            <code-panel :item="element" :data="data" :settings="settings" @remove="remove" @copywidget="copy" @keyboard="keyboard" v-else-if="element.type == 'code'"></code-panel>
          </template>
        </draggable>

        <console class="gauges-console" :tabs="tabs" @keyboard="keyboard" v-if="settings.consoleVisible" @close="settings.consoleVisible = false"></console>

        <div class="gauges-menu" @click.stop.ctrl="toggleMockDataButton">
          
          <button class="button is-info" :class="{'is-info': !isConnectedBluetooth, 'is-success': isConnectedBluetooth, 'is-warning': isConnectedBluetoothProgress}" title="Connect via Bluetooth" @click.stop="connectBluetooth">
            <i class="fab fa-bluetooth-b"></i>
          </button>
          <button class="button is-info" :class="{'is-info': !isConnectedWebUSB, 'is-success': isConnectedWebUSB, 'is-warning': isConnectedWebUSBProgress}" title="Connect via WebUSB" @click.stop="connectWebUSB">
            <i class="fab fa-usb"></i>
          </button>

          <div class="separator"></div>
          
          <button class="button is-info" title="Add a chart" @click.stop="newChartFormVisible = true">
            <i class="fas fa-chart-line"></i>
          </button>
          <button class="button is-info" title="Add a gauge" @click.stop="newGaugeFormVisible = true">
            <i class="fas fa-tachometer-alt"></i>
          </button>
          <button class="button is-info" title="Add a control panel" @click.stop="newControlFormVisible = true">
            <i class="fa-solid fa-gamepad"></i>
          </button>
          <button class="button is-info" title="Add a code panel" @click.stop="newCodeFormVisible = true">
            <i class="fa-solid fa-code"></i>
          </button>

          <div class="separator"></div>

          <button class="button is-info" title="Open a dashboard from a file" @click.stop="triggerFileInput">
            <label class="custom-file-upload" @click.stop="">
                <i class="fa-solid fa-folder-open"></i>
            </label>
            <input ref="fileInput" type="file" accept=".mmw" @change="onFileChange"/>
          </button>

          <button class="button is-info" title="Save the dashboard to a file" @click.stop="exportWidgets">
            <i class="fa-solid fa-download"></i>
          </button>

          <button class="button is-info" title="Remove all widgets" @click.stop="removeAll" v-if="measurements.length">
            <i class="fa-solid fa-trash-can"></i>
          </button>
          <button class="button is-info" title="Restore the default widgets" @click.stop="restoredefault" v-else>
            <i class="fa-solid fa-rotate-left"></i>
          </button>
          
          <div class="separator"></div>

          <button class="button is-info" title="Console" :class="{'is-success': settings.consoleVisible}" @click.stop="settings.consoleVisible = !settings.consoleVisible">
            <i class="fas fa-terminal"></i>
          </button>

          <button class="button is-info" :class="{'is-success': keyboardReading, 'is-info': !keyboardReading}" :title="'Sending keyboard key codes is ' + (keyboardReading ? 'on' : 'off')" @click.stop="keyboard(!keyboardReading)">
            <span class="icon is-small">
              <i class="fas fa-keyboard"></i>
            </span>
          </button>

          <button class="button is-info" :class="{'is-success': dataTransferStatus, 'is-info': !dataTransferStatus}" :title="'Receiving data is ' + (dataTransferStatus ? 'on' : 'off')" @click.stop="toggleDataTransferStatus">
            <span class="icon is-small" v-if="dataTransferStatus">
              <i class="fas fa-pause"></i>
            </span>
            <span class="icon is-small" v-else>
              <i class="fas fa-play"></i>
            </span>
          </button>

          <button class="button is-info" title="Clear data" @click.stop="confirmClearData">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="separator"></div>
  
          <button class="button is-info" :class="{'is-success': fakeInput}" title="Toggle data mocking" @click.stop="toggleFakeInput">
            <span class="icon is-small">
              <i class="fas fa-vial"></i>
            </span>
          </button>

          <button class="button is-info" title="Settings" @click.stop="settingsVisible = true">
            <i class="fas fa-cog"></i>
          </button>
        </div>
      </div>
    `
}

app.component('settings', {
  inject: ['sendData'],
  props: ['settings', 'bluetooth', 'webusb'],
  data() {
    return {
      bluetoothSendInterval: this.settings.bluetoothSendInterval,
      webUSBSendInterval: this.settings.webUSBSendInterval,
      synchronisationEnabled: this.settings.synchronisationEnabled,
      minBluetoothInterval: 300,
      minUsbInterval: 300,
      exampleSettingsOpened: this.settings.exampleSettingsOpened,
    }
  },
  methods: {
    save() {
      this.settings.bluetoothSendInterval = this.bluetoothSendInterval
      this.settings.webUSBSendInterval = this.webUSBSendInterval
      this.settings.exampleSettingsOpened = this.exampleSettingsOpened
      this.settings.synchronisationEnabled = this.synchronisationEnabled

      if (this.settings.synchronisationEnabled) {
        if (this.bluetooth) {
          this.sendData(['bt', this.bluetoothSendInterval].join(';') + '\n')
        }

        if (this.webusb) {
          this.sendData(['usb', this.webUSBSendInterval].join(';') + '\n')
        }
      }

      this.$emit('save')
    },
    cancel() {
      this.$emit('cancel')
    },
    toggleExampleSettings() {
      this.exampleSettingsOpened = !this.exampleSettingsOpened;
    }
  },
  template: `
      <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Settings</p>
            <button class="delete" aria-label="close" @click.stop="cancel"></button>
          </header>
          <section class="modal-card-body">
            <div class="field">
              <label class="label">Widgets</label>
            </div>
            <div class="field is-grouped">
              <div class="control">
                <button class="button is-danger" @click.stop="$emit('removeall')">Remove all</button>
              </div>
              <div class="control">
                <button class="button is-info" @click.stop="$emit('restoredefault')">Restore default</button>
              </div>
            </div>

            <div class="field">
              <div class="control">
                <label class="checkbox">
                  <input type="checkbox" id="checkbox" v-model="synchronisationEnabled">
                  Auto settings synchronisation
                </label>
              </div>
            </div>

            <div class="field">
              <label class="label has-text-info" style="cursor: pointer;" @click.stop="toggleExampleSettings">
              <span v-if="!exampleSettingsOpened"><i class="fa-solid fa-circle-plus"></i></span>
              <span v-else><i class="fa-solid fa-circle-minus"></i></span> 
              Settings for: Dashboard - sensors support
              </label>
            </div>
  
            <div class="box" v-if="exampleSettingsOpened">
              <div class="field">
                <label class="label">micro:bit Bluetooth send interval (ms)</label>
                <div class="control">
                  <input class="input" :class="{'is-danger': bluetoothSendInterval < minBluetoothInterval}" type="number" v-model="bluetoothSendInterval">
                </div>
                <p class="help is-info">The minimum interval between sending data.</p>
                <p class="help is-danger" v-if="bluetoothSendInterval < minBluetoothInterval">If the value is too low, the application may be unresponsive</p>
              </div>
              <div class="field">
                <label class="label">micro:bit WebUSB send interval (ms)</label>
                <div class="control">
                  <input class="input" :class="{'is-danger': webUSBSendInterval < minUsbInterval}" type="number" v-model="webUSBSendInterval">
                </div>
                <p class="help is-info">The minimum interval between sending data.</p>
                <p class="help is-danger" v-if="webUSBSendInterval < minUsbInterval">If the value is too low, the application may be unresponsive</p>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button is-success" @click.stop="save">Save changes</button>
            <button class="button" @click.stop="cancel">Cancel</button>
          </footer>
        </div>
        <!--<button class="modal-close is-large" aria-label="close" @click.stop="cancel"></button>-->
      </div>
    `
})
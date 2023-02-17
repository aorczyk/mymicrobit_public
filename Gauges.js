app.component('gauge', {
  inject: ['sendData', 'measurementsData'],
  props: ['sensor', 'data', 'settings', 'isSynchronizing'],
  data() {
    return {
      settingsVisible: false,
      chartOptions: {
        chart: {
          type: 'gauge',
          plotBackgroundColor: null,
          plotBackgroundImage: null,
          plotBorderWidth: 0,
          plotShadow: false,
        },
        exporting: {
          enabled: false
        },

        title: {
          text: 'Temperature',
          style: {
            display: 'none'
          }
        },

        pane: {
          startAngle: this.sensor.startAngle || -150,
          endAngle: this.sensor.endAngle || 150,
          background: [{
            backgroundColor: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
              stops: [
                [0, '#FFF'],
                [1, '#333']
              ]
            },
            borderWidth: 0,
            outerRadius: '109%'
          }, {
            backgroundColor: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
              stops: [
                [0, '#333'],
                [1, '#FFF']
              ]
            },
            borderWidth: 1,
            outerRadius: '107%'
          }, {
            // default background
          }, {
            backgroundColor: '#DDD',
            borderWidth: 0,
            outerRadius: '105%',
            innerRadius: '103%'
          }]
        },

        // the value axis
        yAxis: {
          min: this.sensor.min,
          max: this.sensor.max,

          minorTickInterval: 'auto',
          minorTickWidth: 1,
          minorTickLength: 10,
          minorTickPosition: 'inside',
          minorTickColor: '#666',

          tickPixelInterval: 30,
          tickWidth: 2,
          tickPosition: 'inside',
          tickLength: 10,
          tickColor: '#666',
          labels: {
            step: 2,
            rotation: 'auto'
          },
          title: {
            text: this.sensor.name,
            // text: '&#8451;',
            useHTML: true
          },
          plotBands: this.sensor.plotBands
        },

        series: [{
          name: this.sensor.name,
          data: [],
          tooltip: {
            valueSuffix: ''
            // valueSuffix: ' &#8451;'
          }
        }]
      },
      minValue: null,
      maxValue: null,
      avgValue: null,
    }
  },
  mounted() {
      this.updateChartData()
  },
  computed: {
    value() {
      let out = 0
      if (this.measurementsData[this.measurementsData.length - 1] && this.sensor.status){
      // if (this.measurementsData[this.measurementsData.length - 1] && this.measurementsData[this.measurementsData.length - 1][this.sensor.dataColumn] !== null){
        out = this.measurementsData[this.measurementsData.length - 1][this.sensor.dataColumn]

        if ((out < this.minValue) || this.minValue == null){
          this.minValue = out;
        }

        if ((out > this.maxValue) || this.maxValue == null){
          this.maxValue = out;
        }
  
        var total = 0;
        var count = 0;
    
        this.measurementsData.forEach((item, index) => {
            total += item[this.sensor.dataColumn];
            count++;
        });
  
        this.avgValue = count ? (total / count).toFixed(3) : null;
      }

      return out;
    },
  },
  watch: {
    'sensor.status'() {
      // this.sendData(['set', this.sensor.dataColumn, this.sensor.status ? 1 : 0].join(';') + '\n')
      this.sendData(['set', this.sensor.dataColumn, this.sensor.status ? 1 : 0, this.sensor.interval !== '' ? this.sensor.interval : -1, this.sensor.delta !== '' ? this.sensor.delta : -1].join(';') + '\n')
    },
    settingsVisible(visible) {
      this.$emit('keyboard', !visible)
    },
    value() {
      this.updateChartData()
    }
  },
  methods: {
    updateChartData() {
      if (this.value != null){
        let chartObj = this.$refs.chart.chart;
        chartObj.series[0].setData([this.value])

        this.$nextTick(() => {
          this.$refs.chart.chart.redraw();
        })
      }
    },
    save() {
      this.settingsVisible = false;
      this.chartOptions.yAxis.title.text = this.sensor.name;
      this.chartOptions.yAxis.min = this.sensor.min;
      this.chartOptions.yAxis.max = this.sensor.max;
      this.chartOptions.yAxis.plotBands = this.sensor.plotBands;
      this.chartOptions.series = this.sensor.series;
      this.updateChartData();
    },
    cancel() {
      this.settingsVisible = false;
    },
    remove(id) {
      this.$emit('remove', id)
      this.settingsVisible = false;
    },
    copy(sensor) {
      this.$emit('copywidget', sensor)
      this.settingsVisible = false;
    },
  },
  template: `
    <div class="card-qauge">
      <gauge-settings v-if="settingsVisible" :sensor="sensor" :settings="settings" @save="save" @cancel="cancel" @remove="remove" @copywidget="copy"></gauge-settings>
      <highcharts ref="chart" class="gauge" :options="chartOptions"></highcharts>

      <div class="gauge-status">
        <label class="info">{{ sensor.dataColumn }}</label>
        <Transition name="fade" mode="out-in">
          <span v-if="isSynchronizing">
            <i class="fa-solid fa-spinner fa-spin-pulse"></i>
          </span>
          <span v-else>
            <span class="icon has-text-success" @click.stop="sensor.status = false" v-if="sensor.status">
              <i class="fa-solid fa-toggle-on"></i>
            </span>
            <span class="icon" @click.stop="sensor.status = true" v-else>
              <i class="fa-solid fa-toggle-off"></i>
            </span>
          </span>
        </Transition>
      </div>
      <div class="gauge-info">
        <div>Min: <span v-if="minValue != null">{{ minValue }}</span><span v-else>-</span></div>
        <div>Max: <span v-if="maxValue != null">{{ maxValue }}</span><span v-else>-</span></div>
        <div>Avg: <span v-if="avgValue != null">{{ avgValue }}</span><span v-else>-</span></div>
      </div>

      <div class="gauge-settings" title="Settings" @click.stop="settingsVisible = true">
        <span class="icon">
          <i class="fas fa-cog"></i>
        </span>
      </div>

      <div class="handle gauge-handle"><i class="fas fa-grip-horizontal"></i></div>
    </div>
  `
})

app.component('gauge-settings', {
  inject: ['sendData', 'HighchartsColors', 'confirm'],
  props: ['sensor', 'settings'],
  data() {
    return {
      sensorSettings: {
        id: new Date().getTime(),
        type: 'gauge',
        status: true,
        name: 'New gauge',
        dataColumn: 1,
        interval: 1000,
        plotBands: [],
        min: 0,
        max: 100,
        startAngle: -150,
        endAngle: 150,
        delta: '',
        exampleSettingsOpened: false
      }
    }
  },
  created() {
    if (this.sensor) {
      this.sensorSettings = JSON.parse(JSON.stringify(this.sensor))

      // --- Migration ---
      if (!this.sensorSettings.hasOwnProperty('exampleSettingsOpened')){
        this.sensorSettings.exampleSettingsOpened = false
      }

      // for (let band of this.sensor.plotBands){
      //   if (band.label){
      //     delete band.label;
      //     // band.label.textAlign = 'center';
      //     // band.label.verticalAlign = 'middle';
      //   }
      // }
    }
  },
  computed: {
    tooLowInterval() {
      return (this.settings.bluetoothSendInterval < 300 || this.settings.webUSBSendInterval < 300) && this.sensorSettings.interval < 300;
    },
    canSave() {
      return this.sensorSettings.dataColumn && this.sensorSettings.name;
    },
  },
  methods: {
    save() {
      this.sensorSettings.plotBands.sort((a,b) => {
        let aKey = a.from;
        let bKey = b.from;

        return aKey < bKey ? -1 : aKey > bKey ? 1  : 0;
      })

      if (this.sensor) {
        // if (this.sensor.interval != this.sensorSettings.interval || this.sensor.delta != this.sensorSettings.delta){
        this.sendData(['set', this.sensorSettings.dataColumn, this.sensorSettings.status ? 1 : 0, this.sensorSettings.interval !== '' ? this.sensorSettings.interval : -1, this.sensorSettings.delta !== '' ? this.sensorSettings.delta : -1].join(';') + '\n')
        // }

        for (let key in this.sensorSettings) {
          this.sensor[key] = this.sensorSettings[key]
        }
      }

      this.$emit('save', this.sensorSettings)
    },
    cancel() {
      this.$emit('cancel')
    },
    remove() {
      this.confirm('Are you sure you want to remove the gauge?', () => {
        this.$emit('remove', this.sensorSettings.id)
      })
    },
    copy() {
      let sensorCopy = JSON.parse(JSON.stringify(this.sensorSettings))
      sensorCopy.id = new Date().getTime();
      sensorCopy.name += ' copy'
      this.$emit('copywidget', sensorCopy)
    },
    addPlotBand() {
      this.sensorSettings.plotBands.push({
        from: 0,
        to: 0,
        color: '',
        // label: {
        //   text: '',
        // }
      })
    },
    removePlotBand(index) {
      this.sensorSettings.plotBands.splice(index, 1)
    },
    toggleExampleSettings() {
      this.sensorSettings.exampleSettingsOpened = !this.sensorSettings.exampleSettingsOpened;
    }
  },
  template: `
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title" v-if="sensor">Gauge settings</p>
          <p class="modal-card-title" v-else>New gauge</p>
          <button class="delete" aria-label="close" @click.stop="cancel"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input class="input" :class="{'is-danger': !sensorSettings.name}" type="text" v-model="sensorSettings.name">
            </div>
          </div>

          <div class="field">
            <label class="label">Data column number</label>
            <div class="control">
              <input class="input" :class="{'is-danger': !sensorSettings.dataColumn}" type="number" v-model="sensorSettings.dataColumn">
            </div>
          </div>

          <div class="field">
            <label class="label has-text-info" style="cursor: pointer;" @click.stop="toggleExampleSettings">
            <span v-if="!sensorSettings.exampleSettingsOpened"><i class="fa-solid fa-circle-plus"></i></span>
            <span v-else><i class="fa-solid fa-circle-minus"></i></span> 
            Settings for: Dashboard - sensors support
            </label>
          </div>

          <div class="box" v-if="sensorSettings.exampleSettingsOpened">
            <div class="field">
              <label class="label">Sampling interval (ms)<span v-if="sensorSettings.interval === ''"> - off</span></label>
              <div class="control">
                <input class="input" type="number" v-model="sensorSettings.interval">
              </div>
              <p class="help is-info" v-if="sensorSettings.interval === ''">The measurement is read out every given period of time.</p>
              <p class="help is-info" v-else>The measurement is read out every data sending period of time.</p>
            </div>

            <div class="field">
              <label class="label">Value range: <span v-if="sensorSettings.delta !== ''">&lt; value + {{ sensorSettings.delta }}, value - {{ sensorSettings.delta }} &gt;</span><span v-else>off</span></label>
              <div class="control">
                <input class="input" type="number" v-model="sensorSettings.delta">
              </div>
              <p class="help is-info">The measured value will be sent if its change is greater than the set value. If it is empty, the value of each new measurement is sent.</p>
            </div>
          </div>

          <div class="field">
            <label class="label has-text-info">Gauge settings</label>
          </div>

          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field">
                <label class="label">Min</label>
                <p class="control">
                  <input class="input" type="number" placeholder="Min" v-model.number="sensorSettings.min">
                </p>
              </div>
              <div class="field">
               <label class="label">Max</label>
                <p class="control">
                  <input class="input" type="number" placeholder="Max" v-model.number="sensorSettings.max">
                </p>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field">
                <label class="label">Start angle</label>
                <p class="control">
                  <input class="input" type="number" placeholder="Start angle" v-model.number="sensorSettings.startAngle">
                </p>
              </div>
              <div class="field">
               <label class="label">End angle</label>
                <p class="control">
                  <input class="input" type="number" placeholder="End angle" v-model.number="sensorSettings.endAngle">
                </p>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label has-text-info">Plot Bands</label>
          </div>
          <div class="field is-horizontal" v-for="band, index in sensorSettings.plotBands">
            <div class="field-body">
              <div class="field">
                <label class="label" v-if="index == 0">From</label>
                <p class="control">
                  <input class="input" type="number" placeholder="From" v-model="band.from">
                </p>
              </div>
              <div class="field">
                <label class="label" v-if="index == 0">To</label>
                <p class="control">
                  <input class="input" type="number" placeholder="To" v-model="band.to">
                </p>
              </div>
              <div class="field">
                <label class="label" v-if="index == 0">Color</label>
                <color-selector v-model="band.color"></color-selector>
              </div>
              <!--<div class="field">
                <label class="label" v-if="index == 0">Label</label>
                <p class="control">
                  <input class="input" type="text" placeholder="Label" v-model="band.label.text">
                </p>
              </div>-->
              <div class="field">
                <label class="label" v-if="index == 0">&nbsp;</label>
                <div class="control">
                  <button class="button is-danger" @click.stop="removePlotBand(index)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-info" @click.stop="addPlotBand">
                Add Plot Band
              </button>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click.stop="save" :disabled="!canSave">Save</button>
          <button class="button" @click.stop="cancel">Cancel</button>
          <button class="button is-info" @click.stop="copy" style="margin-left: auto;" v-if="sensor">Copy</button>
          <button class="button is-danger" @click.stop="remove" v-if="sensor">Remove</button>
        </footer>
      </div>
      <!--<button class="modal-close is-large" aria-label="close" @click.stop="cancel"></button>-->
    </div>
  `
})
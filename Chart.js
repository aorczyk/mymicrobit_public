// Todo: https://www.highcharts.com/demo/combo-multi-axes
app.component('chart', {
    inject: ['sendData', 'measurementsData'],
    props: ['chart', 'data', 'settings'],
    data() {
        return {
            settingsVisible: false,
            chartId: 0,
            width: null,
            fromColumn: 1,
            span: -1,
            fromRow: null,
            rowSpan: 1,
            chartOptions: {
                chart: {
                    type: 'line',
                    width: null,
                    // panKey: 'ctrl',
                    zoomType: 'xy'
                },
                time: {
                    getTimezoneOffset: function () {
                        var timedifference = new Date().getTimezoneOffset();
                        return timedifference;
                    }
                },
                title: {
                    text: this.chart.title
                },
                subtitle: {
                    text: this.chart.subtitle
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: this.chart.yAxis,
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: false
                        },
                        enableMouseTracking: true
                    },
                    series: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                series: [],
                exporting: {
                    enabled: true,
                },
                navigation: {
                    buttonOptions: {
                        verticalAlign: 'top',
                        // align: 'left',
                        y: -4,
                        x: -25
                    }
                }
            },
            drag: false
        }
    },
    mounted() {
        this.initDataChart()
    },
    computed: {
        measurementsDataLength() {
            return this.measurementsData.length;
        },
        gridColumn() {
            let from = this.chart.fromColumn ? this.chart.fromColumn : 'auto';
            let span = this.chart.span ? `span ${this.chart.span}` : -1;

            let out = `${from} / ${span}`;
            return out;
        },
        gridRow() {
          let out = null

          let from = this.chart.fromRow ? this.chart.fromRow : 'auto';
          let span = this.chart.rowSpan ? `span ${this.chart.rowSpan}` : -1;
          out = {'grid-row': `${from} / ${span}`};

          return out
        },
        dataColumns() {
            return this.chart.series.map(x => x.dataColumn).join(',')
        },
        height() {
          let out = '300px';

          if (this.chart.rowSpan){
            out = 300 * this.chart.rowSpan + 5 * (this.chart.rowSpan - 1) + 2 * this.chart.rowSpan + 'px'
          }

          return out
        }
    },
    watch: {
        settingsVisible(visible) {
            this.$emit('keyboard', !visible)

            if (!visible) {
                this.initDataChart()
            }
        },
        'settings.consoleVisible'(visible) {
            this.$nextTick(() => {
                this.$refs.chart.chart.reflow();
            })
        },
        measurementsDataLength: {
            deep: true,
            handler(newValue, lastValue) {
                if (newValue == 0) {
                    this.initDataChart()
                } else {
                    let newRows = this.measurementsData.slice(lastValue);
                    this.updateChartData(newRows)
                }
            }
        },
        gridColumn() {
            this.$nextTick(() => {
                this.$refs.chart.chart.reflow();
            })
        },
        gridRow() {
          this.$nextTick(() => {
              this.$refs.chart.chart.reflow();
          })
        },
    },
    methods: {
        initDataChart() {
            this.chartOptions.title.text = this.chart.title;
            this.chartOptions.subtitle.text = this.chart.subtitle;

            // Migration
            if (!Array.isArray(this.chart.yAxis)) {
                this.chart.yAxis = [{
                    title: {
                        text: this.chart.yAxisTitle
                    },
                    opposite: false,
                    labels: {
                      format: '',
                      style: {
                          color: ''
                      }
                    },
                    min: null,
                    max: null,
                }]
            }

            this.chartOptions.yAxis = this.chart.yAxis;

            this.chartOptions.series = [];

            for (let i in this.chart.series) {
                let data = this.measurementsData.map((x, n) => {
                    return typeof this.chart.xAxisDataColumn == 'number' ? [x[this.chart.xAxisDataColumn], x[this.chart.series[i].dataColumn]] : [n, x[this.chart.series[i].dataColumn]]
                })

                if (this.chart.dataNrOnChart) {
                    data = data.slice(this.measurementsData.length - this.chart.dataNrOnChart)
                }

                // Migration
                if (!this.chart.series[i].type){
                  this.chart.series[i].type = this.chart.chartType;
                }

                if (!this.chart.series[i].id){
                  this.chart.series[i].id = this.chart.series[i].name;
                }

                if (!this.chart.series[i].hasOwnProperty('dataLabels')){
                  this.chart.series[i].dataLabels = false;
                }

                if (!this.chart.series[i].hasOwnProperty('marker')){
                  this.chart.series[i].marker = false;
                }

                if (!this.chart.series[i].hasOwnProperty('yAxis')){
                  this.chart.series[i].yAxis = 0;
                }

                if (!this.chart.series[i].hasOwnProperty('color')){
                  this.chart.series[i].color = '';
                }

                this.chartOptions.series[i] = {
                    name: this.chart.series[i].name,
                    color: this.chart.series[i].color,
                    data: data,
                    type: this.chart.series[i].type,
                    yAxis: this.chart.series[i].yAxis,
                    dataLabels: {
                      enabled: this.chart.series[i].dataLabels || false
                    },
                    marker: {
                      enabled: this.chart.series[i].marker || false
                    }
                }
            }

            // Migration
            if (!this.chart.hasOwnProperty('xAxisType')){
              this.chart.xAxisType = 'datetime';
            }
            if (!this.chart.hasOwnProperty('rowSpan')){
              this.chart.rowSpan = 1;
            }

            this.chartOptions.xAxis.type = this.chart.xAxisType;

            if (this.chart.xAxisDataColumn && typeof this.chart.xAxisDataColumn == 'string'){
              this.chart.xAxisDataColumn = Number(this.chart.xAxisDataColumn)
            }

            this.$nextTick(() => {
                let chartObj = this.$refs.chart.chart;
                chartObj.redraw();
                // chartObj.reflow();
            })
        },
        updateChartData(newRows) {
            let chartObj = this.$refs.chart.chart;

            for (let row of newRows) {
                for (let i in chartObj.series) {
                  let pointX = typeof this.chart.xAxisDataColumn == 'number' ? row[this.chart.xAxisDataColumn] : this.measurementsData.length;
                  let pointY = row[this.chart.series[i].dataColumn];

                  if (pointY != null){
                    if (this.chart.dataNrOnChart && chartObj.series[i] && chartObj.series[i].data.length >= this.chart.dataNrOnChart) {
                      chartObj.series[i].data[0].remove(false, false);
                    }
                    chartObj.series[i].addPoint(
                        [pointX,  pointY]
                    )
                  }
                }
            }
        },
        save() {
            this.settingsVisible = false;
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
      <div class="card-qauge" :style="{'grid-column': gridColumn, ...gridRow, height: height}">
        <chart-settings v-if="settingsVisible" :chart="chart" @save="save" @cancel="cancel" @remove="remove" @copywidget="copy"></chart-settings>
        <highcharts ref="chart" class="chart" :options="chartOptions" :key="chartId"></highcharts>
  
        <div class="gauge-status chart">
          <label class="info">{{ dataColumns }}</label>
        </div>
  
        <div class="gauge-settings" @click.stop="settingsVisible = true">
          <span class="icon">
            <i class="fas fa-cog"></i>
          </span>
        </div>
  
        <div class="handle chart-handle"><i class="fas fa-grip-horizontal"></i></div>
      </div>
    `
})


app.component('chart-settings', {
    inject: {
      confirm: 'confirm',
      HighchartsColors: 'HighchartsColors'
    },
    components: {
      draggable,
    },
    props: ['chart'],
    data() {
        return {
            chartSettings: {
                id: new Date().getTime(),
                type: 'chart',
                chartType: 'line',
                title: 'New chart',
                subtitle: '',
                xAxisDataColumn: null,
                xAxisType: null,
                yAxis: [{
                  title: {
                    text: 'Y Axis 1'
                  },
                  opposite: false,
                  labels: {
                    format: '',
                    style: {
                        color: ''
                    }
                  },
                  min: null,
                  max: null
                }],
                yAxisTitle: 'Values',
                // width: '1',
                fromColumn: 1,
                span: null,
                fromRow: null,
                rowSpan: 1,
                series: [{
                    name: 'Series 1',
                    dataColumn: 1,
                    type: 'line',
                    dataLabels: false,
                    marker: false,
                    yAxis: 0
                }],
                dataLabels: true,
                enableMouseTracking: false,
                showDataLabels: false,
                dataNrOnChart: null,
                drag: false,
            },
            color: ''
        }
    },
    created() {
        if (this.chart) {
            this.chartSettings = JSON.parse(JSON.stringify(this.chart))

            if (this.chartSettings.showDataLabels == undefined) {
                this.chartSettings.showDataLabels = false
            }
        }
    },
    computed: {
        canSave() {
            return this.chartSettings.title && this.chartSettings.series.length;
        }
    },
    methods: {
        save() {
            if (this.chart) {
                for (let key in this.chartSettings) {
                    this.chart[key] = this.chartSettings[key]
                }

                // Hack - yAxis title color
                for (item of this.chart.yAxis){
                  item.title.style = {
                    color: item.labels.style.color
                  }
                }
            }
            this.$emit('save', this.chartSettings)
        },
        cancel() {
            this.$emit('cancel')
        },
        remove() {
          this.confirm('Are you sure you want to remove the chart?', () => {
            this.$emit('remove', this.chartSettings.id)
          })
        },
        copy() {
            let sensorCopy = JSON.parse(JSON.stringify(this.chartSettings))
            sensorCopy.id = new Date().getTime();
            sensorCopy.name += ' copy'
            this.$emit('copywidget', sensorCopy)
        },
        addSeries() {
            this.chartSettings.series.push({
                id: new Date().getTime(),
                name: 'Series ' + this.chartSettings.series.length,
                dataColumn: 1,
                color: '',
                data: [],
                type: 'line',
                yAxis: 0,
                dataLabels: false,
                marker: false
            })
        },
        removeSeries(index) {
          this.chartSettings.series.splice(index, 1)
        },
        addYaxis() {
          this.chartSettings.yAxis.push({
            title: {
              text: 'Y Axis ' + (this.chartSettings.yAxis.length + 1),
              style: {
                color: ''
              }
            },
            opposite: false,
            labels: {
              format: '',
              style: {
                  color: ''
              }
            },
            min: null,
            max: null
          })
      },
      removeYaxis(index) {
          this.chartSettings.yAxis.splice(index, 1)
      }
    },
    template: `
      <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card" style="width:900px;">
          <header class="modal-card-head">
            <p class="modal-card-title" v-if="chart">Chart settings</p>
            <p class="modal-card-title" v-else>New chart</p>
            <button class="delete" aria-label="close" @click.stop="cancel"></button>
          </header>
          <section class="modal-card-body">
            <div class="field">
              <label class="label">Title</label>
              <div class="control">
                <input class="input" :class="{'is-danger': !chartSettings.title}" type="text" v-model="chartSettings.title">
              </div>
            </div>
  
            <div class="field">
              <label class="label">Subtitle</label>
              <div class="control">
                <input class="input" type="text" v-model="chartSettings.subtitle">
              </div>
            </div>

            <!--
            <div class="field">
              <label class="label">Type</label>
              <div class="control">
                <span class="select">
                  <select v-model="chartSettings.chartType">
                    <option value="line">Line</option>
                    <option value="column">Column</option>
                  </select>
                </span>
              </div>
            </div>
            -->
            <div class="box-container">
              <div class="box">
                <div class="field">
                  <label class="label has-text-info">Size</label>
                </div>
      
                <div class="field is-horizontal">
                  <div class="field-body">
                    <div class="field">
                      <label class="label">Start column</label>
                      <p class="control">
                        <input class="input" type="number" placeholder="auto" v-model.number="chartSettings.fromColumn">
                      </p>
                    </div>
                    <div class="field">
                    <label class="label">Column span</label>
                      <p class="control">
                        <input class="input" type="number" placeholder="full width" v-model.number="chartSettings.span">
                      </p>
                    </div>
                  </div>
                </div>

                <div class="field is-horizontal">
                  <div class="field-body">
                    <div class="field">
                      <label class="label">Start row</label>
                      <p class="control">
                        <input class="input" type="number" placeholder="auto" v-model.number="chartSettings.fromRow">
                      </p>
                    </div>
                    <div class="field">
                    <label class="label">Row span</label>
                      <p class="control">
                        <input class="input" type="number" placeholder="auto" v-model.number="chartSettings.rowSpan">
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="box" style="height: fit-content">
                <div class="field">
                  <label class="label has-text-info">X Axis</label>
                </div>

                <div class="field is-horizontal">
                  <div class="field-body">
                    <div class="field">
                      <label class="label">Type</label>
                      <div class="control">
                        <span class="select">
                          <select v-model="chartSettings.xAxisType">
                            <option value="null">None</option>
                            <option value="linear">Linear</option>
                            <option value="logarithmic">Logarithmic</option>
                            <option value="datetime">Datetime</option>
                          </select>
                        </span>
                      </div>
                    </div>

                    <div class="field">
                      <label class="label">Data Column Number</label>
                      <div class="control">
                        <input class="input" type="number" placeholder="Auto" v-model.number="chartSettings.xAxisDataColumn">
                      </div>
                    </div>
                  </div>
                </div>

                <div class="field">
                  <label class="label">Max. number of x data on the chart</label>
                  <div class="control">
                    <input class="input" type="number" v-model.number="chartSettings.dataNrOnChart" placeholder="All">
                  </div>
                </div>
              </div>
            </div>
  
            <div class="box">
              <div class="field">
                <label class="label has-text-info">Y Axis</label>
              </div>

              <table class="table-settings">
                <thead>
                  <tr>
                    <th></th>
                    <th>Title</th>
                    <th style="width: 50px;">Color</th>
                    <th>Opposite</th>
                    <th style="width: 100px;">Format</th>
                    <th style="width: 80px;">Min</th>
                    <th style="width: 80px;">Max</th>
                    <th></th>
                  </tr>
                </thead>
                <draggable ref="widgetsContainer" v-model="chartSettings.yAxis" item-key="title.text" handle=".button-settings-handle"
                @start="drag=true" @end="drag=false" :force-fallback="true" :scroll-sensitivity="200" :animation="150" tag="tbody">
                  <template #item="{element, index}">
                    <tr>
                      <td>
                        <span class="button-settings-handle"><i class="fas fa-grip-vertical"></i></span>
                      </td>
                      <td>
                        <input class="input yAxis-title" type="text" placeholder="From" :title="element.title.text" v-model="element.title.text">
                      </td>
                      <td>
                        <color-selector v-model="element.labels.style.color"></color-selector>
                      </td>
                      <td>
                        <span class="select">
                          <select v-model="element.opposite">
                            <option :value="true">Yes</option>
                            <option :value="false">No</option>
                          </select>
                        </span>
                      </td>
                      <td>
                        <input class="input" type="text" placeholder="Auto" v-model="element.labels.format">
                      </td>
                      <td>
                        <input class="input" type="number" placeholder="Auto" v-model.number="element.min">
                      </td>
                      <td>
                        <input class="input" type="number" placeholder="Auto" v-model.number="element.max">
                      </td>
                      <td>
                        <button class="button is-danger" @click.stop="removeYaxis(index)" :disabled="chartSettings.yAxis.length == 1"><i class="fas fa-times"></i></button>
                      </td>
                    </tr>
                  </template>
                </draggable>
              </table>

              <div class="field">
              </div>

              <div class="field">
                <div class="control">
                  <button class="button is-info" @click.stop="addYaxis">
                    Add Y Axis
                  </button>
                </div>
              </div>
            </div>

            <div class="box">
              <div class="field">
                <label class="label has-text-info">Data Series</label>
              </div>

              <table class="table-settings">
                <thead>
                  <tr>
                    <th></th>
                    <th style="min-width: 120px;">Name</th>
                    <th style="width: 50px;">Data Column</th>
                    <th style="width: 50px;">Type</th>
                    <th style="width: 50px;">Color</th>
                    <th>Y Axis</th>
                    <th>Labels</th>
                    <th>Marker</th>
                    <th></th>
                  </tr>
                </thead>
                <draggable ref="widgetsContainer" v-model="chartSettings.series" item-key="id" handle=".button-settings-handle"
                @start="drag=true" @end="drag=false" :force-fallback="true" :scroll-sensitivity="200" :animation="150" tag="tbody">
                  <template #item="{element, index}">
                    <tr>
                      <td>
                        <div class="button-settings-handle"><i class="fas fa-grip-vertical"></i></div>
                      </td>
                      <td>
                        <input class="input" type="text" placeholder="From" v-model="element.name">
                      </td>
                      <td>
                        <input class="input" type="number" placeholder="To" v-model="element.dataColumn">
                      </td>
                      <td>
                        <span class="select">
                          <select v-model="element.type">
                            <option value="line">Line</option>
                            <option value="column">Column</option>
                            <option value="spline">Spline</option>
                          </select>
                        </span>
                      </td>
                      <td>
                        <color-selector v-model="element.color"></color-selector>
                      </td>
                      <td>
                        <span class="select">
                          <select v-model="element.yAxis" style="width: 120px;" :title="chartSettings.yAxis[element.yAxis] ? chartSettings.yAxis[element.yAxis].title.text : ''">
                            <option :value="null">Auto</option>
                            <option :value="index" v-for="item, index in chartSettings.yAxis">{{item.title.text}}</option>
                          </select>
                        </span>
                      </td>
                      <td>
                        <span class="select">
                          <select v-model="element.dataLabels">
                            <option :value="true">Yes</option>
                            <option :value="false">No</option>
                          </select>
                        </span>
                      </td>
                      <td>
                        <span class="select">
                          <select v-model="element.marker">
                            <option :value="true">Yes</option>
                            <option :value="false">No</option>
                          </select>
                        </span>
                      </td>
                      <td>
                        <button class="button is-danger" @click.stop="removeSeries(index)">
                          <i class="fas fa-times"></i>
                        </button>
                      </td>
                    </tr>
                  </template>
                </draggable>
              </table>

              <div class="field">
              </div>

              <div class="field">
                <div class="control">
                  <button class="button is-info" @click.stop="addSeries">
                    Add Series
                  </button>
                </div>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button is-success" @click.stop="save" :disabled="!canSave">Save</button>
            <button class="button" @click.stop="cancel">Cancel</button>
            <button class="button is-info" @click.stop="copy" style="margin-left: auto;" v-if="chart">Copy</button>
            <button class="button is-danger" @click.stop="remove" v-if="chart">Remove</button>
          </footer>
        </div>
      </div>
    `
})
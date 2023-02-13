app.component('control-settings', {
    inject: ['sendData', 'confirm'],
    components: {
        draggable,
    },
    props: ['item', 'settings'],
    data() {
        return {
            controlSettings: {
                id: new Date().getTime(),
                type: 'control',
                name: 'New control panel',
                buttons: [{
                    id: new Date().getTime(),
                    name: 'Button 1',
                    command: 'command_1',
                    color: '',
                    style: 'is-info',
                    label: '',
                    dataColumn: '',
                    outputValue: '',
                    hasInput: false,
                    inputValue: ''
                }],
            },
            buttonTypes: [
                { name: 'info', value: 'is-info' },
                { name: 'success', value: 'is-success' },
                { name: 'warning', value: 'is-warning' },
                { name: 'danger', value: 'is-danger' },
                { name: 'primary', value: 'is-primary' },
                { name: 'link', value: 'is-link' },
            ],
            drag: false
        }
    },
    created() {
        if (this.item) {
            this.controlSettings = JSON.parse(JSON.stringify(this.item))

            // --- Migration ---
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
            return this.controlSettings.name;
        },
    },
    methods: {
        save() {
            if (this.item) {
                for (let key in this.controlSettings) {
                    this.item[key] = this.controlSettings[key]
                }
            }
            this.$emit('save', this.controlSettings)
        },
        cancel() {
            this.$emit('cancel')
        },
        remove() {
          this.confirm('Are you sure you want to remove the control panel?', () => {
            this.$emit('remove', this.controlSettings.id)
          })
        },
        copy() {
            let copy = JSON.parse(JSON.stringify(this.controlSettings))
            copy.id = new Date().getTime();
            copy.name += ' copy'
            this.$emit('copywidget', copy)
        },
        addButton() {
            this.controlSettings.buttons.push({
                id: new Date().getTime(),
                name: 'Button',
                command: '',
                color: '',
                style: 'is-info',
                hasInput: false,
                inputValue: '',
                label: '',
                dataColumn: '',
                outputValue: ''
            })
        },
        removePlotBand(index) {
            this.controlSettings.buttons.splice(index, 1)
        }
    },
    template: `
      <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title" v-if="item">Control panel settings</p>
            <p class="modal-card-title" v-else>New control panel</p>
            <button class="delete" aria-label="close" @click.stop="cancel"></button>
          </header>
          <section class="modal-card-body">
            <div class="field">
              <label class="label">Name</label>
              <div class="control">
                <input class="input" :class="{'is-danger': !controlSettings.name}" type="text" v-model="controlSettings.name">
              </div>
            </div>
  
            <div class="field">
              <label class="label has-text-info">Items</label>
            </div>

            <table class="table-settings">
              <thead>
                <tr>
                  <th></th>
                  <th style="white-space: nowrap; width:100px;">Label</th>
                  <th style="white-space: nowrap; width:100px;">Button</th>
                  <th>Command</th>
                  <th>Input</th>
                  <th style="white-space: nowrap;" title="Show data from column">Output <i class="fa-solid fa-circle-question"></i></th>
                  <th>Style</th>
                  <th></th>
                </tr>
              </thead>
              <draggable ref="widgetsContainer" v-model="controlSettings.buttons" item-key="id" handle=".button-settings-handle"
              @start="drag=true" 
              @end="drag=false" :force-fallback="true" :scroll-sensitivity="200" :animation="150" tag="tbody">
                <template #item="{element, index}">
                  <tr>
                    <td>
                      <span class="button-settings-handle"><i class="fas fa-grip-vertical"></i></span>
                    </td>
                    <td>
                      <input class="input" type="text" v-model="element.label" :title="element.label">
                    </td>
                    <td>
                      <input class="input" type="text" v-model="element.name" :title="element.name">
                    </td>
                    <td>
                      <input class="input" type="text" v-model="element.command" :title="element.command">
                    </td>
                    <td>
                      <div class="select">
                        <select v-model="element.hasInput">
                          <option :value="true">Yes</option>
                          <option :value="false">No</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <input class="input" type="text" v-model="element.dataColumn">
                    </td>
                    <td>
                      <div class="select" :class="[element.style]">
                        <select v-model="element.style">
                          <option v-for="style in buttonTypes" :value="style.value">{{ style.name }}</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <button class="button is-danger" @click.stop="removePlotBand(index)">
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
                <button class="button is-info" @click.stop="addButton">
                  Add Item
                </button>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button is-success" @click.stop="save" :disabled="!canSave">Save</button>
            <button class="button" @click.stop="cancel">Cancel</button>
            <button class="button is-info" @click.stop="copy" style="margin-left: auto;" v-if="item">Copy</button>
            <button class="button is-danger" @click.stop="remove" v-if="item">Remove</button>
          </footer>
        </div>
        <!--<button class="modal-close is-large" aria-label="close" @click.stop="cancel"></button>-->
      </div>
    `
})

app.component('control', {
    inject: ['sendData', 'measurementsData'],
    props: ['item', 'data', 'settings'],
    data() {
        return {
            settingsVisible: false,
        }
    },
    mounted() {
    },
    computed: {
      value() {
        let out = 0
        if (this.measurementsData[this.measurementsData.length - 1] && this.sensor.status){
        // if (this.measurementsData[this.measurementsData.length - 1] && this.measurementsData[this.measurementsData.length - 1][this.sensor.dataColumn] !== null){
          out = this.measurementsData[this.measurementsData.length - 1][this.sensor.dataColumn]
        }

        return out
      }
    },
    watch: {
        settingsVisible(visible) {
            this.$emit('keyboard', !visible)
        },
        measurementsData: {
          deep: true,
          handler() {
            for (let item of this.item.buttons){
              if (item.dataColumn != ''){
                if (this.measurementsData[this.measurementsData.length - 1]){
                  let output = this.measurementsData[this.measurementsData.length - 1][item.dataColumn]

                  if (output != null){
                    item.outputValue = output
                  }
                }
              }
            }
          }
        }
    },
    methods: {
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
        copy(item) {
            this.$emit('copywidget', item)
            this.settingsVisible = false;
        },
        sendCommand(button) {
          let command = button.command;

          if (button.hasInput){
            if (button.command.split('').pop() != ';'){
              command += ';'
            }
            command += button.inputValue;
          }

          if (command != ''){
            this.sendData(command)
          }
        },
        onInputChange(button){
          if (!(button.name && button.hasInput)){
            this.sendCommand(button)
          }
        }
    },
    template: `
      <div class="card-qauge control-panel">
        <control-settings v-if="settingsVisible" :item="item" @save="save" @cancel="cancel" @remove="remove" @copywidget="copy"></control-settings>
  
        <div class="control-buttons">
            <template v-for="button in item.buttons">
            <div class="item">
              <div class="item-label" v-if="button.label">
                {{button.label}}
              </div>

              <input class="input" type="text" v-if="button.dataColumn" v-model="button.outputValue" :title="'Data from column ' + button.dataColumn" disabled>

              <button class="button" :class="button.style" @click.stop="sendCommand(button)" :title="button.command" v-if="!button.hasInput && button.name">{{ button.name }}</button>

              <div class="field has-addons" v-if="button.hasInput">
                <div class="control">
                  <input class="input" type="text" v-model="button.inputValue" @change="onInputChange(button)" :title="button.command">
                </div>
                <div class="control" v-if="button.name">
                  <a class="button" :class="button.style" @click.stop="sendCommand(button)" :title="button.command">
                    {{ button.name }}
                  </a>
                </div>
              </div>
            </div>
            </template>
        </div>
  
        <div class="gauge-settings control-panel" @click.stop="settingsVisible = true">
          <span class="icon">
            <i class="fas fa-cog"></i>
          </span>
        </div>
  
        <div class="handle control-panel">
          <i class="fa-solid fa-grip-vertical"></i>
        </div>
      </div>
    `
});  
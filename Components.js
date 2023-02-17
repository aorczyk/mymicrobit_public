// console.log(app.component)
app.component('console', {
  inject: ['sendData', 'tabs', 'receivedData'],
  data() {
    return {
      activeTab: 0,
      stringToSend: ''
    }
  },
  computed: {
    addTimestamp() {
      return this.tabs[this.activeTab].settings.includes('addTimestamp')
    },
    loggedData() {
      return this.tabs[this.activeTab].data;
    }
  },
  watch: {
    loggedData: {
      deep: true,
      handler() {
        if (this.tabs[this.activeTab].settings.includes('showLatestData')) {
          this.$nextTick(() => {
            let divConsole = this.$refs.console;
            divConsole.scrollTop = divConsole.scrollHeight;
          });
        }
      }
    },
    receivedData: {
      deep: true,
      handler(newVal) {
        let lastCommandParts = newVal[newVal.length - 1].split(';');

        let command = lastCommandParts[0]

        if (command == 'clearConsole') {
          for (let tab in this.tabs){
            this.tabs[tab].data.splice(0, this.tabs[tab].data.length)
          }
        }
      }
    },
  },
  methods: {
    send() {
      this.sendData(this.stringToSend);
      this.stringToSend = '';
    },
    timestamp() {
      return moment().format(this.momentFormat);
    },
    getConsoleRowColor(row) {
      row.saved ? '#d9ffb3' : row.logged ? '#ffffb3' : 'white'
      if (row.saved) {
        return '#d9ffb3';
      } else if (row.logged) {
        return '#ffffb3';
      } else {
        return 'white'
      }
    },
    clearConsole() {
      this.tabs[this.activeTab].data.splice(0, this.tabs[this.activeTab].data.length)
    },
    download() {
      let csvContent = "";
      let lineBreak = encodeURI("\n");

      // let csvHeader = [];
      // for (let header of this.tableHeader){
      //     if (header.selected && header.key){
      //         csvHeader.push(header.value);
      //     }
      // }

      // csvContent += csvHeader.join(",") + lineBreak;

      csvContent += this.tabs[this.activeTab].data.map(row => {
        let out = [];
        if (this.addTimestamp){
          out.push(row.timestamp)
        }
        out.push(encodeURIComponent(row.data));
        return out.join(",")
      }).join(lineBreak);

      var link = document.createElement("a");
      link.setAttribute("href", "data:text/csv;charset=utf-8," + csvContent);
      link.setAttribute("download", this.downloadFileName ? this.downloadFileName : this.tabs[this.activeTab].name.replace(' ', '_') + '.csv');
      document.body.appendChild(link);

      link.click();
    },
    keyboard(value){
      this.$emit('keyboard', value)
    },
    close() {
      this.$emit('close')
    }
  },
  template: `
        <section class="console">
            <div class="console-tabs tabs is-boxed">
              <ul>
                  <li :class="{'is-active': activeTab == index}" @click.stop="activeTab = index" v-for="tab, index in tabs"><a>{{ tab.name }} ({{ tab.data.length }})</a></li>
              </ul>
              <div class="console-tabs-buttons field is-grouped">
                <p class="control">
                    <button class="button is-danger" @click.stop="clearConsole" title="Clear the tab">
                      <span class="icon is-small">
                        <i class="fa-solid fa-trash-can"></i>
                      </span>
                    </button>
                </p>
                <p class="control">
                    <button class="button is-info" @click.stop="download" title="Download a csv file">
                      <span class="icon is-small">
                        <i class="fas fa-download"></i>
                      </span>
                    </button>
                </p>
                <p class="control">
                    <button class="button" @click.stop="close" title="Close">
                      <span class="icon is-small">
                        <i class="fa-sharp fa-solid fa-chevron-right"></i>
                      </span>
                    </button>
                </p>
              </div>
            </div>
            <div class="console-body" ref="console">
              <div class="row" :style="{'background-color': getConsoleRowColor(row)}" v-for="row, index in loggedData" :key="index">
                  <span class="index">{{ index + 1 }}</span>
                  <span>
                    <span class="row-timestamp" v-if="addTimestamp">{{ row.timestamp }}</span>
                    <span class="row-direction received" :class="{'is-danger': row.status}" v-if="!row.direction">&lt;</span>
                    <span class="row-direction send" :class="{'is-danger': row.status}" v-else>&gt;</span>
                    <span>{{ row.data }}</span>
                  </span>
              </div>
            </div>
            <div class="field has-addons">
              <div class="control is-expanded">
                <input class="input is-small" name="console-input" id="console-input" autocomplete="on" type="text" placeholder="Data to send" v-model="stringToSend" @keyup.enter="send" @focus="keyboard(false)" @blur="keyboard(true)">
              </div>
              <div class="control">
                <a class="button is-info is-small" @click.stop="send">
                  Send
                </a>
              </div>
            </div>
            <div class="console-footer field is-grouped">
              <p class="control">
                  <label class="checkbox">
                  <input type="checkbox" value="showLatestData" v-model="tabs[activeTab].settings">
                  Show latest data
                  </label>
              </p>
              <p class="control">
                  <label class="checkbox">
                  <input type="checkbox" value="addTimestamp" v-model="tabs[activeTab].settings">
                  Show timestamp
                  </label>
              </p>
            </div>
        </section>
    `,
})


app.component('confirmation', {
  props:['text', 'action'],
  data() {
    return {
    }
  },
  template: `
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Warning</p>
        <button class="delete" aria-label="close" @click.stop="cancel"></button>
      </header>
      <section class="modal-card-body">
        {{ text }}
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" @click.stop="action(); $emit('close')">Ok</button>
        <button class="button" @click.stop="$emit('close')">Cancel</button>
      </footer>
    </div>
  </div>
  `
})


app.component('openimage', {
  props:['src', 'height'],
  data() {
    return {
    }
  },
  computed: {
    style() {
      if (this.height){
        return {height: this.height}
      }

      return {}
    }
  },
  template: `
  <div class="openimage">
    <a :href="src" target="_blank"><img :style="style" :src="src"/></a>
  </div>
  `
})


app.component('color-selector', {
  inject: ['HighchartsColors'],
  props: ['modelValue'],
  emits: ['update:modelValue'],
  data() {
    return {
      isVisible: false
    }
  },
  methods: {
    toggle() {
      this.isVisible = !this.isVisible
      console.log('value', this.value)
    },
    select(color) {
      this.$emit('update:modelValue', color);
      this.isVisible = false;
    }
  },
  template: `
    <div class="color-selector">
      <button class="button" :style="{background: modelValue}" @click.stop="toggle"><i class="fa-solid fa-paintbrush"></i></button>
      <div class="selector" v-if="isVisible">
        <div class="item" @click.stop="select(modelValue)" :style="{background: modelValue}">
        </div>
        <input class="input is-small" style="grid-column: 2/-1;"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
        />
        <div class="item" :style="{background: color}" @click.stop="select(color)" v-for="color in HighchartsColors">
        </div>
      </div>
    </div>
  `
})
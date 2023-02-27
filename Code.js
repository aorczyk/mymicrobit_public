let keyMap = {
    8:'backspace',
    9:'tab',
    13:'enter',
    16:'shift',
    17:'ctrl',
    18:'alt',
    19:'pause/break',
    20:'caps lock',
    27:'escape',
    33:'page up',
    32:'Space',
    34:'page down',
    35:'end',
    36:'home',
    37:'arrow left',
    38:'arrow up',
    39:'arrow right',
    40:'arrow down',
    44:'print screen',
    45:'insert',
    46:'delete',
    48:'0',
    49:'1',
    50:'2',
    51:'3',
    52:'4',
    53:'5',
    54:'6',
    55:'7',
    56:'8',
    57:'9',
    65:'a',
    66:'b',
    67:'c',
    68:'d',
    69:'e',
    70:'f',
    71:'g',
    72:'h',
    73:'i',
    74:'j',
    75:'k',
    76:'l',
    77:'m',
    78:'n',
    79:'o',
    80:'p',
    81:'q',
    82:'r',
    83:'s',
    84:'t',
    85:'u',
    86:'v',
    87:'w',
    88:'x',
    89:'y',
    90:'z',
    91:'left window key',
    92:'right window key',
    93:'select key',
    96:'numpad 0',
    97:'numpad 1',
    98:'numpad 2',
    99:'numpad 3',
    100:'numpad 4',
    101:'numpad 5',
    102:'numpad 6',
    103:'numpad 7',
    104:'numpad 8',
    105:'numpad 9',
    106:'multiply',
    107:'add',
    109:'subtract',
    110:'decimal point',
    111:'divide',
    112:'f1',
    113:'f2',
    114:'f3',
    115:'f4',
    116:'f5',
    117:'f6',
    118:'f7',
    119:'f8',
    120:'f9',
    121:'f10',
    122:'f11',
    123:'f12',
    144:'num lock',
    145:'scroll lock',
    182:'My Computer (multimedia keyboard)',
    183:'My Calculator (multimedia keyboard)',
    186:'semi-colon',
    187:'equal sign',
    188:'comma',
    189:'dash',
    190:'period',
    191:'forward slash',
    219:'open bracket',
    220:'back slash',
    221:'close braket',
    222:'single quote',
}

app.component('code-settings', {
    inject: ['sendData', 'confirm'],
    components: {
        draggable,
    },
    props: ['item', 'settings'],
    data() {
        return {
            controlSettings: {
                id: new Date().getTime(),
                type: 'code',
                name: 'New program',
                program: [],
                showRowNumber: false
            },
            drag: false
        }
    },
    created() {
        if (this.item) {
            this.controlSettings = JSON.parse(JSON.stringify(this.item))
        }
    },
    computed: {
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
            //   this.confirm('Are you sure you want to remove the code panel?', () => {
            //     this.$emit('remove', this.controlSettings.id)
            //   })

            this.$emit('remove', this.controlSettings.id)
        },
        copy() {
            let copy = JSON.parse(JSON.stringify(this.controlSettings))
            copy.id = new Date().getTime();
            copy.name += ' copy'
            this.$emit('copywidget', copy)
        },
        keyboard(value){
            this.$emit('keyboard', value)
        }
    },
    template: `
      <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title" v-if="item">Code panel settings</p>
            <p class="modal-card-title" v-else>New code panel</p>
            <button class="delete" aria-label="close" @click.stop="cancel"></button>
          </header>
          <section class="modal-card-body">
            <div class="field">
              <label class="label">Name</label>
              <div class="control">
                <input class="input" :class="{'is-danger': !controlSettings.name}" type="text" v-model="controlSettings.name" @focus="keyboard(false)" @blur="keyboard(true)">
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


app.component('dropdown', {
    props: ['items', 'modelValue', 'background'],
    emits: ['update:modelValue'],
    data() {
        return {
            isOpen: false
        }
    },
    computed: {
        selectedItem(){
            let out = this.items[0];
            if (this.items){
                for (let item of this.items){
                    if (item.value == this.modelValue){
                        out = item
                    }
                }
            }

            return out
        }
    },
    methods: {
        onSelect(item) {
            this.$emit('update:modelValue', item.value)
            this.isOpen = false;
        }
    },
    template: `
    <div class="dropdown" :class="{'is-active': isOpen}">
        <div class="dropdown-trigger">
            <button class="button" :style="{background: background, 'border-color': background == 'none' ? 'transparent' : background}" aria-haspopup="true" aria-controls="dropdown-menu" @click.stop="isOpen = !isOpen">
                <span :style="{color: selectedItem.color}" v-html="selectedItem.html" v-if="selectedItem.html"></span><span v-else>{{selectedItem.name}}</span>
                <span class="icon">
                <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
            </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" style="padding-top: 0;" role="menu">
            <div class="dropdown-content">
                <a class="dropdown-item" style="padding-right: 1rem;" :title="item.name" v-for="item of items" @click.stop="onSelect(item)">
                    <span :style="{color: item.color}" v-html="item.html" v-if="item.html"></span><span v-else>{{item.name}}</span>
                </a>
            </div>
        </div>
    </div>
    `
})

app.component('code-panel-command-condition', {
    inject: ['keysPressed'],
    props: ['condition', 'dataInputs', 'hasNext', 'commandId'],
    data() {
        return {
            boolean: [
                {value: 1, name: 'True', html: '<i class="fa-solid fa-check"></i>'},
                {value: 0, name: 'False', html: '<i class="fa-solid fa-xmark"></i>'},
            ],
            variablesInputs: [
                {value: 8, name: 'Variable 1', html: 'X<sub>1</sub>'},
                {value: 9, name: 'Variable 2', html: 'X<sub>2</sub>'},
                {value: 10, name: 'Variable 3', html: 'X<sub>3</sub>'},
            ],
            comparisonOperators: [
                {value: 2, name: '<', html: '<i class="fa-solid fa-less-than"></i>'},
                {value: 1, name: '>', html: '<i class="fa-solid fa-greater-than"></i>'},
                {value: 3, name: '=', html: '<i class="fa-solid fa-equals"></i>'},
                {value: 4, name: '<>', html: '<i class="fa-solid fa-not-equal"></i>'},
                {value: 6, name: '<v', html: '<i class="fa-solid fa-less-than"></i> <sub>X</sub>'},
                {value: 5, name: '>v', html: '<i class="fa-solid fa-greater-than"></i> <sub>X</sub>'},
                {value: 7, name: '=v', html: '<i class="fa-solid fa-equals"></i> <sub>X</sub>'},
                {value: 8, name: '<>v', html: '<i class="fa-solid fa-not-equal"></i> <sub>X</sub>'},
            ],
            comparisonOperators2: [
                {value: 3, name: '=', html: '<i class="fa-solid fa-equals"></i>'},
                {value: 7, name: '=v', html: '<i class="fa-solid fa-equals"></i> <sub>X</sub>'},
            ],
            comparisonOperators3: [
                {value: 2, name: '<', html: '<i class="fa-solid fa-less-than"></i>'},
                {value: 6, name: '<v', html: '<i class="fa-solid fa-less-than"></i> <sub>X</sub>'},
            ],
            comparisonOperators4: [
                {value: 1, name: '>', html: '<i class="fa-solid fa-greater-than"></i>'},
                {value: 5, name: '>v', html: '<i class="fa-solid fa-greater-than"></i> <sub>X</sub>'},
            ],
            logicalOperators: [
                {value: 0, name: 'and', html: 'and'}, // &and;
                {value: 1, name: 'or', html: 'or'}, // &or;
            ],
            booleanDistance: [
                {value: 1, name: 'Far', html: '<i class="fa-solid fa-check"></i>'},
                {value: 0, name: 'Near', html: '<i class="fa-solid fa-xmark"></i>'},
            ],
            equate: [
                {value: 3, name: '=', html: '<i class="fa-solid fa-equals"></i>'},
            ],
        }
    },
    created() {
    },
    computed: {
        conditionType() {
            return this.condition[0].value
        },
        selectedCondition(){
            let out = this.condition[0].options.filter(x => x.value == this.condition[0].value)[0];
            return out
        },
        operators() {
            let type = this.selectedCondition.operatorsType;
            let out = [];

            if (type == 'boolean'){
                out = this.boolean;
            } else if (type == 'variablesInputs'){
                out = this.variablesInputs;
            } else if (type == 'comparisonOperators'){
                out = this.comparisonOperators;
            } else if (type == 'comparisonOperators2'){
                out = this.comparisonOperators2;
            } else if (type == 'comparisonOperators3'){
                out = this.comparisonOperators3;
            } else if (type == 'comparisonOperators4'){
                out = this.comparisonOperators4;
            } else if (type == 'logicalOperators'){
                out = this.logicalOperators;
            } else if (type == 'booleanDistance'){
                out = this.booleanDistance;
            } else if (type == 'equate'){
                out = this.equate;
            }
            return out
        },
    },
    watch: {
        keysPressed(newVal){

            if (this.focused){
                let code = newVal.replace('18;','')
                let codeValue = Number(code.split(';').join(''))
                // let codeValue = code.split(';').map(x => keyMap[x]).join('+')
    
                // this.condition[2].value = codeValue

                if (codeValue && ![48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,8,46].includes(codeValue)){
                    if ([13,14].includes(this.condition[0].value)){
                        this.condition[2].value = codeValue
                    }
                }
            }
        },
        operators(){
            let operatorValue = this.condition[1].value;

            if (!this.operators.filter(x => x.value == operatorValue).length){
                this.condition[1].value = this.selectedCondition.defaultOperator;
            }

            if (this.selectedCondition.inputType == 'boolean'){
                if (![0,1].includes(this.condition[2].value)){
                    this.condition[2].value = 1
                }
            }
        }
    },
    methods: {
        keyboard(value){
            this.focused = !value;
            this.$emit('keyboard', value)
        },
    },
    template: `
    <div class="command-condition-item">
        <dropdown :items="condition[0].options" v-model.value="condition[0].value" title="Data inputs"></dropdown>
        <dropdown :items="operators" v-model.value="condition[1].value" title="Logical operator" v-if="selectedCondition.showOperators"></dropdown>
        <div class="field has-addons" style="margin-bottom: 0;" v-if="selectedCondition.inputType == 'number'">
            <p class="control">
                <input class="input" type="number" v-model="condition[2].value" @focus="keyboard(false)" @blur="keyboard(true)" @click.stop="()=>{}">
            </p>
        </div>
        <dropdown :items="boolean" v-model.value="condition[2].value" title="Boolean value" v-if="selectedCondition.inputType == 'boolean'"></dropdown>
        <dropdown :items="booleanDistance" v-model.value="condition[2].value" title="Distance" v-if="selectedCondition.inputType == 'booleanDistance'"></dropdown>
        <dropdown :items="variablesInputs" v-model.value="condition[2].value" title="Variable" v-if="selectedCondition.inputType == 'variables'"></dropdown>
        <dropdown :items="logicalOperators" v-model.value="condition[3].value" title="Logical operators" background="none" v-if="hasNext"></dropdown>
    </div>
    `
})

app.component('code-panel-command', {
    inject: ['keysPressed'],
    props: ['command', 'selectedItem','onlyIcons','showRowNumber', 'dataInputs', 'index', 'parentCommands'],
    components: {
        draggable,
    },
    data() {
        return {
            focused: false,
            types: {
                programStart: 'style-program-start',
                programControl: 'style-program-control',
                motorControl: 'style-motor-control',
                systemControl: 'style-system-control',
            },
            backgroundImage: '',
            color: '',
            hasElse: false,
            pfSpeedDirection: [
                {value: 'right', name: 'Right', html: '<i class="fa-solid fa-arrow-rotate-right"></i>'},
                {value: 'left', name: 'Left', html: '<i class="fa-solid fa-arrow-rotate-left"></i>'},
                {value: 'break', name: 'Break', html: '<i class="fa-solid fa-stop" style="color: red;"></i>'},
            ],
            pfCommands: {
                right: [
                    {value: 0b1000000, html: '0'},
                    {value: 0b1000001, html: '1'},
                    {value: 0b1000010, html: '2'},
                    {value: 0b1000011, html: '3'},
                    {value: 0b1000100, html: '4'},
                    {value: 0b1000101, html: '5'},
                    {value: 0b1000110, html: '6'},
                    {value: 0b1000111, html: '7'},
                    {value: 0b1100100, html: '+1'},
                ],
                left: [
                    {value: 0b1000000, html: '0'},
                    {value: 0b1001111, html: '1'},
                    {value: 0b1001110, html: '2'},
                    {value: 0b1001101, html: '3'},
                    {value: 0b1001100, html: '4'},
                    {value: 0b1001011, html: '5'},
                    {value: 0b1001010, html: '6'},
                    {value: 0b1001001, html: '7'},
                    {value: 0b1100101, html: '+1'},
                ],
                break: [
                    {value: 0b1001000, name: 'Break', html: '-'},
                ]
            },
            pfDirection: '',
        }
    },
    created() {
        this.hasElse = this.command.commands2 && this.command.commands2.length;

        if (this.command.id == 4){
            this.pfInit()
        }
    },
    computed: {
        commandClass() {
            let out = [];

            if (this.command.commands){
                out.push('sub-code-block')
            }

            if (this.command.isSelected){
                out.push('selected')
            }

            if (this.command.disabled){
                out.push('disabled')
            }

            if (this.types[this.command.type]){
                out.push(this.types[this.command.type])
            }

            return out;
        },
        keysPressedHuman(){
            if (this.command.id == 14){
                let code = this.command.params[0].value;
                let out = []
    
                while (code >= 1){
                    code = code / 100;
                    let keyCodes = Math.trunc((code - Math.trunc(code)) * 100);

                    code = Math.trunc(code)
    
                    out.push(keyMap[keyCodes])
                }
    
                return out.join(' + ')
            }

            return ''
        },
    },
    watch: {
        keysPressed(newVal){
            if (this.command.id == 14 && this.focused){
                let code = newVal.replace('18;','')
                let codeValue = Number(code.split(';').join(''))

                if (codeValue && ![48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,8,46].includes(codeValue)){
                    this.command.params[0].value = codeValue
                }
            }
        },
        pfCommandValue(){
            this.setPFCommand();
        },
        pfDirection(newVal, oldVal){
            let index;

            if (newVal == 'break'){
                this.command.params[2].value = this.pfCommands['break'][0].value;
                return
            } else if (oldVal){
                index = this.pfCommands[oldVal].findIndex(x => x.value == this.command.params[2].value)
            } else {
                index = this.pfCommands[newVal].findIndex(x => x.value == this.command.params[2].value)
            }

            if (index && index != -1){
                this.command.params[2].value = this.pfCommands[newVal][index].value
            } else {
                this.command.params[2].value = this.pfCommands[newVal][0].value
            }
        },
    },
    methods: {
        pfInit(){
            for (let key in this.pfCommands){
                if (this.pfCommands[key].findIndex(x => x.value == this.command.params[2].value) != -1){
                    this.pfDirection = key
                    break;
                }
            }
        },
        keyboard(value){
            this.focused = !value;
            this.$emit('keyboard', value)
        },
        selectItem(item, index, commands){
            this.$emit('select', item, index, commands)
            if (this.command.onClick){
                this.command.onClick()
            }
        },
        toggleSwitch(param){
            param.value = !param.value
        },
        addCondition(){
            let condition = [
                {value: 15, options: this.dataInputs},
                {value: 1},
                {value: 0},
                {value: 0},
            ]

            this.command.conditions.push(condition)
        },
        removeCondition(){
            this.command.conditions.pop()
        },
        toggleElse(){
            this.hasElse = !this.hasElse

            if (!this.hasElse){
                this.command.commands2 = [];
            }
        },
        onChangeCommands(event) {
            // let eventItem = event.added || event.moved;
            // if (eventItem){
            //     eventItem.command.parent = {
            //         commands: this.command.commands,
            //         index: eventItem.newIndex
            //     }
            // }
        },
        onChangeCommands2(event) {
            // let eventItem = event.added || event.moved;
            // if (eventItem){
            //     eventItem.command.parent = {
            //         commands: this.command.commands2,
            //         index: eventItem.newIndex
            //     }
            // }
        },
        toggleLed(x, y, all) {
            let key = Number(x) * 10 + Number(y);
            let index = this.command.params[1].value.indexOf(key);
            if (index == -1){
                this.command.params[1].value.push(key)
            } else if (!all) {
                this.command.params[1].value.splice(index, 1)
            }
        },
        isLedSelected(x, y){
            let key = Number(x) * 10 + Number(y);
            let index = this.command.params[1].value.indexOf(key);
            return index != -1;
        },
        toggleAllLed(){
            for (let x of [0,1,2,3,4]){
                for (let y of [0,1,2,3,4]){
                    this.toggleLed(x,y, false)
                }
            }
        },
        clearAllLed(){
            this.command.params[1].value = []
        },
        selectAllLed(){
            for (let x of [0,1,2,3,4]){
                for (let y of [0,1,2,3,4]){
                    this.toggleLed(x,y, true)
                }
            }
        },
    },
    template: `
        <div class="command" :class="commandClass" @click.stop="selectItem(command, index, parentCommands)" :title="command.title">
            <div class="command-body">
                <div class="command-handle" v-html="command.icon"></div>
                <div class="command-condition" v-if="!onlyIcons && command.conditions && !command.conditionsHidden">
                    <code-panel-command-condition :condition="condition" :data-inputs="dataInputs" :hasNext="command.conditions[index + 1]" :command-id="command.id" v-for="condition, index in command.conditions"></code-panel-command-condition>
                </div>
                <a class="button button-transparent" @click.stop="addCondition" title="Add condition" v-if="!onlyIcons && command.conditions && command.conditions[0][0].value != 0 && !command.conditionsHidden">
                    <span class="icon">
                        <i class="fa-solid fa-plus"></i>
                    </span>
                </a>
                <a class="button button-transparent" @click.stop="removeCondition" title="Remove condition" v-if="!onlyIcons && command.conditions && command.conditions[0][0].value != 0 && command.conditions.length > 1">
                    <span class="icon">
                        <i class="fa-solid fa-minus"></i>
                    </span>
                </a>
                <div class="condition-params" v-else-if="!onlyIcons && command.params && command.params.length">
                    <template v-for="param in command.params">
                        <div v-if="!param || !param.if || param.if(command.params)">
                            <input class="input" :type="param.inputType" v-model="param.value" v-if="param.type == 'input'" @focus="keyboard(false)" @blur="keyboard(true)" @click.stop="()=>{}" :title="param.title">
                            <div class="select" v-if="param.type == 'select'" :title="param.title">
                                <select v-model="param.value">
                                    <option :value="opt.value" v-for="opt in param.options" :style="{background: opt.background, color: opt.color}">{{opt.name}}</option>
                                </select>
                            </div>
                            <div class="description" v-if="param.postfix">
                                {{param.postfix}}
                            </div>
                            <dropdown :items="param.options" :background="param.background ? 'none' : 'white'" v-model.value="param.value" :title="param.title" v-if="param.type == 'dropdown'"></dropdown>

                            <!--<div class="switch" v-if="param.type == 'switch'" @click.stop="toggleSwitch(param)">
                                <div v-if="param.value"><i class="fa-solid fa-toggle-on"></i></div>
                                <div v-else><i class="fa-solid fa-toggle-on"></i></div>
                            </div>-->

                            <div class="description" v-if="command.id == 14">{{keysPressedHuman}}</div>
                        </div>
                    </template>

                    <template v-if="command.id == 4">
                        <dropdown :items="pfSpeedDirection" :background="'white'" v-model.value="pfDirection"></dropdown>
                        <dropdown :items="pfCommands[pfDirection]" :background="'white'" v-model.value="command.params[2].value" v-if="pfDirection != 'break'"></dropdown>
                    </template>
                </div>
            </div>
            <div class="command-commands" v-if="command.commands">
                <draggable class="sub-code" v-model="command.commands" item-key="uuid"
                @start="drag=true" @end="drag=false" :force-fallback="true" :scroll-sensitivity="200" :animation="150"
                :group="{ name: 'commands'}" ghost-class="ghost" handle=".command-handle" @change="onChangeCommands"
                >
                    <template #item="{element, index}">
                        <div class="command-row">
                            <div class="row-nr" v-if="showRowNumber">{{ index }}</div>
                            <div v-else></div>
                            <code-panel-command :index="index" :parent-commands="command.commands" :command="element" :showRowNumber="showRowNumber" :data-inputs="dataInputs" @select="selectItem" :selected-item="selectedItem" @keyboard="keyboard"></code-panel-command>
                        </div>
                    </template>
                </draggable>
            </div>
            <div class="command-else" v-if="!onlyIcons && command.commands2 && (command.commands2.length || hasElse)">
                <i class="fa-solid fa-ellipsis"></i>
            </div>
            <div class="command-commands" v-if="command.commands2 && (command.commands2.length || hasElse)">
                <draggable class="sub-code" v-model="command.commands2" item-key="uuid"
                @start="drag=true" @end="drag=false" :force-fallback="true" :scroll-sensitivity="200" :animation="150"
                :group="{ name: 'commands'}" ghost-class="ghost" handle=".command-handle" @change="onChangeCommands2"
                >
                    <template #item="{element, index}">
                        <div class="command-row">
                            <div class="row-nr" v-if="showRowNumber">{{ index }}</div>
                            <div v-else></div>
                            <code-panel-command :index="index" :parent-commands="command.commands2" :command="element" :showRowNumber="showRowNumber" :data-inputs="dataInputs" @select="selectItem" :selected-item="selectedItem" @keyboard="keyboard"></code-panel-command>
                        </div>
                    </template>
                </draggable>
            </div>
            <div class="command-separator" v-if="command.separator"></div>
            <div class="command-else-toggle" :title="hasElse ? 'Remove else block' : 'Add else block'" v-if="!onlyIcons && command.commands2">
                <span class="command-else-toggle-button" @click.stop="toggleElse">
                    <span v-if="!hasElse"><i class="fa-regular fa-square-plus"></i></span>
                    <span v-else><i class="fa-regular fa-square-minus"></i></span>
                </span>
            </div>
            <div class="command-commands-bottom" v-else-if="command.commands">
            </div>

            <template v-if="command.id == 102">
                <div class="command-led">
                    <div class="command-led-screen">
                        <template v-for="y in [0,1,2,3,4]">
                            <div class="command-led-screen-item" v-for="x in [0,1,2,3,4]" @click.stop="toggleLed(x,y)">
                                <div class="command-led-screen-item-selected" :class="[command.params[0].value ? 'on' : 'off']" v-if="isLedSelected(x, y)"></div>
                                <div class="command-led-screen-item-content" v-else></div>
                            </div>
                        </template>
                    </div>
                    <div class="command-led-toolbar" v-if="!onlyIcons">
                        <button class="button is-small" @click.stop="clearAllLed" title="Clear all"><i class="fa-solid fa-xmark"></i></button>
                        <button class="button is-small" @click.stop="selectAllLed" title="Select all"><i class="fa-solid fa-a"></i></button>
                        <button class="button is-small" @click.stop="toggleAllLed" title="Toggle"><i class="fa-solid fa-star-half-stroke"></i></button>
                    </div>
                </div>
            </template>
        </div>
    `
})

app.component('code-panel', {
    inject: ['sendData', 'receivedData', 'connectBluetooth', 'isConnectedBluetooth', 'keysPressed', 'keyboardReading', 'confirm'],
    props: ['item', 'data', 'settings'],
    components: {
        draggable,
    },
    data() {
        return {
            settingsVisible: false,
            code: '[0,[2,1,1],[1,1000],[3,1,1]]',
            drag: false,
            commandsSet: [],
            // program: [],
            programCommands: [],
            programSent: false,
            programSending: false,
            isRuning: false,
            selectedItem: null,
            copiedItem: {},
            commandNr: 1,
            lastDeletedItem: null,
            inputFocused: false,
            isEdit: false,
            toolbarNarrow: true,
            showRowNumber: true,
            isHelpVisible: false,
        }
    },
    created() {
        if (this.item.program.length){
            this.programCommands = this.programToCommands(this.item.program)
            // this.program = this.item.program
        }

        for (let id of [16,14,5,6,8,7,4,9,1,0,102,12,10]){
            this.commandsSet.push(this.getCommand(id))
        }

        // let n = 4.3;
        // let x = Math.trunc(n)
        // // console.log(n, x)
        // // console.log((n - x))
        // // console.log((n - x) * 10)

        // let y = Math.trunc(Math.ceil((n - x) * 10))
        // console.log(x, y)
    },
    mounted() {
    },
    computed: {
        commandsById() {
            let byId = {}

            for (let command of this.commandsSet){
                byId[command.id] = command;
            }

            return byId;
        },
    },
    watch: {
        programCommands: {
            deep: true,
            handler(newVal) {
                if (this.item) {
                    this.item.program = this.commandsToProgram(newVal, true);
                    this.programSent = false;
                }
            }
        },
        receivedData: {
            deep: true,
            handler(newVal) {
                let lastCommandParts = newVal[newVal.length - 1].split(';');

                let command = lastCommandParts[0]

                if (command == '1' && this.programSending) {
                    this.programSent = true;
                    this.programSending = false;
                } else if (command == 200){
                    this.isRuning = false;
                }
            }
        },
        isConnectedBluetooth(newVal){
            if (!newVal){
                this.programSent = false;
                this.isRuning = false;
            }
        },
        keysPressed(newVal){
            if (!this.isEdit){
                return
            }

            let code = newVal.replace('18;','')
            if (code == '17;67;' && this.selectedItem && this.selectedItem.uuid){
                this.copyCommand()
            } else if (code == '17;86;' && this.copiedItem.uuid){
                this.pasteCommand()
            } else if (code == '17;88;' && this.selectedItem && this.selectedItem.uuid){
                this.copyCommand()
                this.removeCommand()
            } else if (!this.inputFocused && (code == '46;') && this.selectedItem){
                this.removeCommand()
            } 
            // else if (code == '17;90;' && this.lastDeletedItem){
            //     this.lastDeletedItem.parent.commands.splice(this.lastDeletedItem.index, 0, this.lastDeletedItem.items[0])
            //     this.lastDeletedItem = null
            // }
            else if (code == '17;191;' && this.selectedItem.uuid){
                this.selectedItem.disabled = !this.selectedItem.disabled
            }
            else if (code == '27;'){
                this.isEdit = false;
            }
            else if (code == '13;'){
                if (this.isConnectedBluetooth){
                    if (this.isRuning){
                        this.isRuning = false;
                    } else {
                        this.isRuning = true;
                    }
                }
            }
        }
    },
    methods: {
        reloadProgram() {
            this.programCommands = this.programToCommands(this.item.program)
            // this.program = this.item.program
        },
        clearProgram() {
            this.confirm('Are you sure you want to remove all commands?', () => {
                this.programCommands = []
            })
        },
        copyCommand() {
            if (this.selectedItem && this.selectedItem.uuid){
                this.copiedItem = this.commandCopy(this.selectedItem)
            }
        },
        pasteCommand() {
            let dest;

            if (this.selectedItem){
                if (this.selectedItem.commands){
                    dest = this.selectedItem.commands;
                } else {
                    dest = this.selectedItem.parent.commands;
                }
            } else {
                dest = this.programCommands
            }
            if (dest){
                dest.push(this.commandCopy(this.copiedItem))
            }
        },
        removeCommand() {
            if (this.selectedItem){
                this.lastDeletedItem = {
                    items: this.selectedItem.parent.commands.splice(this.selectedItem.parent.index, 1)
                }
                this.selectedItem = null;
            }
        },
        commandCopy(command) {
            let commandCopy = this.getCommand(command.id)

            if (command.conditions){
                commandCopy.conditions = []
                for (let condition of command.conditions){
                    let conditionCopy = []
                    for (let param of condition){
                        let paramCopy = JSON.parse(JSON.stringify(param))
                        paramCopy.if = param.if
                        conditionCopy.push(paramCopy)
                    }

                    commandCopy.conditions.push(conditionCopy)
                }
            }

            if (command.params){
                for (let i in command.params){
                    commandCopy.params[i].value = JSON.parse(JSON.stringify(command.params[i].value))
                }
            }

            if (command.commands){
                for (let cmd of command.commands){
                    commandCopy.commands.push(this.commandCopy(cmd))
                }
            }

            return commandCopy
        },
        programToCommands(program){
            if (!program){
                return []
            }

            let programCommands = [];

            for (let index in program){
                let item = program[index]

                if (item == null || item == undefined){
                    continue;
                }
                
                let commandId = item;

                if (typeof item == 'object'){
                    commandId = item[0]
                }

                let command = this.getCommand(commandId);

                if (command){
                    let commandCopy = command //JSON.parse(JSON.stringify(command))

                    let ifConditionsParamShift = 0;

                    for (let i = 1; i < item.length; i++){
                        // Commands with conditions as first param.
                        if ([8,5,6,16].includes(commandId) && i == 1){
                            ifConditionsParamShift = 1;

                            for (let c in item[1]){
                                let condition = item[1][c];

                                if (!commandCopy.conditions[c]){

                                    let condition = [
                                        {value: 15, options: this.getDataInputs(commandId)},
                                        {value: 1},
                                        {value: 0},
                                        {value: 0},
                                    ]

                                    commandCopy.conditions.push(condition)
                                }

                                for (let p in condition){
                                    commandCopy.conditions[c][p].value = condition[p]
                                }
                            }

                        } else if (commandId == 8 && i == 4 && typeof item[i] == 'object'){
                            commandCopy.commands = this.programToCommands(item[i])
                        } else if (commandId == 8 && i == 5 && typeof item[i] == 'object'){
                            commandCopy.commands2 = this.programToCommands(item[i])
                        } else if (commandId != 102 && typeof item[i] == 'object'){
                            commandCopy.commands = this.programToCommands(item[i])
                        } else if (commandCopy.params) {
                            let paramIndex = i - 1 - ifConditionsParamShift
                            if (commandCopy.params[paramIndex] != null){

                                // Hack - if else processing first time.
                                if (commandId == 8 && paramIndex == 1){
                                    commandCopy.params[paramIndex].value = 2
                                } else {
                                    commandCopy.params[paramIndex].value = item[i]
                                }
                            
                                // Copy function after JSON.parse.
                                // if (command.params[i - 1].if){
                                //     commandCopy.params[i - 1].if = command.params[i - 1].if
                                // }
                            }
                        }
                    }


                    commandCopy.parent = {
                        commands: programCommands,
                        index: index
                    }

                    programCommands.push(commandCopy)
                }
            }

            return programCommands
        },
        commandsToProgram(programCommands, saveAll, beforeCommands){
            let commandsProcessed = [];

            for (let command of programCommands){
                if (command.disabled && !saveAll){
                    continue;
                }

                if ([0, 12, 13].includes(command.id)){
                    commandsProcessed.push(command.id)
                } else {
                    let item = [command.id];

                    if (command.conditions){
                        let conditions = []

                        for (let condition of command.conditions){
                            let conditionValues = []

                            // Adding special commands while preprocessing the code.
                            if (beforeCommands){
                                if (condition[0].value == 110){
                                    beforeCommands.push([10,1,0])
                                }
                            }

                            for (let param of condition){
                                let value = param.value;

                                if (!saveAll && value == 110){
                                    value = 11;
                                }
                                conditionValues.push(value)
                            }

                            conditions.push(conditionValues)
                        }

                        item.push(conditions)
                    }

                    if (command.params){
                        for (let param of command.params){
                            item.push(param.value)
                        }
                    }

                    if (command.commands){
                        item.push(this.commandsToProgram(command.commands, saveAll, beforeCommands))
                    }

                    if (command.commands2){
                        item.push(this.commandsToProgram(command.commands2, saveAll, beforeCommands))
                    }

                    commandsProcessed.push(item)
                }
            }

            return commandsProcessed
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
        copy(item) {
            this.$emit('copywidget', item)
            this.settingsVisible = false;
        },
        sendCommand(button) {
            let command = button.command;

            if (button.hasInput) {
                if (button.command.split('').pop() != ';') {
                    command += ';'
                }
                command += button.inputValue;
            }

            if (command != '') {
                this.sendData(command)
            }
        },
        onInputChange(button) {
            if (!(button.name && button.hasInput)) {
                this.sendCommand(button)
            }
        },
        sendCode() {
            let commandsProcessed = [];
            commandsProcessed = commandsProcessed.concat(this.commandsToProgram(this.programCommands, false, commandsProcessed))
            let commandsJs = JSON.stringify(commandsProcessed)
            console.log('commandsProcessed', commandsJs)

            if (!this.isConnectedBluetooth){
                // this.connectBluetooth()
                return;
            }

            this.isRuning = false;
            this.programSending = true;

            let resolveAfterDelay = (chunk) => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        this.sendData(chunk)
                        resolve('resolved');
                    }, 200);
                });
            }

            let runCode = () => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        this.runCode()
                        resolve('resolved');
                    }, 200);
                });
            }

            // Sending

            async function asyncCall() {
                const chunkSize = 15;

                await resolveAfterDelay("0")

                await resolveAfterDelay("<")

                for (let i = 0; i < commandsJs.length; i += chunkSize) {
                    const chunk = commandsJs.slice(i, i + chunkSize);
                    await resolveAfterDelay(chunk)
                }

                await resolveAfterDelay(">")
                await runCode()
            }

            asyncCall().then(() => {
                // Hack - if BT is not connected or someting else got wrong;
                setTimeout(() => {
                    this.programSending = false;
                }, 5000);
            });

            // let send = async function () {
            //     await this.sendData("<")
            //     this.code = "[0,[2,1,1],[1,1000],[3,1,1]]"
            //     const chunkSize = 10;
            //     for (let i = 0; i < this.code.length; i += chunkSize) {
            //         const chunk = this.code.slice(i, i + chunkSize);
            //         await this.sendData('+;' + chunk)
            //     }
            //     await this.sendData(">")
            // }

            // send()
        },
        runCode() {
            if (!this.isConnectedBluetooth || this.isRuning){
                return
            }

            this.sendData(">>")
            this.isRuning = true;
        },
        stopCode() {
            // if (!this.isConnectedBluetooth){
            //     return
            // }

            this.isRuning = false;

            this.sendData("0")
        },
        onAddToCommandList(event) {
            if (event.added){
                this.commandsSet.splice(event.added.newIndex, 1)
            }
        },
        onChangeCommands(event) {
            // let eventItem = event.added || event.moved;
            // if (eventItem){
            //     eventItem.element.parent = {
            //         commands: this.commandsSet,
            //         index: eventItem.newIndex
            //     }
            // }
        },
        onClone(e){
            return this.commandCopy(e)
            // return this.getCommand(e.id)
        },
        keyboard(value){
            this.$emit('keyboard', value)
            this.inputFocused = !value;
        },
        selectItem(item, index, commands){
            if (this.selectedItem){
                this.selectedItem.isSelected = false;
            }

            if (item && !item.isSelected){
                this.selectedItem = item;

                item.isSelected = true;
                item.parent = {
                    index: index,
                    commands: commands
                }
            } else {
                this.selectedItem = null;
            }
        },
        exportProgram() {
            var link = document.createElement("a");
            let data = {
                program: this.item.program,
                name: this.item.name
            }
            link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(JSON.stringify(data)));
            link.setAttribute("download", this.item.name + '.js');
            document.body.appendChild(link);
      
            link.click();
        },
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
      
            if (!files.length) {
              return;
            }
      
            var reader = new FileReader();
            reader.readAsText(files[0], "UTF-8");
            reader.onload = (evt) => {

                let load = () => {
                    let data = JSON.parse(evt.target.result);
                    this.item.program = data.program;
                    this.item.name = data.name;
                    this.programCommands = this.programToCommands(this.item.program)
                    e.target.value = ''
                }

                if (this.item.program.length) {
                    this.confirm('Are you sure you want to overwrite the current program?', () => {
                        load()
                    })
                } else {
                    load()
                }
            }
            reader.onerror = function (evt) {
              console.log('error reading file')
            }
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        getDataInputs(id) {
             let dataInputs = [
                {
                    value: 1, 
                    name: 'Light', 
                    html: '<i class="fa-regular fa-sun"></i>', 
                    operatorsType: 'comparisonOperators',
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [0,255], 
                    defaultInputValue: 0,
                    showOperators: true
                },
                {
                    value: 7, 
                    name: 'Temperature', 
                    html: '<i class="fa-solid fa-temperature-low"></i>', 
                    operatorsType: 'comparisonOperators', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [], 
                    defaultInputValue: 0,
                    showOperators: true
                },
                {
                    value: 2, 
                    name: 'Sound', 
                    html: '<i class="fa-solid fa-microphone"></i>', 
                    operatorsType: 'comparisonOperators', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [0,100], 
                    defaultInputValue: 0,
                    showOperators: true
                },
                {
                    value: 15, 
                    name: 'Claps', 
                    html: '<i class="fa-solid fa-hands-clapping"></i>', 
                    operatorsType: 'comparisonOperators', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [0,100], 
                    defaultInputValue: 0,
                    showOperators: true
                },
                // {value: 17, name: 'Tilt', html: '<i class="fa-solid fa-slash"></i>'},
                {
                    value: 3, 
                    name: 'Acceleration X', 
                    html: '<i class="fa-solid fa-gauge-simple-high"></i> <sub>X</sub>', 
                    operatorsType: 'comparisonOperators', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [0,100], 
                    defaultInputValue: 0,
                    showOperators: true
                },
                {
                    value: 4, 
                    name: 'Acceleration Y', 
                    html: '<i class="fa-solid fa-gauge-simple-high"></i> <sub>Y</sub>', 
                    operatorsType: 'comparisonOperators', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [0,100], 
                    defaultInputValue: 0,
                    showOperators: true
                },
                {
                    value: 5, 
                    name: 'Acceleration Z', 
                    html: '<i class="fa-solid fa-gauge-simple-high"></i> <sub>Z</sub>', 
                    operatorsType: 'comparisonOperators', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [0,100], 
                    defaultInputValue: 0,
                    showOperators: true
                },
                {
                    value: 6, 
                    name: 'Compass', 
                    html: '<i class="fa-regular fa-compass"></i>', 
                    operatorsType: 'comparisonOperators', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [0,100], 
                    defaultInputValue: 0,
                    showOperators: true
                },
                {
                    value: 16, 
                    name: 'Analog Pin P1', 
                    html: '<i class="fa-solid fa-a"></i> <sub>P1</sub>', 
                    operatorsType: 'comparisonOperators', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [0,100], 
                    defaultInputValue: 0,
                    showOperators: true
                },
                {
                    value: 11, 
                    name: 'Digital Pin P1', 
                    html: '<i class="fa-solid fa-d"></i> <sub>P1</sub>', 
                    operatorsType: 'equate', 
                    defaultOperator: 0,
                    inputType: 'boolean', 
                    inputValues: [0,1], 
                    inputRange: [0,100], 
                    defaultInputValue: 0,
                    showOperators: false
                },
                {
                    value: 18, 
                    name: 'Button A', 
                    html: '<i class="fa-solid fa-square-caret-left"></i> <sub>A</sub>',
                    operatorsType: 'equate', 
                    defaultOperator: 0,
                    inputType: 'boolean', 
                    inputValues: [0,1], 
                    inputRange: [], 
                    defaultInputValue: 0,
                    showOperators: false
                },
                {
                    value: 19, 
                    name: 'Button B', 
                    html: '<i class="fa-solid fa-square-caret-right"></i> <sub>B</sub>',
                    operatorsType: 'equate', 
                    defaultOperator: 0,
                    inputType: 'boolean', 
                    inputValues: [0,1], 
                    inputRange: [], 
                    defaultInputValue: 0,
                    showOperators: false
                },
                {
                    value: 8, 
                    name: 'Variable 1', 
                    html: '<i class="fa-solid fa-x"></i> <sub>1</sub>',
                    operatorsType: 'comparisonOperators', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [], 
                    defaultInputValue: 0,
                    showOperators: true
                },
                {
                    value: 9, 
                    name: 'Variable 2', 
                    html: '<i class="fa-solid fa-x"></i> <sub>2</sub>',
                    operatorsType: 'comparisonOperators', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [], 
                    defaultInputValue: 0,
                    showOperators: true
                },
                {
                    value: 10, 
                    name: 'Variable 3', 
                    html: '<i class="fa-solid fa-x"></i> <sub>3</sub>',
                    operatorsType: 'comparisonOperators', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [], 
                    defaultInputValue: 0,
                    showOperators: true
                },

                {
                    value: 12, 
                    name: 'Sonar', 
                    html: '<i class="fa-solid fa-satellite-dish"></i>',
                    operatorsType: 'comparisonOperators', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [], 
                    defaultInputValue: 0,
                    showOperators: true
                },
                {
                    value: 110, 
                    name: 'Distance', 
                    html: '<i class="fa-solid fa-arrows-left-right-to-line"></i>',
                    operatorsType: 'equate', 
                    defaultOperator: 0,
                    inputType: 'booleanDistance', 
                    inputValues: [0,1], 
                    inputRange: [], 
                    defaultInputValue: 0,
                    showOperators: false
                },

                {
                    value: 13, 
                    name: 'Key down', 
                    html: '<i class="fa-solid fa-keyboard"></i>',
                    operatorsType: 'comparisonOperators2', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [], 
                    defaultInputValue: 0,
                    showOperators: true
                },
                {
                    value: 14, 
                    name: 'Key up', 
                    html: '<i class="fa-regular fa-keyboard"></i>',
                    operatorsType: 'comparisonOperators2', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [], 
                    defaultInputValue: 0,
                    showOperators: true
                },

                {
                    value: 21, 
                    name: 'Magnetic Force X', 
                    html: '<i class="fa-solid fa-magnet"></i> <sub>X</sub>',
                    operatorsType: 'comparisonOperators', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [], 
                    defaultInputValue: 0,
                    showOperators: true
                },
                {
                    value: 22, 
                    name: 'Magnetic Force Y', 
                    html: '<i class="fa-solid fa-magnet"></i> <sub>Y</sub>',
                    operatorsType: 'comparisonOperators', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [], 
                    defaultInputValue: 0,
                    showOperators: true
                },
                {
                    value: 23, 
                    name: 'Magnetic Force Z', 
                    html: '<i class="fa-solid fa-magnet"></i> <sub>Z</sub>',
                    operatorsType: 'comparisonOperators', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [], 
                    defaultInputValue: 0,
                    showOperators: true
                },

                {
                    value: 24, 
                    name: 'Throwing the dice', 
                    html: '<i class="fa-solid fa-dice"></i>',
                    operatorsType: 'comparisonOperators2', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [1,6], 
                    defaultInputValue: 0,
                    showOperators: true
                },
            ]

            if (id == 5 || id == 6){
                dataInputs.unshift({
                    value: -1, 
                    name: 'Time', 
                    html: '<i class="fa-solid fa-stopwatch"></i>',
                    operatorsType: 'comparisonOperators3', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [], 
                    defaultInputValue: 0,
                    showOperators: true
                })
            }

            if (id == 5){
                dataInputs.unshift({
                    value: 20, 
                    name: 'Counter', 
                    html: '<i class="fa-solid fa-n"></i>',
                    operatorsType: 'comparisonOperators', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [], 
                    defaultInputValue: 0,
                    showOperators: true
                })
                dataInputs.unshift({
                    value: 0, 
                    name: '-', 
                    html: '<i class="fa-solid fa-ellipsis"></i>',
                    operatorsType: 'comparisonOperators', 
                    defaultOperator: 0,
                    inputType: '', 
                    inputValues: [], 
                    inputRange: [], 
                    defaultInputValue: 0,
                    showOperators: false
                })
            }

            if (id == 8){
                dataInputs.push({
                    value: -1, 
                    name: 'Stopwatch', 
                    html: '<i class="fa-solid fa-stopwatch"></i>',
                    operatorsType: 'comparisonOperators4', 
                    defaultOperator: 0,
                    inputType: 'number', 
                    inputValues: [], 
                    inputRange: [], 
                    defaultInputValue: 0,
                    showOperators: true
                })
            }

            return dataInputs
        },
        getCommand(id) {
            let dataInputs = this.getDataInputs(id);

            let condition = [
                {value: 1, options: dataInputs},
                {value: 1},
                {value: 0},
                {value: 0},
            ]

            if (id == 6){
                condition[0].value = -1;
            } else if (id == 5){
                condition[0].value = 0;
            }

            let sendData = this.sendData;

            let commandsById = {
                0: {id: 0, icon: '<i class="fa-solid fa-lightbulb" style="color: black"></i>', type: 'systemControl', title: 'Turn off all LEDs'},
                1: {id: 1, icon: '<i class="fa-solid fa-chart-line"></i>', type: 'systemControl', title: 'Get data', params: [
                    {type: 'dropdown', title: 'Event value', options: [
                        {value: 0, name: '--', html: '<i class="fa-solid fa-ellipsis"></i>'},
                    ].concat(dataInputs), value: 1},
                    {type: 'dropdown', title: 'Event value', options: [
                        {value: 0, name: '--', html: '<i class="fa-solid fa-ellipsis"></i>'},
                    ].concat(dataInputs), value: 0},
                    {type: 'dropdown', title: 'Event value', options: [
                        {value: 0, name: '--', html: '<i class="fa-solid fa-ellipsis"></i>'},
                    ].concat(dataInputs), value: 0},
                    {type: 'dropdown', title: 'Event value', options: [
                        {value: 0, name: '--', html: '<i class="fa-solid fa-ellipsis"></i>'},
                    ].concat(dataInputs), value: 0},
                    {type: 'dropdown', title: 'Event value', options: [
                        {value: 0, name: '--', html: '<i class="fa-solid fa-ellipsis"></i>'},
                    ].concat(dataInputs), value: 0},
                ]},
                // 2: {id: 2, icon: '<i class="fa-solid fa-lightbulb"></i>', type: 'systemControl', title: 'Turn on the specified LED', params: [
                //     {type: 'input', inputType: 'number', value: 0},
                //     {type: 'input', inputType: 'number', value: 0},
                // ]},
                // 3: {id: 3, icon: '<i class="fa-solid fa-lightbulb" style="color: black"></i>', type: 'systemControl', title: 'Turn off the specified LED', params: [
                //     {type: 'input', inputType: 'number', value: 0, title: 'The horizontal coordinate of the LED'},
                //     {type: 'input', inputType: 'number', value: 0, title: 'The vertical coordinate of the LED'},
                // ]},
                4: {id: 4, icon: '<i class="fa-solid fa-rotate-right"></i>', type: 'motorControl', title: 'Control LEGO Power Function', params: [
                    {type: 'select', options: [
                        {value: 0, name: 1},
                        {value: 1, name: 2},
                        {value: 2, name: 3},
                        {value: 3, name: 4},
                    ], value: 0, title: 'Channel'},
                    {type: 'dropdown', options: [
                        {value: 1, name: 'Blue', html: '<i class="fa-solid fa-clapperboard"></i>', color: 'blue'},
                        {value: 2, name: 'Red', html: '<i class="fa-solid fa-clapperboard"></i>', color: 'red'},
                    ], value: 1, title: 'Slot'},
                    {type: '', title: 'Speed', options: [
                        {value: 0b1000111, name: 7},
                        {value: 0b1000110, name: 6},
                        {value: 0b1000101, name: 5},
                        {value: 0b1000100, name: 4},
                        {value: 0b1000011, name: 3},
                        {value: 0b1000010, name: 2},
                        {value: 0b1000001, name: 1},
                        {value: 0b1000000, name: 0},
                        {value: 0b1100100, name: '++1'},
                        {value: 0b1110100, name: '++1', color: 'blue'},
                        {value: 0b1001000, name: 'Break', html: '<i class="fa-solid fa-stop"></i>'},
                        {value: 0b1011000, name: 'Break', html: '<i class="fa-solid fa-stop"></i>', color: 'blue'},
                        {value: 0b1100101, name: '--1'},
                        {value: 0b1110101, name: '--1', color: 'blue'},
                        {value: 0b1001111, name: -1},
                        {value: 0b1001110, name: -2},
                        {value: 0b1001101, name: -3},
                        {value: 0b1001100, name: -4},
                        {value: 0b1001011, name: -5},
                        {value: 0b1001010, name: -6},
                        {value: 0b1001001, name: -7},
                    ], value: 0b1000111, if(){false}},
                ]},
                5: {id: 5, icon: '<i class="fa-solid fa-repeat"></i>', type: 'programControl', title: 'Repeat block', 
                    conditions: [
                        condition
                    ],
                    commands: []
                },
                6: {id: 6, icon: '<i class="fa-solid fa-hourglass-half"></i>', type: 'programControl', title: 'Wait for', 
                    conditions: [
                        condition
                    ],
                    params: [
                    ]
                },
                // Run in background
                7: {id: 7, icon: '<i class="fa-solid fa-code-fork"></i>', type: 'programControl', title: 'Run part of a program while the rest of it is doing something else', commands: []},
                8: {id: 8, icon: '<i class="fa-solid fa-question"></i>', type: 'programControl', title: 'If block', 
                    conditions: [
                        condition
                    ],
                    params: [
                        {id: 1, type: 'dropdown', background:'transparent', title: 'Define how many times the code should be executed when the condition is still true', options: [
                            {value: 1, name: 'Run all the time when the condition is still true', html: '<i class="fa-solid fa-arrows-rotate"></i>'},
                            {value: 0, name: 'Run only once when the condition is still true', html: '<i class="fa-solid fa-1"></i>'},
                        ], value: 0},
                        {id: 2, value: 2}, // Value for trigger. if 2 - wyzwala else na początku
                    ], 
                    commands: [],
                    commands2: [],
                },
                9: {id: 9, icon: '<span><i class="fa-solid fa-x"></i><sub>n</sub></span>', type: 'systemControl', title: 'Custom variable', params: [
                    {type: 'dropdown', title: 'Variable', options: [
                        {value: 0, name: 'Variable 1', html: 'X<sub>1</sub>'},
                        {value: 1, name: 'Variable 2', html: 'X<sub>2</sub>'},
                        {value: 2, name: 'Variable 3', html: 'X<sub>3</sub>'},
                    ], value: 0},
                    {type: 'dropdown', title: 'Action', options: [
                        {value: 1, name: '=', html: '<i class="fa-solid fa-equals"></i>'},
                        {value: 4, name: 'set', html: '<i class="fa-solid fa-arrow-left"></i>'},
                        {value: 2, name: '+', html: '<i class="fa-solid fa-plus"></i>'},
                        {value: 3, name: '-', html: '<i class="fa-solid fa-minus"></i>'},
                        {value: 5, name: '*', html: '<i class="fa-solid fa-xmark"></i>'},
                        {value: 6, name: '/', html: '<i class="fa-solid fa-divide"></i>'},
                        // {value: 8, name: '-v', html: '<i class="fa-solid fa-minus"></i><sub>V</sub>'},
                        // {value: 9, name: '+v', html: '<i class="fa-solid fa-plus"></i><sub>V</sub>'},
                        // {value: 7, name: 'Abs', html: 'Abs'},
                    ], value: 1,
                        if(params){
                            if ([4,8,9].includes(params[1].value)){
                                params[2].type = 'dropdown';
                                params[2].options = dataInputs
                            } else {
                                params[2].type = 'input';
                                params[2].options = null
                            }

                            return true
                        }
                    },
                    {type: 'input', inputType: 'number', value: 0, title: 'Value', if(params){
                        return params[1].value != 7
                    }},
                ]},
                10: {id: 10, icon: '<i class="fa-solid fa-sliders"></i>', type: 'systemControl', title: 'Settings', params: [
                    {type: 'dropdown', options: [
                        {value: 1,  html: 'P1 Pull Up'},
                        {value: 2,  html: 'P1 Pull Down'},
                        {value: 4,  html: 'Clap sound value'},
                    ], value: 1},
                    {type: 'input', inputType: 'number', value: 0, title: 'Value', if(params){
                        return params[0].value == 4
                    }}
                ]},
                
                11: {id: 11, icon: '<i class="fa-solid fa-share-from-square"></i>', type: 'systemControl', title: 'Send error code', params: [
                    {type: 'input', inputType: 'number', title: 'Value', value: 0},
                ]},

                12: {id: 12, icon: '<i class="fa-solid fa-ban"></i>', type: 'systemControl', title: 'Stop the program'},
                13: {id: 13, icon: '<i class="fa-solid fa-power-off"></i>', type: 'systemControl', title: 'Reset the micro:bit'},
                14: {id: 14, icon: '<i class="fa-solid fa-keyboard"></i>', type: 'programControl', title: 'Start on key press block', 
                    params: [
                        {type: 'input', inputType: 'number', title: 'Key pressed code', value: 0},
                    ], commands: []
                },
                15: {id: 15, icon: '<i class="fa-brands fa-itunes-note"></i>', type: 'systemControl', title: 'Note', params: [
                    {type: 'dropdown', options: [
                        {value: 261,  html: 'C'},
                        {value: 293,  html: 'D'},
                        {value: 329,  html: 'E'},
                        {value: 349,  html: 'F'},
                        {value: 392,  html: 'G'},
                        {value: 440,  html: 'A'},
                        {value: 493,  html: 'B'},
                    ], value: 0},
                    {type: 'input', inputType: 'number', title: 'Value', value: 0}
                ]},
                16: {id: 16, icon: '<i class="fa-solid fa-play"></i>', type: 'programStart', title: 'Wait for program start', 
                    conditions: [[
                        {value: 13},
                        {value: 4},
                        {value: 13},
                        {value: 0},
                    ]], conditionsHidden: true,
                    onClick(){
                        sendData('13;')
                        setTimeout(() => {
                            sendData(';')
                        }, 100);
                    }
                },
                102: {id: 102, icon: '<i class="fa-solid fa-lightbulb"></i>', type: 'systemControl', title: 'Turn on the specified LED', params: [
                    {type: 'dropdown', options: [
                        {value: 1,  html: '<i class="fa-solid fa-lightbulb" style="color: red"></i>'},
                        {value: 0,  html: '<i class="fa-solid fa-lightbulb" style="color: black"></i>'},
                    ], value: 1},
                    {type: 'array', value: []}
                ]},
            }

            commandsById[id].disabled = false;

            // UUID 
            commandsById[id].uuid = this.commandNr;
            this.commandNr += 1

            return commandsById[id]
        },
        checkMove(event) {
            if (event.to.className == 'commands'){
                return false
            }

            return true
        }
    },
    template: `
      <div class="card-qauge control-panel">
        <code-settings v-if="settingsVisible" :item="item" @save="save" @cancel="cancel" @remove="remove" @copywidget="copy"></code-settings>

        <div class="control-buttons">
            <div class="field is-grouped">
                <div class="control">
                    <input class="input" type="text" placeholder="Program name" v-model="item.name" @focus="keyboard(false)" @blur="keyboard(true)">
                </div>
                <div class="control">
                    <a class="button is-info" @click.stop="isEdit = true" title="Edit program">
                        <span class="icon">
                        <i class="fa-solid fa-pen"></i>
                        </span>
                        <span>Edit</span>
                    </a>
                </div>
                <div class="control">
                    <a class="button is-info" :class="{'is-success': programSent, 'is-loading': programSending}" @click.stop="sendCode" title="Upload program">
                        <span class="icon">
                            <i class="fa-solid fa-upload"></i>
                        </span>
                        <span>Upload</span>
                    </a>
                </div>
                <div class="control" v-if="!isRuning">
                    <a class="button is-info" :class="{'is-success': isRuning}" @click.stop="runCode" title="Start program">
                        <span class="icon">
                            <i class="fa-solid fa-play"></i>
                        </span>
                        <span>Run</span>
                    </a>
                </div>
                <div class="control" v-if="isRuning">
                    <a class="button is-info" :class="{'is-danger': isRuning}" @click.stop="stopCode" title="Stop program">
                        <span class="icon">
                            <i class="fa-solid fa-stop"></i>
                        </span>
                        <span>Stop</span>
                    </a>
                </div>
                <div class="control">
                    <a class="button" @click.stop="isHelpVisible = true" title="Help">
                        <span class="icon">
                            <i class="fa-regular fa-circle-question"></i>
                        </span>
                    </a>
                </div>
            </div>
        </div>

        <div class="modal" :class="{'is-active' : isEdit}">
            <div class="modal-background"></div>
            <div class="modal-card commands-panel-modal-card">
            <header class="modal-card-head">
                <div class="field is-grouped commands-panel-modal-card-header" style="margin-bottom: 0">
                    <div class="control">
                        <a class="button" title="Back to the dashboard" @click.stop="isEdit = false">
                            <span class="icon">
                                <i class="fa-solid fa-arrow-left"></i>
                            </span>
                        </a>
                        <input style="display: none;" ref="fileInput" type="file" accept=".js" @change="onFileChange"/>
                    </div>
                    <div class="control">
                        <input class="input" type="text" placeholder="Program name" v-model="item.name" @focus="keyboard(false)" @blur="keyboard(true)">
                    </div>
                    <div class="control">
                        <button class="button is-info" :class="{'is-info': !isConnectedBluetooth, 'is-success': isConnectedBluetooth, 'is-warning': isConnectedBluetoothProgress}" title="Connect via Bluetooth" @click.stop="connectBluetooth">
                            <i class="fab fa-bluetooth-b"></i>
                        </button>
                    </div>

                    <div class="control">
                        <a class="button is-info" :class="{'is-success': programSent, 'is-loading': programSending}" @click.stop="sendCode" title="Upload program">
                            <span class="icon">
                                <i class="fa-solid fa-upload"></i>
                            </span>
                            <span>Upload</span>
                        </a>
                    </div>
                    <div class="control" v-if="!isRuning">
                        <a class="button is-info" :class="{'is-success': isRuning}" @click.stop="runCode" title="Start program">
                            <span class="icon">
                                <i class="fa-solid fa-play"></i>
                            </span>
                            <span>Run</span>
                        </a>
                    </div>
                    <div class="control" v-if="isRuning">
                        <a class="button is-info" :class="{'is-danger': isRuning}" @click.stop="stopCode" title="Stop program">
                            <span class="icon">
                                <i class="fa-solid fa-stop"></i>
                            </span>
                            <span>Stop</span>
                        </a>
                    </div>

                    <div class="control">
                        <a class="button" title="Open a program from a file" @click.stop="triggerFileInput">
                            <span class="icon">
                                <i class="fa-solid fa-folder-open"></i>
                            </span>
                        </a>
                        <input style="display: none;" ref="fileInput" type="file" accept=".js" @change="onFileChange"/>
                    </div>
                    <div class="control">
                        <a class="button" @click.stop="exportProgram" title="Export program">
                            <span class="icon">
                                <i class="fa-solid fa-download"></i>
                            </span>
                        </a>
                    </div>
                    <div class="control">
                        <a class="button" @click.stop="copyCommand" title="Copy (Ctrl+C)">
                            <span class="icon">
                                <i class="fa-regular fa-copy"></i>
                            </span>
                        </a>
                    </div>
                    <div class="control">
                        <a class="button" @click.stop="pasteCommand" title="Paste (Ctrl+V)">
                            <span class="icon">
                                <i class="fa-regular fa-paste"></i>
                            </span>
                        </a>
                    </div>
                    <div class="control">
                        <a class="button" @click.stop="clearProgram" title="Clear all">
                            <span class="icon">
                                <i class="fa-regular fa-trash-can"></i>
                            </span>
                        </a>
                    </div>
                    <div class="control">
                        <a class="button" @click.stop="item.showRowNumber = !item.showRowNumber" title="Show row number">
                            <span class="icon">
                                <i class="fa-solid fa-toggle-off" v-if="!item.showRowNumber"></i>
                                <i class="fa-solid fa-toggle-on" v-else></i>
                            </span>
                        </a>
                    </div>
                    <div class="control">
                        <a class="button" @click.stop="reloadProgram" title="Reload program">
                            <span class="icon">
                                <i class="fa-solid fa-rotate"></i>
                            </span>
                        </a>
                    </div>
                    <div class="control">
                        <a class="button" @click.stop="isHelpVisible = true" title="Help">
                            <span class="icon">
                                <i class="fa-regular fa-circle-question"></i>
                            </span>
                        </a>
                    </div>
                </div>

                <button class="delete" aria-label="close" @click.stop="isEdit = false"></button>
            </header>
            <section class="modal-card-body commands-modal-card-body">
                <div class="commands-container" @click.stop="selectItem(null, null, programCommands)">
                    <draggable class="commands" v-model="commandsSet" item-key="uuid"
                    @start="drag=true" @end="drag=false" :force-fallback="true" :scroll-sensitivity="200" :animation="150"
                    :group="{ name: 'commands', pull: 'clone', put: () => true}" @change="onAddToCommandList" :clone="onClone" handle=".command-handle" @click.stop="toolbarNarrow = !toolbarNarrow" :move="checkMove"
                    >
                        <template #item="{element}">
                            <code-panel-command :only-icons="toolbarNarrow" :command="element" :data-inputs="dataInputs" @keyboard="keyboard" @click.stop=""></code-panel-command>
                        </template>
                    </draggable>
                    <div class="toolbarToggle" @click.stop="toolbarNarrow = !toolbarNarrow">
                        <i class="fa-solid fa-chevron-right" v-if="toolbarNarrow"></i>
                        <i class="fa-solid fa-chevron-left" v-else></i>
                    </div>
                    <draggable class="commands program" v-model="programCommands" item-key="uuid"
                    @start="drag=true" @end="drag=false" :force-fallback="true" :scroll-sensitivity="200" :animation="150"
                    :group="{ name: 'commands'}" handle=".command-handle" @change="onChangeCommands"
                    >
                        <template #item="{element, index}">
                            <div class="command-row">
                                <div class="row-nr" v-if="item.showRowNumber">{{ index }}</div>
                                <div v-else></div>
                                <code-panel-command :index="index" :parent-commands="programCommands" :commands="programCommands" :command="element" :showRowNumber="item.showRowNumber" :selected-item="selectedItem" :data-inputs="getDataInputs(element.id)" @select="selectItem" @keyboard="keyboard"></code-panel-command>
                            </div>
                            </template>
                    </draggable>
                </div>
            </section>
            </div>
        </div>


        <div class="modal" :class="{'is-active' : isHelpVisible}">
            <div class="modal-background"></div>
            <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Code Panel Help</p>
                <button class="delete" aria-label="close" @click.stop="isHelpVisible = false"></button>
            </header>
            <section class="modal-card-body section">
                <h2 class="subtitle">
                    How to run the program?
                </h2>
                <ol style="margin-left: 30px;">
                    <li>
                        Upload this program to your micro:bit.<br>
                        <a href="https://makecode.microbit.org/_Pdh4xx0RKais" target="blank"><i class="fa-solid fa-code"></i> Program in MakeCode Editor</a><br>
                    </li>
                    <li>
                        Turn on the <i class="fa-brands fa-bluetooth-b"></i> Bluetooth in your PC.
                    </li>
                    <li>
                        Pair the micro:bit with the PC. Click the button <button class="button is-info is-small">
                            <i class="fab fa-bluetooth-b"></i>
                        </button>, then select your micro:bit from the list of devices.
                    </li>
                    <li>
                        Upload the program by clicking the button <a class="button is-info is-small">
                            <span class="icon">
                                <i class="fa-solid fa-upload"></i>
                            </span>
                            <span>Upload</span>
                        </a>. The program starts automatically after uploading.
                    </li>
                </ol>
                <br>
                <h2 class="subtitle">
                    <a href="https://docs.google.com/document/d/1vNaX1eZbn5rdh3HRAc1Rv_YrvCrSTOmCJ6Oww0Xl5r0/edit?usp=sharing" target="blank">Commands description <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                </h2>
            </section>
            <footer class="modal-card-foot">
                <button class="button" @click.stop="isHelpVisible = false">Close</button>
            </footer>
            </div>
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
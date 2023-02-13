const ComponentAbout = {
template: `
    <section class="section">
    <h1 class="title">{{ $t("message.about_title") }}</h1>
    <div class="content">
        <p>{{ $t("message.about_1") }}</p>
        <h4>{{ $t("message.about_2") }}</h4>
        <p>{{ $t("message.about_3") }}</p>

        <h4>{{ $t("message.about_4") }}</h4>
        <p>{{ $t("message.about_5") }} <router-link to="/projects">{{ $t("message.about_6") }}</router-link>{{ $t("message.about_7") }}</p>
        <ul>
        <li>
            <p><strong>Data format</strong> - a data row sent from micro:bit should be in this format (see also code examples below). The first column is reserved for the timestamp, which is used to appropriate set in a time received data. You can view the received data in the dashboard console.</p>
            <pre>
Column 0 , Column 1, Column 2, ...
timestamp, Data 1  , Data 2  , ...</pre>
        </li>
        </ul>
        <ul>
            <li>
                <p><strong>Toolbar</strong></p>
                <div class="help-measurement-tools">
                    <button class="button is-info">
                        <i class="fab fa-bluetooth-b"></i>
                    </button>
                    <div>Connect via Bluetooth</div>

                    <button class="button is-info">
                        <i class="fab fa-usb"></i>
                    </button>
                    <div>Connect via WebUSB</div>

                    <button class="button is-info">
                        <i class="fas fa-chart-line"></i>
                    </button>
                    <div>
                        <p>Add a chart</p>
                        <openimage src="./img/example_chart.png"></openimage>
                    </div>
            
                    <button class="button is-info">
                        <i class="fas fa-tachometer-alt"></i>
                    </button>
                    <div>
                        <p>Add a gauge</p>
                        <openimage src="./img/example_gauge.png" height="250px"></openimage>
                    </div>
            
                    <button class="button is-info">
                        <i class="fa-solid fa-gamepad"></i>
                    </button>
                    <div>
                        <p>Add a control panel: buttons, inputs and outputs.</p>
                        <openimage src="./img/example_control_panel_2.png" height="50px"></openimage>
                    </div>

                    <button class="button is-info">
                        <i class="fa-solid fa-code"></i>
                    </button>
                    <div>
                        <p>Code panel - simple block code editor similar to LEGO WeDo. Allows remote programming of the micro:bit via Bluetooth.</p>
                        <openimage src="./img/example_code_panel.png" height="50px"></openimage>
                        <openimage src="./img/example_code_panel_opened.png" height="400px"></openimage>
                    </div>

                    <button class="button is-info">
                        <i class="fas fa-pause"></i>
                    </button>
                    <div>Stop / start receiving data</div>
            
                    <button class="button is-info">
                        <i class="fas fa-eraser"></i>
                    </button>
                    <div>Clear data</div>

                    <button class="button is-info">
                        <i class="fa-solid fa-folder-open"></i>
                    </button>
                    <div>Open a dashboard from a file</div>

                    <button class="button is-info">
                        <i class="fa-solid fa-download"></i>
                    </button>
                    <div>Save the dashboard to a file dashboard.mmw</div>

                    <button class="button is-info">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                    <div>Remove all widgets / Restore the default widgets</div>
            
                    <button class="button is-info">
                        <i class="fas fa-keyboard"></i>
                    </button>
                    <div>Toggle sending keyboard key codes</div>

                    <button class="button is-info">
                        <i class="fas fa-terminal"></i>
                    </button>
                    <div>
                        <p>Console - here you can see the received and sent data</p>
                        <openimage src="./img/example_console.png"></openimage>
                        <br>
                    </div>

                    <button class="button is-info" title="Toggle data mocking">
                        <span class="icon is-small">
                        <i class="fas fa-vial"></i>
                        </span>
                    </button>
                    <div>Toggle data mocking - it generates fake data that can be used to test widget settings</div>
            
                    <button class="button is-info">
                        <i class="fas fa-cog"></i>
                    </button>
                    <div>Settings</div>
                </div>
            </li>
        </ul>
        <h4>Code examples</h4>
        <ul>
        <li>
            <p><strong>Sending data via WebUSB</strong></p>
            <a href="https://makecode.microbit.org/_6xgcDRH0eDbx" target="blank"><i class="fa-solid fa-code"></i> Program in MakeCode Editor</a><br><br>
            <b><i class="fa-brands fa-js"></i> JavaScript</b>
            <pre>
basic.forever(() => {
    let out = [input.runningTime(), input.temperature()]
    serial.writeNumbers(out)
    basic.pause(1000)
})</pre>
            <br>
        </li>
        <li>
            <p><strong>Sending data via Bluetooth UART</strong></p>
            <p>In project settings should be enabled only: <strong>No Pairing Required: Anyone can connect via Bluetooth</strong>.</p>
            <a href="https://makecode.microbit.org/_bjg43cLd4DYD" target="blank"><i class="fa-solid fa-code"></i> Program in MakeCode Editor</a><br><br>
            <b><i class="fa-brands fa-js"></i> JavaScript</b>
            <pre>
bluetooth.startUartService()

bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Yes)
})

bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.No)
})

basic.forever(() => {
    let out = [input.runningTime(), input.temperature()]
    bluetooth.uartWriteString(out.join(',') + '\n')
    basic.pause(1000)
})</pre>
            <br>
        </li>
        <li>
            <p><strong>Receiving commands via Bluetooth UART or WebUSB</strong></p>
            <a href="https://makecode.microbit.org/_CVkeRq91VAwW" target="blank"><i class="fa-solid fa-code"></i> Program in MakeCode Editor</a><br><br>
            <b><i class="fa-brands fa-js"></i> JavaScript</b>
            <pre>
bluetooth.startUartService()

bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Yes)
})

bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.No)
})

bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    let receivedString = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    if (receivedString == "Heart") {
        basic.showIcon(IconNames.Heart)
    } else if (receivedString == "Happy") {
        basic.showIcon(IconNames.Happy)
    }
})

serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    let receivedString = serial.readUntil(serial.delimiters(Delimiters.NewLine))
    if (receivedString == "Heart") {
        basic.showIcon(IconNames.Heart)
    } else if (receivedString == "Happy") {
        basic.showIcon(IconNames.Happy)
    }
})</pre>
            <br>
        </li>
        </ul>
    </div>
    </section>
    `
}
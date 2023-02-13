const ComponentProjects = {
template: `
    <section class="section">
    <h1 class="title">My Projects</h1>
    <div class="content">
        <h4>Google Spreadsheets Data Logger</h4>
        The application takes data from micro:bit and saves it in a Google spreadsheet.<br>
        <a href="https://script.google.com/macros/s/AKfycbxW_2_HUB7pTe1D8Azcd3WslObbG6AqjmkDPTSrxfezPhBujhDG8TuWuQGFM8Exc3i9wA/exec" target="blank"><i class="fa-solid fa-square-arrow-up-right"></i> Google Spreadsheets Data Logger</a><br><br>

        <h4>Examples of data transfer projects</h4>
        <ul>
        <li>
            <strong>Collecting light level via Bluetooth.</strong>
            <p>
            <a href="https://makecode.microbit.org/_DCgRMFgWhD7F" target="blank"><i class="fa-solid fa-code"></i> Program in MakeCode Editor</a><br>
            <a href="./widgets_light_level.mmw" download><i class="fa-solid fa-gauge"></i> Import these widgets on the Dashboard tab</a><br><br>
            <openimage src="./img/widgets_light_level.png"></openimage>
            </p>
        </li>
        <li>
            <strong>Controlling the dot on the micro:bit screen. Sending text to the micro:bit.</strong>
            <p>
            <a href="https://makecode.microbit.org/_KdW4Rk4pE4UC" target="blank"><i class="fa-solid fa-code"></i> Program in MakeCode Editor</a><br>
            PC keys: up, down, right, left and their combinations.<br>
            </p>
            <p></p>
        </li>
        <li>
            <strong>Collecting data from all micro:bit sensors.</strong>
            <p>
            <a href="https://makecode.microbit.org/_bofecr3Fk7s4" target="blank"><i class="fa-solid fa-code"></i> Program in MakeCode Editor</a><br>
            <a href="./widgets_all_sensors.mmw" download><i class="fa-solid fa-gauge"></i> Import these widgets on the Dashboard tab</a><br>
            Dashboard tab: enabling and disabling sensors, changing the data collection interval.<br>
            Commands: "get" - data refresh.<br>
            If the sensor interval is smaller than the data sending interval, the average value of the measurements between data sending is taken.<br><br>
            <openimage src="./img/dashboard_sensors_support.png"></openimage>
            </p>
            <p></p>
        </li>
        <li>
            <strong>Controlling a LEGO car (servo motor) or a tracked vehicle.</strong>
            <p>
            <a href="https://makecode.microbit.org/_MEkP7P2ggapF" target="blank"><i class="fa-solid fa-code"></i> Program in MakeCode Editor</a><br>
            PC keys: up, down, right, left and their combinations, space (brake).<br>
            micro:bit keys: AB - mode change (0 - car, 1 - tracked vehicle)
            </p>
            <p></p>
        </li>
        <li>
            <strong>Collecting temperature data from sensors: DS18B20 and the micro:bit.</strong>
            <p>
            <a href="https://makecode.microbit.org/_Kqo6eA3qKe3F" target="blank"><i class="fa-solid fa-code"></i> Program in MakeCode Editor</a><br>
            <a href="./DS18B20.mmw" download><i class="fa-solid fa-gauge"></i> Import these widgets on the Dashboard tab</a><br>
            PC keys: arrow down - force download data.<br>
            Commands: "get" - data refresh.<br><br>
            <openimage src="./img/DS18B20_widgets.png"></openimage>
            </p>
            <p></p>
        </li>
        </ul>
        <br>
        <h4>LEGO Power Functions</h4>
        <p>Extension "PF Transmitter" (lego-pf-transmitter) allows quite accurate controlling devices connected to LEGO Power Functions using 940nm IR led. Micro:bit is also small enough to be built in Lego projects to make them alive.</p>
        <ul>
        <li>
            <b>Testing extension "PF Transmitter" (lego-pf-transmitter).</b><br>
            <a href="https://makecode.microbit.org/_iPi5yo2hdR6z" target="blank"><i class="fa-solid fa-code"></i> Program in MakeCode Editor</a><br><br>
            <iframe src="https://drive.google.com/file/d/1aVUfGcxmnRm9SUpj3odHCYFacAxizPg4/preview" width="640" height="480" allow="autoplay" style="background: lightgray;"></iframe>
            <br><br>
        </li>
        <li>
            <b>Testing extension "PF Receiver" (lego-pf-receiver)</b> - it allows you to receive commands from LEGO Power Functions remote controls using IR receiver module (eg Iduino ST1089).<br>
            <a href="https://makecode.microbit.org/_YX4HbD3XkL5C" target="blank"><i class="fa-solid fa-code"></i> Program in MakeCode Editor</a><br><br>
            <iframe src="https://drive.google.com/file/d/1gU34HLPgPHbufnOvj1xI0RumeEhiakzE/preview" width="640" height="480" allow="autoplay" style="background: lightgray;"></iframe>
            <br><br>
        </li>
        <li>
            <b>LEGO WeDo Hungry Crocodile controlled by micro:bit with digital distance sensor.</b><br>
            <a href="https://makecode.microbit.org/_TKpfVv2RPDDt" target="blank"><i class="fa-solid fa-code"></i> Program in MakeCode Editor</a><br><br>
            <iframe src="https://drive.google.com/file/d/1fQ0HiN0IC9cMzofeOCszuLBvhIqmBsrn/preview" width="640" height="480" allow="autoplay" style="background: lightgray;"></iframe>
            <br><br>
        </li>
        <li>
            <b>LEGO 8094 Control Center - Ploter controlled by micro:bit.</b><br>
            <a href="https://makecode.microbit.org/_fee9eYgioJaY" target="blank"><i class="fa-solid fa-code"></i> Program in MakeCode Editor</a><br><br>
            <iframe src="https://drive.google.com/file/d/1q-81Y-dks4G8K4GuqfiNdftNcNLBI6iT/preview" width="640" height="480" allow="autoplay" style="background: lightgray;"></iframe>
            <br><br>
        </li>
        <li>
            <b>LEGO Tracked vehicle reacting on claps and sunlight.</b><br>
            <br>
            <iframe src="https://drive.google.com/file/d/1mftfzfifz0MfbAPEmLRRSEoW_GeVXlBs/preview" width="640" height="480" allow="autoplay" style="background: lightgray;"></iframe>
            <br><br>
        </li>
        <li>
            <b>LEGO Automatic railway barrier - photogate (IR diode and photoresistor).</b><br>
            <a href="https://makecode.microbit.org/_YariHLCoeEAc" target="blank"><i class="fa-solid fa-code"></i> Program in MakeCode Editor</a><br><br>
            <iframe src="https://drive.google.com/file/d/1Uk-WlPBc-EwNskCbgOSZb5qYuglQ6z9h/preview" width="640" height="480" allow="autoplay" style="background: lightgray;"></iframe>
            <br><br>
        </li>
        </ul>
    </div>
    </section>
    `
}
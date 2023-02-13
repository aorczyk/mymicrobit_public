const ComponentExtensions = {
template: `
    <section class="section">
    <h1 class="title">My Extensions</h1>
    <div class="content">
        <h4>LEGO Power Functions</h4>
        <openimage src="./img/description.jpg" height="300px"></openimage>
        <ul>
        <li><b><a href="https://github.com/aorczyk/lego-pf-transmitter" target="blank">Lego PF transmitter</a></b> (lego-pf-transmitter) - Controlling LEGO Power Functions devices simultaneously with Micro:bit and an 940 nm emitting diode.<br><br>
            <openimage src="./img/lego-pf-transmitter.png"></openimage><br>
            Features:<br>
            <ul>
            <li>all Power Functions commands were implemented</li>
            <li>controlling multiple devices at the same time</li>
            <li>precise control (quick change the state of the channel output)</li>
            </ul>
            <a href="https://github.com/aorczyk/lego-pf-transmitter" target="blank"><i class="fa-brands fa-github"></i> Documentation</a><br>
            <router-link to="/projects"><i class="fa-solid fa-square-arrow-up-right"></i> Examples</router-link><br><br>
        </li>
        <li><b><a href="https://github.com/aorczyk/lego-pf-receiver" target="blank">Lego PF receiver</a></b> (lego-pf-receiver) - 
        Receiving commands from LEGO Power Functions remote controls using IR Receiver Module Iduino ST1089. Running given function when specific button is pressed or released.<br><br>
            <openimage src="./img/lego-pf-receiver.png"></openimage><br>
            Features:<br>
            <ul>
            <li>possibility to run action on RC button pressed or released</li>
            <li>recording commands from given channels, which could be played by extension "PF Recorder"</li>
            </ul>
            <a href="https://github.com/aorczyk/lego-pf-receiver" target="blank"><i class="fa-brands fa-github"></i> Documentation</a><br>
            <router-link to="/projects"><i class="fa-solid fa-square-arrow-up-right"></i> Examples</router-link><br><br>
            </li>
        <li><b><a href="https://github.com/aorczyk/pf-recorder" target="blank">Lego PF recorder</a></b> (lego-pf-recorder) - Recording commands from LEGO Power Functions remote controls and playing them. Using IR Receiver Module Iduino ST1089 and IR 940 nm emitting diode.<br><br>
            <openimage src="./img/lego-pf-recorder.png"></openimage><br>
            <a href="https://github.com/aorczyk/pf-recorder" target="blank"><i class="fa-brands fa-github"></i> Documentation</a><br><br>
        </li>
        </ul>
        <h4>Utilities</h4>
        <ul>
        <li><b><a href="https://github.com/aorczyk/soroban" target="blank">Soroban</a></b> (soroban) - Displaying number on the micro:bit screen as on the soroban abacus.<br><br>
        <openimage src="./img/soroban.png"></openimage><br>
        Features:<br>
        <ul>
            <li>This allows the user to display a 5 digit number on the screen.</li>
            <li>It's also much faster than displaying a normal number, e.g.: basic.showNumber(25) takes about 2657 ms, soroban.showNumber(25) takes about 1 ms.</li>
        </ul>
        Representation of digits 0 - 9, minus and decimal separator on the micro:bit screen (- led is off, + led is on):
        <pre>
- - - - - + + + + + - -
- + + + + - + + + + - -
- - + + + - - + + + + -
- - - + + - - - + + - -
- - - - + - - - - + - +

0 1 2 3 4 5 6 7 8 9 - .
        </pre>
        The extension by default aligns a number to the right but you can also align it to a given column. It allows to make e.g. micro:bit soroban clock, with hours and minutes displayed on the screen.
        Soroban is still used in some schools in Japan.<br><br>
        <a href="https://github.com/aorczyk/soroban" target="blank"><i class="fa-brands fa-github"></i> Documentation</a><br><br>
        Interesting links:
        <ul>
            <li><a href="https://www.youtube.com/watch?v=Px_hvzYS3_Y" target="_blank">Soroban - All in the mind</a></li>
            <li><a href="https://www.vice.com/en/article/9keyvv/thousands-of-japanese-kids-are-still-learning-math-on-the-abacus" target="_blank">Thousands of Japanese Kids Are Still Learning Math on the Abacus</a></li>
        </ul>
        <img src="./img/soroban_icon.png">
        <img src="./img/soroban_Pi.png" style="height:170px;margin-bottom: 15px;">
        <img src="./img/soroban_clock.png"  style="height:170px;margin-bottom: 15px;">
        <img src="./img/soroban_ice_with_salt.png"  style="height:170px;margin-bottom: 15px;">
        </li>
        </ul>


    </div>
    </section>
    `
}
var clock = SAGE2_App.extend({

    init: function (data) {
        // Vytváří canvas pro danou aplikaci
        this.SAGE2Init("canvas", data);
        // Povoluje spuštění funkce resize() při změně velikosti okna
        this.resizeEvents = "continuous"; 
        // Ukládá context
        this.ctx = this.element.getContext("2d");
        // Spušťuje funkce resize(date)
        this.sendResize(this.element.width, this.element.height);
    },
    
    resize: function (date) {
        // Poprvé iniciaizují parametry. Dále jen upravuje je.
        this.radius = this.element.width / 2;
        this.center_x = this.radius;
        this.center_y = this.radius;
        // Spušťuje funkce draw()
        this.refresh(date);
    },

    draw: function (date) {
        // Kreslí cifernik
        this.drawClockFace();
        // Kreslí ručička
        this.drawClockHands();
    },
   
    drawLine: function (x0, y0, x1, y1) {
        // Otevírá blok. Všechno, co bude nakresleno uvnítř bloku stane současti jedné figury
        this.ctx.beginPath();
        // Přenesé pero na pozici (x0, y0)
        this.ctx.moveTo(x0, y0);
        // Nakreslí čáru od současné pozici pera do bodu (x1, y1)
        this.ctx.lineTo(x1, y1);
        // Obárví vysledek a uzavřé blok
        this.ctx.stroke();
    },

    drawClockFace: function () {
        // Kreslí bílé kružnice cíferniku
        this.ctx.fillStyle = "white";

        this.ctx.beginPath();
        // Kreslí oblouk ze středem (this.radius, this.radius), radiusem "this.radius".
        // Začíná se od 0 a končí se 2 * Pi rad ve směru hodinových ručiček.
        this.ctx.arc(this.center_x, this.center_y, this.radius, 0, Math.PI * 2, true);
        this.ctx.fill();

        // Nastavení parametrů pro kreslení čár na ciferniku
        // Změní šířku čáry
        this.ctx.lineWidth = 1;
        // Změní barvu čáry
        this.ctx.strokeStyle = "grey";
        // Barva figury
        this.ctx.fillStyle = "black";
        // Nastavení písma
        this.ctx.font = "16px serif";
        let angle = 360 / 60;
        let num = 1;
        // Po úkončení ciklu dostaneme nakreslené čáry a čísla na ciferniku
        for (let i = -60; i < 300; i += angle) {
        
            let x0 = this.radius * Math.cos((Math.PI / 180) * i);
            let y0 = this.radius * Math.sin((Math.PI / 180) * i);

            // Koeficient se používá pro nalezení druhého bodu čáry
            let coef = 6 / 7;
            // Pokud čára je hodinová, zvětšuje je a kreslí číslo
            if (i % 30 == 0) {
                coef = 3.5 / 5;
                if (num > 9)
                    // Funkce kreslí text "num" v bodě ((x0 * coef) - 8 + this.radius, (y0 * coef) + this.radius + 4))
                    this.ctx.fillText(num, (x0 * coef) - 8 + this.center_x, (y0 * coef) + this.center_y + 4);
                else
                    this.ctx.fillText(num, (x0 * coef) - 4 + this.center_x, (y0 * coef) + this.center_y + 4);
                num++;
                coef = 4 / 5;
            }
        
            // Kreslení čár
            this.drawLine(x0 + this.center_x, y0 + this.center_y, (x0 * coef) + this.center_x, (y0 * coef) + this.center_y);
        }
        
        // Kreslí dekoráční rameček kolem ciferniku
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 5;
        
        this.ctx.beginPath();
        this.ctx.arc(this.center_x, this.center_y, this.radius, 0, Math.PI * 2, true);
        this.ctx.stroke();
    },

    drawClockHands: function () {
        // Uchvává čás
        let time = new Date();

        let second = time.getSeconds();
        let minute = time.getMinutes();
        let hour = time.getHours() % 12;

        // Na základě čásu vypočítá úhel ručiček
        let secondAngle = second * 6 - 90;
        let minuteAngle = minute * 6 + second * 0.1 - 90;
        let hourAngle = hour * 30 + minute * 0.5 + second * 0.5 / 60 - 90;

        // Vypočet bodů
        let second_x0 = this.radius * Math.cos((Math.PI / 180) * secondAngle);
        let second_y0 = this.radius * Math.sin((Math.PI / 180) * secondAngle);
        
        let minute_x0 = this.radius * Math.cos((Math.PI / 180) * minuteAngle);
        let minute_y0 = this.radius * Math.sin((Math.PI / 180) * minuteAngle);
        
        let hour_x0 = this.radius * Math.cos((Math.PI / 180) * hourAngle);
        let hour_y0 = this.radius * Math.sin((Math.PI / 180) * hourAngle);

        // Kreslí sekundová ručička 
        // Parametr lineCap ukazuje na to, jak budou vypadat konce provedených čár. "round" znamená, že budou zaokrouhlené
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 2;
        //Počáteční koeficient slouží pro nalezení horního bodu ručička
        let coef_begin = 7 / 8;
        //Koncový koeficient slouží pro nalezení dolního bodu ručička
        let coef_end = -1 / 8;

        this.drawLine((second_x0 * coef_end) + this.center_x,
            (second_y0 * coef_end) + this.center_y,
            (second_x0 * coef_begin) + this.center_x,
            (second_y0 * coef_begin) + this.center_y);

        // Kreslí minutová ručička 
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "green";
        
        this.drawLine((minute_x0 * coef_end) + this.center_x,
            (minute_y0 * coef_end) + this.center_y,
            (minute_x0 * coef_begin) + this.center_x,
            (minute_y0 * coef_begin) + this.center_y);
        
        // Kreslí hodinová ručička 
        coef_begin = 4 / 8;
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = "blue";
        
        this.drawLine((hour_x0 * coef_end) + this.center_x,
            (hour_y0 * coef_end) + this.center_y,
            (hour_x0 * coef_begin) + this.center_x,
            (hour_y0 * coef_begin) + this.center_y);
        
        // Kreslí malé žluté dekorační kružnice uprostřed.
        this.ctx.fillStyle = "yellow";
        
        this.ctx.beginPath();
        this.ctx.arc(this.center_x, this.center_y, 5, 0, 2 * Math.PI, true);
        this.ctx.fill();
    },
});
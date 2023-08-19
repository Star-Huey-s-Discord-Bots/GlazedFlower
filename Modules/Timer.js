// This is my custom timer system
// Can do interval tasks with less tolerance

class Tick {
    start;
    interval;
    callback;

    constructor (start    = 0, 
                 interval = 0, 
                 callback = () => {}) {
        this.start    = start;
        this.interval = interval;
        this.callback = callback;
    }

    getStartTime() {
        let now = new Date().valueOf();

        if (this.start > now)
            return this.start;
        else
            this.start + Math.ceil((now - this.start) / this.interval) * this.interval;
    }

    check(time, tolerance = 1000) {
        if (time < this.start) return false;
        
        if (this.interval)
            return (time - this.start + tolerance * .5) % this.interval < tolerance;

        return time - this.start < tolerance;
    }    
}

class Clock {
    index;
    timeout;
    begin;
    interval;

    ticks = new Array();
    
    callback = () => {
        var now = new Date().valueOf();
        for (let [ i, t ] of this.ticks.reverse().entries()) {
            if (t.check(now, this.interval * .5)) {
                t.callback();
                if (!t.interval)
                    this.ticks.splice(i, 1);
            }
        }
    };

    constructor (interval = 5_000) {
        if (interval) 
            this.interval = interval;
    }

    addTick(tick) {
        this.ticks.push(tick);
    }

    start() {
        let now = new Date().valueOf();
        this.begin = Math.ceil(now / this.interval) * this.interval;
        let step = () => {
            this.index += 1;
            let now = new Date().valueOf();
            this.callback();
            this.timeout = setTimeout(
                step, 
                this.begin + this.index * this.interval - now
            );
        };

        this.index = 0;
        this.timeout = setTimeout(
            step, 
            this.begin + this.index * this.interval - now
        );

        return this;
    }

    stop() {
        clearTimeout(this.timeout);

        return this;
    }
}

module.exports = { Clock, Tick };

/*
const tick = new Tick(new Date("2023-04-18 13:10").valueOf(), 2000, () => {
    console.log("tick");
});

const clock = new Clock(1000);

clock.addTick(tick);

clock.start();

(async () => {
    setTimeout(() => {
        clock.stop();
        console.log("stopping!");
    }, 5000);
})();
*/
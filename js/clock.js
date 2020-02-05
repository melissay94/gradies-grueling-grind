export default function(time) {
    this.count = 0;
    this.interval = 1000;

    this.setTime = function() {
        console.log(this);

        this.count++;

        let secondFormula = this.count % 60;
        let secondDisplay = secondFormula < 10 ? "0"+secondFormula : secondFormula.toString();

        let minuteFormula = Math.floor((this.count % 3600) / 60);
        let minuteDisplay = minuteFormula < 10 ? "0"+minuteFormula : minuteFormula.toString();

        let hourFormula = Math.floor(this.count / 43200);
        let hourDisplay = hourFormula.toString();

        document.getElementById("time").textContent = `${hourDisplay}:${minuteDisplay}:${secondDisplay}`;
    }
}
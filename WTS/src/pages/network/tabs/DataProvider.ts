export class DataProvider{


    data = [];

    constructor(){
        this.load();
    }

    private load():void{
        this.data.push({name: "Max Mustermann", description: "Freunde"});
        this.data.push({name: "Hans Müller", description: "Freunde"});
        this.data.push({name: "Cindy aus Marzahn", description: "Freunde"});
        this.data.push({name: "Chuck Norris", description: "Freunde"});
        this.data.push({name: "John Doe", description: "Freunde"});
        this.data.push({name: "Micheal Scott", description: "Freunde"});
        this.data.push({name: "Diwght Schrute", description: "Freunde"});
    }

    public getData():any{
        return this.data;
    }

}
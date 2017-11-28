export class DataProvider{


    data = [];

    constructor(){
        this.load();
    }

    private load():void{
        this.data.push({id:"acc_1", name: "Max Mustermann", description: "Freunde"});
        this.data.push({id:"acc_10",name: "Hans Müller", description: "Freunde"});
        this.data.push({id:"acc_7",name: "Cindy aus Marzahn", description: "Freunde"});
        this.data.push({id:"acc_12",name: "Chuck Norris", description: "Freunde"});
        this.data.push({id:"acc_17",name: "John Doe", description: "Freunde"});
        this.data.push({id:"KxC9j2zmz4VEv47-gba",name: "Micheal Scott", description: "Freunde"});
        this.data.push({id:"KxAlMebhrd5hOJd6ilL",name: "Diwght Schrute", description: "Freunde"});
    }

    public getData():any{
        return this.data;
    }

}
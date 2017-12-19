import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Storage } from '@ionic/storage';
import { BlockTable } from '../../../providers/api/block';
import { VisibilityTable } from '../../../providers/api/visibility';

interface Group {
    student: boolean,
    company: boolean,
    university: boolean
}

@Component({
    selector: "settings-visibility",
    templateUrl: "settings_visibility.html"
})
export class SettingsVisibility {

    /**
     * Data saves block-ids for each visibility-setting
     */
    data = {
        personal: {
            student: undefined,
            company: undefined,
            university: undefined
        },

        study : {
            student: undefined,
            company: undefined,
            university: undefined
        },

        address : {
            student: undefined,
            company: undefined,
            university: undefined
        },

        email : {
            student: undefined,
            company: undefined,
            university: undefined
        }
    }

    /**
     * Blocks saves actual value (true or false), which is corresponding to the data object
     */
    blocks = {
        personal: {
            student: undefined,
            company: undefined,
            university: undefined
        },

        study : {
            student: undefined,
            company: undefined,
            university: undefined
        },

        address : {
            student: undefined,
            company: undefined,
            university: undefined
        },

        email : {
            student: undefined,
            company: undefined,
            university: undefined
        }
    }

    addressToggled: boolean = false;
    personalToggled: boolean = false;
    studyToggled: boolean = false;
    emailToggled: boolean = false;

    isExtern: boolean;
    prefix: string;

    accID:string;

    constructor(public navparams: NavParams, public storage:Storage, public blockTable:BlockTable, 
                public visibilityTable:VisibilityTable) {

        this.blockTable.setSrcClass(this);
        this.visibilityTable.setSrcClass(this);
                    
        this.isExtern = navparams.get("isExtern");
        if (this.isExtern) {
            this.prefix = "extern_";
        } else {
            this.prefix = "intern_";
        }
    }

    changeSetting(key) {
        this.setValueByString(key);
    }

    toggleBlock(number) {
        if (number == 0) {
            this.personalToggled = !this.personalToggled;
        } else if (number == 1) {
            this.studyToggled = !this.studyToggled;
        } else if (number == 2) {
            this.addressToggled = !this.addressToggled;
        } else if (number == 3) {
            this.emailToggled = !this.emailToggled;
        }
    }

    /**
     * 
     * @param key 
     */
    setValueByString(key:string){
        var obj = key.replace("blocks.", "");
        var keys = obj.split('.');

        var value = this.blocks[keys[0]][keys[1]];
        var blockId = this.data[keys[0]][keys[1]];
        var group = this.getGroup(key);
        //saves value into server

    }

    /**
     * 
     * @param key 
     */
    loadValueByString(blockId:string,key:string, value:boolean){
        var obj = key.replace(this.prefix+"_", "");
        var keys = obj.split('_');
        console.log(this.blocks[keys[0]][keys[1]]);
        this.blocks[keys[0]][keys[1]] = value;
        this.data[keys[0]][keys[1]] = blockId;
    }

    getGroup(key:string){
        if(key.includes("student")){
            return "gruppe_1";
        } else if(key.includes("company")){
            return "gruppe_2";
        }else if(key.includes("university")){
            return "gruppe_3";
        }
    }
}


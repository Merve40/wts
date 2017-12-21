import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Storage } from '@ionic/storage';
import { BlockTable } from '../../../providers/api/block';
import { VisibilityTable } from '../../../providers/api/visibility';
import { resolve } from 'path';

interface Group {
    student: boolean,
    company: boolean,
    uni: boolean
}

@Component({
    selector: "settings-visibility",
    templateUrl: "settings_visibility.html"
})
export class SettingsVisibility {

    /**
     * Data saves json-objects from the db for each visibility-setting
     */
    data = {
        personal: {
            student: undefined,
            company: undefined,
            uni: undefined
        },

        study: {
            student: undefined,
            company: undefined,
            uni: undefined
        },

        address: {
            student: undefined,
            company: undefined,
            uni: undefined
        },

        email: {
            student: undefined,
            company: undefined,
            uni: undefined
        }
    }

    /**
     * Blocks saves actual value (true or false), which is corresponding to the data object
     */
    blocks = {
        personal: {
            student: undefined,
            company: undefined,
            uni: undefined
        },

        study: {
            student: undefined,
            company: undefined,
            uni: undefined
        },

        address: {
            student: undefined,
            company: undefined,
            uni: undefined
        },

        email: {
            student: undefined,
            company: undefined,
            uni: undefined
        }
    }

    addressToggled: boolean = false;
    personalToggled: boolean = false;
    studyToggled: boolean = false;
    emailToggled: boolean = false;

    isExtern: boolean;
    prefix: string;

    accID: string;

    constructor(public navparams: NavParams, public storage: Storage, public blockTable: BlockTable,
        public visibilityTable: VisibilityTable) {

        this.blockTable.setSrcClass(this);
        this.visibilityTable.setSrcClass(this);

        this.isExtern = navparams.get("isExtern");
        this.accID = navparams.get("userId");

        if (this.isExtern) {
            this.prefix = "extern_";
        } else {
            this.prefix = "intern_";
        }
        console.log(this.prefix);
        this.load();
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

    load() {
        this.visibilityTable.filterByValue("Account_Id", this.accID, "", (src, jsonArray) => {
            jsonArray.forEach(json => {
                if (!json) return;

                this.blockTable.getById(json.body.Block_Id, "", (src, block) => {
                    if (!block) return;

                    var blockName: string = block.body.Block_Name;
                    if (blockName.startsWith(this.prefix)) {
                        this.loadValueByString(json, blockName, json.body.Sichtbar);
                    }
                });
            });
        });
    }

    /**
     * 
     * @param key 
     */
    setValueByString(key: string) {

        var obj = key.replace(/blocks./i, "");
        var keys = obj.split('.');

        var value = this.blocks[keys[0]][keys[1]];
        var json = this.data[keys[0]][keys[1]];
        if (!json) {
            return;
        }

        //saves value into the database
        json.body.Sichtbar = value;
        this.visibilityTable.update(json.id, json.body, "", (src, js) => { });


    }

    /**
     * 
     * @param key 
     */
    loadValueByString(json, key: string, value: boolean) {
        var pattern;
        if (this.isExtern) {
            pattern = /extern_/i;
        } else {
            pattern = /intern_/i;
        }
        var obj = key.replace(pattern, '');
        var keys = obj.split('_');
        this.blocks[keys[0]][keys[1]] = value;
        this.data[keys[0]][keys[1]] = json;
    }
}


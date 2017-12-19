import { Component } from '@angular/core';

@Component({
    selector: "settings-visibility",
    templateUrl : "settings_visibility.html"
})
export class SettingsVisibility{

    addressToggled = false;

    toggle1=false;
    toggle2=false;
    toggle3=false;

    changeSetting(number){

    }

    toggleBlock(number){
        console.log("toggling");
        this.addressToggled = !this.addressToggled;
    }
}
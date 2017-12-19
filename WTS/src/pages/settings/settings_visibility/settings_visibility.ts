import { Component } from '@angular/core';

@Component({
    selector: "settings-visibility",
    templateUrl: "settings_visibility.html"
})
export class SettingsVisibility {

    addressToggled = false; 
    personalToggled = false;
    studyToggled = false;
    emailToggled = false;

    toggle1 = false;
    toggle2 = false;
    toggle3 = false;

    changeSetting(number) {

    }

    toggleBlock(number) {
        if(number == 0){
            this.personalToggled = !this.personalToggled;
        } else if(number == 1){
            this.studyToggled = !this.studyToggled;
        }else if(number == 2){
            this.addressToggled = !this.addressToggled;
        }else if(number == 3){
            this.emailToggled = !this.emailToggled;
        }
    }
}
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular/navigation/nav-params';

@Component({
    selector: "settings-visibility",
    templateUrl: "settings_visibility.html"
})
export class SettingsVisibility {

    isExtern:boolean;

    addressToggled:boolean = false; 
    personalToggled:boolean = false;
    studyToggled:boolean = false;
    emailToggled:boolean = false;

    toggle1 = false;
    toggle2 = false;
    toggle3 = false;

    constructor(public navparams:NavParams){
        this.isExtern = navparams.get("isExtern");
    }

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

enum VisibilityBlock {
    //INTERN-STUDENT
    INTERN_STUDENT_ADDRESS = "intern_student_address",
    INTERN_STUDENT_EMAIL = "intern_student_email",
    INTERN_STUDENT_STUDY = "intern_student_study",
    INTERN_STUDENT_PERSONAL = "intern_student_personal",
    //INTERN-COMPANY
    INTERN_COMPANY_ADDRESS = "intern_company_address",
    INTERN_COMPANY_EMAIL = "intern_company_email",
    INTERN_COMPANY_STUDY = "intern_company_study",
    INTERN_COMPANY_PERSONAL = "intern_company_personal",
    //INTERN-UNI
    INTERN_UNI_ADDRESS = "intern_uni_address",
    INTERN_UNI_EMAIL = "intern_uni_email",
    INTERN_UNI_STUDY = "intern_uni_study",
    INTERN_UNI_PERSONAL = "intern_company_personal",
    //EXTERN-STUDENT
    EXTERN_STUDENT_ADDRESS = "extern_student_address",
    EXTERN_STUDENT_EMAIL = "extern_student_email",
    EXTERN_STUDENT_STUDY = "extern_student_study",
    EXTERN_STUDENT_PERSONAL = "extern_student_personal",
    //EXTERN-COMPANY
    EXTERN_COMPANY_ADDRESS = "extern_company_address",
    EXTERN_COMPANY_EMAIL = "extern_company_email",
    EXTERN_COMPANY_STUDY = "extern_company_study",
    EXTERN_COMPANY_PERSONAL = "extern_company_personal",
    //EXTERN-UNI
    EXTERN_UNI_ADDRESS = "extern_uni_address",
    EXTERN_UNI_EMAIL = "extern_uni_email",
    EXTERN_UNI_STUDY = "extern_uni_study",
    EXTERN_UNI_PERSONAL = "extern_uni_personal",
  }
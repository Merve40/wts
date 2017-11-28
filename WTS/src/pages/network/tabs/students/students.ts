import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';

@Component({
    selector: 'student-tab',
    templateUrl: 'students.html'
  })
export class StudentNetwork{

  constructor(public navCtrl:NavController){    
  }

  ngAfterViewInit(){
  }

  
}
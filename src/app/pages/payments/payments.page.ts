import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {
  user = {} as User;
  date:string="01/01";
  name:string="Name on card"
  card1:string="XXXX"
  card2:string="XXXX"
  card3:string="XXXX"
  card4:string="0000"
  card:string="";

  // maxLength: number = 3;

// this.card1=this.card.substring(0,3);
objectA={
  name:''}
  number;
  public paymentsForm: FormGroup;
  constructor(private fb: FormBuilder,private route:ActivatedRoute) { 
    
    this.paymentsForm = fb.group({
       
      name: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30), Validators.required])],
      number: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(3), Validators.required])],
      date: ['', Validators.required],
      card: ['', Validators.compose([Validators.minLength(16), Validators.maxLength(16), Validators.required])],
      card1: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(4), Validators.required])],
      card2: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(4), Validators.required])],
      card3: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(4), Validators.required])],
      card4: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(4), Validators.required])],
      

    },
    );
   

  }

  ngOnInit() {
    this.date;
    this.name;
    this.card;

    
  }

  pattern(card: string){
    if(card.length == 16){
      console.log("done");
      this.card1 = card.substring(0,4);
      this.card2 = card.substring(4,8);
      this.card3 = card.substring(8,12);
      this.card4 = card.substring(12,16);
    }
  }

}

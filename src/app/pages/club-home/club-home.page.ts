import { Component, OnInit } from '@angular/core';
import { RunningService } from 'src/app/services/running.service';

@Component({
  selector: 'app-club-home',
  templateUrl: './club-home.page.html',
  styleUrls: ['./club-home.page.scss'],
})
export class ClubHomePage implements OnInit {
club=[]
saved=false;
events=[]
hasAEvent=false
  constructor(public runn: RunningService) { 
    this.club=[] 
    this.events=[]
    this. getdata()
    
  }

  ngOnInit() {
  }

  getdata()
  {
    this.club=[]  
    return new Promise((resolve, reject) => {
      this.club=[]  
      this.runn.rtAClubs().then(data =>{
     
        console.log( data.length);
        
         console.log(data[0].myclubs[0].myclubs.clubKey,"flower child")
         
        this.club.push({ 
          clubKey: data[0].myclubs[0].myclubs.clubKey,
          name: data[0].myclubs[0].myclubs.name,
          address: data[0].myclubs[0].myclubs.address,
          openingHours: data[0].myclubs[0].myclubs.openingHours,
          closingHours:  data[0].myclubs[0].myclubs.closingHours,
          userID:  data[0].myclubs[0].myclubs.userID,
          photoURL:data[0].myclubs[0].myclubs.photoURL})
          
    
        
      console.log(this.club,"LAST ONE ts")

     
     })
    
    })
  
  }

    getAClubsEvents(myclub) {
      //  this.runn.getAClubsEvents(myclub) 
       this.getEES()
      
  }
  getEES()
  {
   
    this.events= []; 
  


    return new Promise((resolve, reject) => {
      this.runn.rtClubEvents().then(data =>{
     
        console.log( data.length);
        for( let x = 0; x < data.length; x++ )
        {
         console.log(x);
         
        this.events.push({ 
          eventKey:  data[x].eventKey,
          name:  data[x].name,
          address:  data[x].address,
          date: data[x].date,
          openingHours:  data[x].openingHours,
          closingHours:data[x].closingHours,
          price:data[x].price,
          photoURL:data[x].photoURL,
          clubKey:data[x].clubKey
        
        })
         
        }
        if(this.events.length!=0 && this.events!=null)
        {
          this.hasAEvent=true;
          this.saved=true;
        }
 
      console.log(this.events,"LAST ONE")

     })
    
    })

  }
  booking(myevents){
    this.runn.booking(myevents)
   }
  clearEvents()
  {

    this.events=[]
    this.saved=false;
  }
}

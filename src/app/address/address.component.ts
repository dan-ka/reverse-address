import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppService } from '../service/app.service';
import 'rxjs/operators';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  providers: [AppService]
})
export class AddressComponent implements OnInit {
  pickUp: FormControl = new FormControl();
  dropOff: FormControl = new FormControl();
  pickUpAddress: any;
  dropOffAddress: any;
  pickUpResult: any[] = [];
  dropOffResult: any[] = [];
  pricingResult: any[] = [];


  constructor(private service: AppService) {
    this.pickUp.valueChanges
      .subscribe(data => {
        this.pickUpResult = [];
        this.service.openstreet_search(data).subscribe(response => {
          response.map(a => {
            this.pickUpResult.push(a);
          });
        });
      });

    this.dropOff.valueChanges
      .subscribe(data => {
        this.dropOffResult = [];
        this.service.openstreet_search(data).subscribe(response => {
          response.map(a => {
            this.dropOffResult.push(a);
          });
        });
      });

  }

  setAddress(data, index) {
    if (index === 1) {
      this.pickUpAddress = data;
      this.pickUp.setValue(data.display_name);
    } else {
      this.dropOffAddress = data;
      this.dropOff.setValue(data.display_name);
    }
  }

  getPrice(e) {
    this.pricingResult = [];
    const data = { Pickup: {
      Address1: this.pickUpAddress.address.aerodrome,
      Address2: this.pickUpAddress.address.road, City: '',
      Lat: this.pickUpAddress.lat, Lon: this.pickUpAddress.lon, Postcode: this.pickUpAddress.address.postcode, PoiType: 1},
      Destination: {
        Address1: this.dropOffAddress.address.aerodrome,
        Address2: this.dropOffAddress.address.road, City: '',
        Lat: this.dropOffAddress.lat, Lon: this.dropOffAddress.lon, Postcode: this.dropOffAddress.address.postcode, PoiType: 1},
        Rta: 1563872400, VhcTypeId: 1, ChildSeats: ''
    };
    this.service.kabbee_price(data).subscribe(response => {
      this.pricingResult = response.Result.Quotes;
    });
  }

  ngOnInit() {
  }

}

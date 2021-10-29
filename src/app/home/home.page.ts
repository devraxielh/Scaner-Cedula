import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage{
  idString: string;
  idNumber: string;
  lastName1: string;
  lastName2: string;
  firstName1: string;
  middleName: string;
  gender: string;
  birthDate: string;
  bloodType: string;
  estado_cedula_img: boolean;
  estado_cedula_card: boolean;


  constructor(public barcodeScanner: BarcodeScanner) {
    this.estado_cedula_img = true;
    this.estado_cedula_card = false;
  }

  scanBarcodeScanner() {
    this.barcodeScanner.scan({ formats:"PDF_417,RSS_EXPANDED",orientation : "landscape",disableSuccessBeep: true, showTorchButton: true, prompt: "Acerca la parte de atras de la cedula dentro del area" }).then(barcodeData => {
      this.estado_cedula_img = false;
      this.estado_cedula_card = true;
      const dataArray = barcodeData.text.replace(/[^A-Za-z0-9+]+/g, ' ').split(' ');
      if (dataArray[1]=='PubDSK'){
        if (/[A-Z]/g.test(dataArray[3])) {
          this.idString = dataArray[3].replace(/[A-Z]/g, '');
          this.idNumber = this.idString.substring(10, this.idString.length);
          this.lastName1 = dataArray[3].replace(/[0-9]/g, '');
        } else {
          this.idNumber = dataArray[4].replace(/[A-Z]/g, '');
          this.lastName1 = dataArray[4].replace(/[0-9]/g, '');
        }
        this.lastName2 = dataArray[5].replace(/\W/g, '');
        this.firstName1 = dataArray[6].replace(/\W/g, '');
        if (!(/[0-9]/g.test(dataArray[7]))) {
          this.middleName = dataArray[7];
        }
        const extraData = dataArray[this.middleName ? 8 : 7];
        this.gender = extraData.includes('M') ? 'Hombre' : 'Mujer';
        const fecha =  extraData.substr(2, 10);
        this.birthDate = fecha.slice(0,4)+'/'+fecha.slice(4,6)+'/'+fecha.slice(6,8)
        this.bloodType = extraData.substr(-2);
      }else{
        const f_cedula = dataArray[2].replace(/[A-Z]/g, '');
        this.idNumber = f_cedula.substr(f_cedula.length-8);
        this.lastName1 = (dataArray[2].replace(/[0-9]/g, ''));
        this.lastName2 = (dataArray[3]);
        this.firstName1 = (dataArray[4]);
        const f_sangre = dataArray[5];
        this.bloodType = f_sangre.substr(f_sangre.length-2);
        if (dataArray[5].replace(/[0-9]/g, '')[0]=='M'){
          this.gender = 'Hombre';
        }else{
          this.gender = 'Mujer';
        }
        this.birthDate = dataArray[5].replace(/[A-Z]/g, '').slice(1,5)+'/'+dataArray[5].replace(/[A-Z]/g, '').slice(5,7)+'/'+dataArray[5].replace(/[A-Z]/g, '').slice(7,9);
      }
    }).catch(err => {
      console.log('Error', err);
    });
  }
}
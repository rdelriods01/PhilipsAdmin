import { Component } from '@angular/core';

import { ConfigService } from '../services/config.service';

// import { ICliente } from '../models/interfaces';

@Component({
   selector: 'config',
   templateUrl: '../views/config.html',
   styleUrls: ['../css/config.css']
})
export class ConfigComponent{

    tiposDeEquipos;
    arrayTipos;
    miTipo;
    modelos:any[]=[];
    newTipo;
    newModelo;


    constructor(public conf:ConfigService){
        this.leerConfig();
    }

    leerConfig(){
        this.conf.getConfig().subscribe(res=>{
            this.arrayTipos=res[0];
            let tipos=Object.keys(res[0]);
            this.tiposDeEquipos=tipos;
        })
    }

    addTipo(){
        this.conf.saveTipo( {[this.newTipo]:[]} );
        this.leerConfig();
        this.newTipo='';
    }
    sendTipo(t){
        this.miTipo=t; 
        this.modelos=this.arrayTipos[t];
        console.log(this.modelos);
    }

    addModelo(){
        console.log(this.newModelo);
        
        this.modelos=this.arrayTipos[this.miTipo];
        this.modelos.push(this.newModelo);
        console.log(this.modelos);
        console.log(this.miTipo);
        
        this.conf.saveTipo( {[this.miTipo]:this.modelos} );
        this.leerConfig();
        this.newModelo='';
    }


    sendModelo(m){
        console.log(m);
    }


}

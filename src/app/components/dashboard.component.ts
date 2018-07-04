import { Component } from '@angular/core';

import { ClienteService } from '../services/cliente.service';
import { EquipoService } from '../services/equipo.service';
import { SWOService } from '../services/swo.service';

import { IEquipo, ICliente } from '../models/interfaces'

@Component({
  selector: 'dashboardC',
  templateUrl: '../views/dashboard.html',
  styleUrls: ['../css/dashboard.css']
})
export class DashboardComponent {
  
  arrToday:any[]=[];
  arrTomorrow:any[]=[];
  arrPendientes:any[]=[];

  constructor(  public _swoService: SWOService,
                public _equipoService:EquipoService,
                public _clienteService:ClienteService )
  {  
    this._swoService.getSWOs().subscribe(el=>{
      let hoy = this.getHoy();
      let mañana = this.getMañana();
      this.arrToday=[]
      this.arrTomorrow=[];
      this.arrPendientes=[];
      el.forEach(sx=>{
        let f1= sx.fechainicio.toLocaleDateString();
        let f2:any[]=[];
        f2=f1.split("/");
        //f2[0] dia , f2[1] mes , f2[2] año
        if(f2[0]<10){ f2[0]=('0'+f2[0]) }
        if(f2[1]<10){ f2[1]=('0'+f2[1]) }
        let mifechadeswo = f2[2]+'-'+f2[1]+'-'+f2[0];
        // comparar cuales son de hoy y cuales de mañana
        if(mifechadeswo==hoy){ if(sx.status=='Programado' || sx.status=='Concluido'){this.arrToday.push(sx)}}
        if(mifechadeswo==mañana) { this.arrTomorrow.push(sx) }
        // Comparar cuales tienen status 'En espera de refacción o pendiente'
        if(sx.status=='En espera de refacción' || sx.status=='Pendiente'){ this.arrPendientes.push(sx)}
      })
      // Aqui ya tengo un array con las ordenes correspondientes, falta completar el cliente, modelo y serie
      this.arrToday=this.completarArray(this.arrToday);
      this.arrTomorrow=this.completarArray(this.arrTomorrow);
      this.arrPendientes=this.completarArray(this.arrPendientes);
    })
  }

  completarArray(arr){
    if(arr.length>0){
      arr.forEach(elem=>{
        this._equipoService.getUnEquipo(elem.equipo).subscribe(equi=>{
          elem.modelo=equi['modelo'];
          elem.serie=equi['serie'];
        })
        this._clienteService.getUnCliente(elem.cliente).subscribe(clien=>{
          elem.cliente=clien['nombre'];
        })
      }) 
    }
    return arr;
  }

  verSWO(x){
    console.log(x);
    
  }







  // Funciones Utiles
  getHoy(){
    let d = new Date();
    let miFecha:any[]=[];
    miFecha[0]=d.getFullYear();
    miFecha[1]=d.getMonth()+1;
    if(miFecha[1]<10){
        miFecha[1]=('0'+miFecha[1]);
    }
    miFecha[2]=d.getDate();
    if(miFecha[2]<10){
        miFecha[2]=('0'+miFecha[2]);
    }
    let hoy=miFecha[0]+'-'+miFecha[1]+'-'+miFecha[2];
    console.log(hoy);
    
    return hoy;
  }

  getMañana(){
    var d = new Date()
    d.setDate(d.getDate() + 1);
    let miFecha:any[]=[];
    miFecha[0]=d.getFullYear();
    miFecha[1]=d.getMonth()+1;
    if(miFecha[1]<10){
        miFecha[1]=('0'+miFecha[1]);
    }
    miFecha[2]=d.getDate();
    if(miFecha[2]<10){
        miFecha[2]=('0'+miFecha[2]);
    }
    let mañana=miFecha[0]+'-'+miFecha[1]+'-'+miFecha[2];
    console.log(mañana);
    return mañana;



  }
}
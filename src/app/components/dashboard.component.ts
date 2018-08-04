import { Component } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { ClienteService } from '../services/cliente.service';
import { EquipoService } from '../services/equipo.service';
import { SWOService } from '../services/swo.service';

@Component({
  selector: 'dashboardC',
  templateUrl: '../views/dashboard.html',
  styleUrls: ['../css/dashboard.css']
})
export class DashboardComponent {
  user;
  today;
  arrToday:any[]=[];
  arrTomorrow:any[]=[];
  arrPendientes:any[]=[];
  arrRecientes:any[]=[];

  constructor(  public _swoService: SWOService,
                public _equipoService:EquipoService,
                public _clienteService:ClienteService,
                public auth: AuthService
              )
  {  
    let hoy = new Date(this.getHoy());
    let mañana = new Date(this.getMañana());
    let antiAntier= new Date(this.get3dias());
    let hoyTS= hoy.getTime();
    let mañanaTS=mañana.getTime();
    let antiAntierTS=antiAntier.getTime();
    console.log(hoyTS);
    console.log(mañanaTS);
    console.log(antiAntier);
    console.log(antiAntierTS);
       

    this.today=hoy;    
    
    this.auth.user.subscribe(us=>{
      this.user=us
      // Si es FSE debe de leer solo sus SWO  
      if(us){
        if(this.user.role=='fse'){
          this._swoService.getSWOsFSE(this.user.displayName).subscribe(el=>{
            this.arrToday=[]
            this.arrTomorrow=[];
            this.arrPendientes=[];
            this.arrRecientes=[];
            el.forEach(sx=>{
              let fSWO=sx.fechaop.getTime();
              if(fSWO>=hoyTS){
                if(fSWO<mañanaTS){
                  if(sx.status=='Programado' || sx.status=='Concluido'){
                    this.arrToday.push(sx)
                    console.log('nuevo hoy');
                    
                  }else{
                    this.arrPendientes.push(sx)
                    console.log('nuevo pendiente');
                    
                  }
                }else{
                  this.arrTomorrow.push(sx);
                  console.log('nuevo tomorrow');
                }
              }else{
                if(sx.status!='Concluido'){
                  this.arrPendientes.push(sx);                 
                }else{
                  if(fSWO>=antiAntierTS){
                    this.arrRecientes.push(sx);
                  }
                }
                // sacar el TimeStamp de hace 3 dias
                // if(sx.status=='Concluido'){
                //   this.arrRecientes.push(sx);
                // }
              }
            })
            // Aqui ya tengo un array con las ordenes correspondientes, falta completar el cliente, modelo y serie
            this.arrToday=this.completarArray(this.arrToday);
            this.arrTomorrow=this.completarArray(this.arrTomorrow);
            this.arrPendientes=this.completarArray(this.arrPendientes);
            this.arrRecientes=this.completarArray(this.arrRecientes);
          });
        } else{
          // Si no es FSE, debe de leer todas las SWO
          this._swoService.getSWOs().subscribe(el=>{
            this.arrToday=[]
            this.arrTomorrow=[];
            this.arrPendientes=[];
            el.forEach(sx=>{
              let fSWO=sx.fechaop.getTime();
              if(fSWO>=hoyTS){
                if(fSWO<mañanaTS){
                  if(sx.status=='Programado' || sx.status=='Concluido'){
                    this.arrToday.push(sx)
                  }else{
                    this.arrPendientes.push(sx)
                  }
                }else{
                  this.arrTomorrow.push(sx);
                }
              }else{
                if(sx.status!='Concluido'){
                  this.arrPendientes.push(sx);
                }else{
                  if(fSWO>=antiAntierTS){
                    this.arrRecientes.push(sx);
                  }
                }
              }
            })
            // Aqui ya tengo un array con las ordenes correspondientes, falta completar el cliente, modelo y serie
            this.arrToday=this.completarArray(this.arrToday);
            this.arrTomorrow=this.completarArray(this.arrTomorrow);
            this.arrPendientes=this.completarArray(this.arrPendientes);
            this.arrRecientes=this.completarArray(this.arrRecientes);
          });
        }
      }
    });
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

  // Funciones Utiles
  getHoy(){
    let d = new Date();   
    let miFecha:any[]=[];
    miFecha[0]=d.getFullYear();
    miFecha[1]=d.getMonth()+1;
    miFecha[2]=d.getDate();
    let hoy=miFecha[0]+'-'+miFecha[1]+'-'+miFecha[2];   
    return hoy;
  }

  getMañana(){
    var d = new Date()
    d.setDate(d.getDate() + 1);
    let miFecha:any[]=[];
    miFecha[0]=d.getFullYear();
    miFecha[1]=d.getMonth()+1;
    miFecha[2]=d.getDate();
    let mañana=miFecha[0]+'-'+miFecha[1]+'-'+miFecha[2];
    return mañana;
  }
  get3dias(){
    var d=new Date();
    d.setDate(d.getDate() - 3);
    let miFecha:any[]=[];
    miFecha[0]=d.getFullYear();
    miFecha[1]=d.getMonth()+1;
    miFecha[2]=d.getDate();
    let tresDias=miFecha[0]+'-'+miFecha[1]+'-'+miFecha[2];
    return tresDias;    
  }
}
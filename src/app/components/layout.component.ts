import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { EquipoService } from '../services/equipo.service';
import { SWOService } from '../services/swo.service';

import { MatDialog } from '@angular/material';

@Component({
  selector: 'layoutC',
  templateUrl: '../views/layout.html',
  styleUrls: ['../css/layout.css']
})
export class LayoutComponent {

// Variables para el buscador 
  visible:Boolean=false;
  showBtn: string ='ocultarB';
  showRes: string ='hideResultado';
  showItm: string ='hideResItem';
  buscado = "";
  filteredList:any;
  arrayFinder;

  // User temporal
  userio;

  constructor(public auth: AuthService, 
              public router: Router,
              public dialog: MatDialog,
            public _equipoServvice: EquipoService,
            public _swoService: SWOService,
            ) 
  {
    this.userio=new Object();
    this.userio={displayName:"Ricardo Del Rio"};
    this.prepareFinder();
  
  }

  prepareFinder(){
    this._equipoServvice.getEquipos().subscribe(eq=>{
      let todosEquipos=eq;
      todosEquipos.forEach(el=>{
        delete el.accesoriode;
        delete el.cliente;
        delete el.marca;
        delete el.modelo;
        delete el.sw;
        delete el.tipo;
        delete el.ubicacion;
      });
      this._swoService.getSWOs().subscribe(sw=>{
        let todasSwos=sw;
        todasSwos.forEach(el=>{
          delete el.actividad;
          delete el.cliente;
          delete el.falla;
          delete el.fechafin;
          delete el.fechainicio;
          delete el.equipo;
          delete el.status;
        });
        this.arrayFinder =[];
        for(let i = 0; i<todosEquipos.length;i++){
          this.arrayFinder.push({id: todosEquipos[i].id, data: todosEquipos[i].serie, tipo:'equipo' });
        }
        for (let i=0;i<todasSwos.length;i++){
          this.arrayFinder.push({id:todasSwos[i].id, data: todasSwos[i].swo, tipo:'swo'});
        }
        console.log(this.arrayFinder);
      })
    })
  }

  // Funciones para la vista del buscador
  toggleBuscar(inputSearch){

    this.visible = !this.visible;
    this.showBtn = this.visible ? 'mostrarB' : 'ocultarB ';
    if(this.visible){inputSearch.focus()}
  }
  showResBus(){
    this.showRes='showResultado';
    this.showItm='showResItem';
  }
  hideResBus(tipo){
    this.showRes='hideResultado';
    this.showItm='hideResItem';
    this.showBtn='ocultarB';
    this.visible=false;
    this.buscado="";
  }
// Funciones para buscar en el buscador
  filter(){
     this.filteredList=this.filterByProperty(this.arrayFinder ,"data",this.buscado.toLowerCase());
    }
  filterByProperty(array, prop, value){
      var filtered = [];
      for(var i = 0; i < array.length; i++){
          var obj = array[i];
          if(obj[prop].toLowerCase().indexOf(value)>=0){
                    filtered.push(obj);
          }
      }   
      return filtered;
  }

  newPaciente(){
    console.log('Aun no hace nada el boton pero jala chido jjjj');
  }
}

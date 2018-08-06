import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { EquipoService } from '../services/equipo.service';
import { ClienteService } from '../services/cliente.service';

import { SWOService } from '../services/swo.service';

import { MatDialog } from '@angular/material';

@Component({
  selector: 'layoutC',
  templateUrl: '../views/layout.html',
  styleUrls: ['../css/layout.css']
})
export class LayoutComponent {

  showSideNav:Boolean=true;
// Variables para el buscador 
  visible:Boolean=false;
  showBtn: string ='ocultarB';
  showRes: string ='hideResultado';
  showItm: string ='hideResItem';
  buscado = "";
  filteredList:any;
  arrayFinder;

  equipos;
  clientes;

  user;
  constructor(public auth: AuthService, 
              public router: Router,
              public dialog: MatDialog,
            public _equipoService: EquipoService,
            public _swoService: SWOService,
            public _clienteService: ClienteService
            ) 
  {
    if(window.innerWidth<769){
      this.showSideNav=false;
    }
    this.auth.user.subscribe(us=>{
      this.user=us;
      // console.log(this.user);
    })
    this.prepareFinder();
  }

  prepareFinder(){
    this._equipoService.getEquipos().subscribe(eq=>{
      this.equipos=JSON.parse(JSON.stringify(eq));
      let todosEquipos=eq;
      todosEquipos.forEach(el=>{
        delete el.accesorios;
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
        this._clienteService.getClientes().subscribe(cl=>{
          this.clientes=cl;
          let todosClientes=cl;
          todosClientes.forEach(el=>{
            delete el.direccion;
            delete el.ciudad;
            delete el.estado;
            delete el.zona;
            delete el.tipo;
            delete el.departamento;
            delete el.telefono;
            delete el.correo;
            delete el.contacto;
          });
          this.arrayFinder =[];
          for(let i = 0; i<todosEquipos.length;i++){
            this.arrayFinder.push({id: todosEquipos[i].id, data: todosEquipos[i].serie, tipo:'equipo' });
          }
          for (let i=0;i<todasSwos.length;i++){
            this.arrayFinder.push({id:todasSwos[i].id, data: todasSwos[i].swo, tipo:'swo'});
          }
          for (let i=0;i<todosClientes.length;i++){
            this.arrayFinder.push({id:todosClientes[i].id, data: todosClientes[i].nombre, tipo:'cliente'});
          }
          // console.log(this.arrayFinder);
        })
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
  hideResBus(){
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

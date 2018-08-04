import { Component} from '@angular/core';
import { FormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';

import { AuthService } from '../services/auth.service';
import { SWOService } from '../services/swo.service';
import { ClienteService } from '../services/cliente.service';
import { EquipoService } from '../services/equipo.service';

import { IOperacion } from '../models/interfaces';

import { NewOPComponent } from '../components/newOP.component';

@Component({
   selector: 'SwoC',
   templateUrl: '../views/swo.html',
   styleUrls: ['../css/swo.css']
})
export class SwoComponent{
    user;

    swo;
    ops=[];
    cliente;
    equipo;
    
    showProceedDetails=false;
    showRefas=false;

    operando:Boolean;
    status:string='';
    statuses = ['Concluido','En espera de refacción', 'Pendiente'];
    resultados:string='';
    observaciones:string='';
    duracion:number;
    fechafin:Date;
    refas:any;

    // Variables para subirfoto
    uploadPercent:Observable<number>;
    showProgressBar=false;

    constructor(public _route:ActivatedRoute, 
                public _equipoService:EquipoService,
                public _clienteService:ClienteService,
                public _swoService:SWOService,
                public dialog: MatDialog,
                public auth: AuthService,
                public storage: AngularFireStorage ){
        this.auth.user.subscribe(us=>{this.user=us});
        this._route.params.forEach((params:Params)=>{
            let id = params['id'];
            this._swoService.getUnaSWO(id).subscribe(sw =>{
                this.swo=sw;
                console.log(this.swo);
                this._clienteService.getUnCliente(this.swo.cliente).subscribe(cl=>{
                    this.cliente=cl;
                    console.log(this.cliente);
                    this._equipoService.getUnEquipo(this.swo.equipo).subscribe(eq=>{
                        this.equipo=eq;
                        console.log(this.equipo);
                        this._swoService.getOPs(id).subscribe(ops=>{
                            this.ops=ops;
                            console.log(this.ops);
                            this.uploadPercent=Observable.of(0)
                        })
                        // this.datosTablaSWOs(this.swos);
                    })
                })
            }) 
        })
        this.fechafin= new Date();
        this.refas={refa1:['','',''],
                    refa2:['','',''],
                    refa3:['','',''],
                    refa4:['','',''],
                    refa5:['','',''],
                    refa6:['','',''],
                    refa7:['','',''],
                    refa8:['','',''],
                    refa9:['','','']};
    }

    proceed(){
        if(this.swo.actividad=='PMAI'){
            this.operando=true;
            this.status='Concluido';
            this.resultados='Se revisa equipo. Se realiza seguimiento de checklist anexo. Se comprueba funcionamiento general del equipo según especificaciones técnicas del fabricante. Se realiza limpieza externa e interna.';
            this.observaciones='El equipo queda operando Correctamente';
            this.duracion=1;            
        }
        console.log(this.refas);
        
    }

    saveProceed(oper){
        this.swo.status=this.status;
        if(this.status=='Concluido'){
            this.swo.fechafin=new Date();
        }
        oper.status='Concluido';
        oper.fechafin=new Date();
        oper.operando=this.operando;
        oper.resultados=this.resultados;
        oper.observaciones=this.observaciones;
        oper.duracion=this.duracion;
        oper.refacciones=this.refas;
        this._swoService.updateOP(this.swo,oper);
        console.log(oper);
    }

    nuevaOP(){
        console.log('Nueva OP!!');
        console.log(this.swo);
        let newOP = {} as IOperacion;
        newOP.op= String(Number(this.ops[this.ops.length-1].op) + 10 );
        newOP.status='Programado';
        console.log(newOP);
        let dialogNewSwo= this.dialog.open(NewOPComponent);
        dialogNewSwo.componentInstance.oper=newOP;
        dialogNewSwo.componentInstance.swo=this.swo;
        // this._swoService.saveOP(this.swo,)
    }

    print(){
        window.print();
    }


    subirFoto(event,op){
        console.log(op);
        this.showProgressBar=true;
        const file = event.target.files[0];
        const filePath = this.swo.swo + '-' + op.op;
        const task = this.storage.upload(filePath,file);
        // observe percentage changes
        this.uploadPercent = task.percentageChanges();
        // download url
        task.downloadURL().subscribe(url=>{
            console.log(url);
            op.fotoSwoURL=url;
            this._swoService.updateOP(this.swo,op);
            this.showProgressBar=false;
        })
    }
    verFoto(url){
        window.open(url);
    }
}

export interface ICliente {
    id?: string;
    nombre: string;
    direccion: string,
    ciudad: string, 
    estado: string,
    zona:string,
    tipo:string,
    departamento?:string,
    telefono?: string,
    correo?: string,
    contacto?: string,
 }

 export interface IEquipo{
    id?:string,
    serie: string,
    tipo: string,
    modelo: string,
    sw?: string,
    marca?: string,
    ubicacion: string,
    accesoriode?:string,
    cliente:string
}

export interface ISwo{
    id?:string,
    swo:string,
    fechainicio:Date,
    fechafin?:Date,
    cliente:string,
    equipo:string,
    status:string,
    falla:string,
    actividad:string;
}
export interface IOperacion{
    id?:string;
    op:string;
    actividad:string;
    fechaprog:Date;
    fechafin?:Date;
    horainicio?:string;
    horafin?:string;
    status:string;
    resultados?:string;
    observaciones?:string;
}
export interface ICliente {
    id?: string;
    nombre: string;
    direccion: string,
    ciudad: string, 
    estado: string,
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
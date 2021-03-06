export interface IUser {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  password?: string;
  role: string;
}

export interface ICliente {
  id?: string;
  nombre: string;
  direccion: string,
  ciudad: string,
  estado: string,
  zona: string,
  tipo: string,
  departamento?: string,
  telefono?: string,
  correo?: string,
  contacto?: string
}

export interface IEquipo {
  id?: string,
  serie: string,
  tipo: string,
  modelo: string,
  eqid?: string,
  sw?: string,
  marca?: string,
  ubicacion: string,
  moduloModelo?: string,
  moduloSerie?: string,
  cliente: string
  accesorios?: string
}

export interface ISwo {
  id?: string,
  swo: string,
  fechainicio: Date,
  fechaop: Date,
  fechafin?: Date,
  cliente: string,
  equipo: string,
  status: string,
  falla: string,
  actividad: string;
  fse: string;
}
export interface IOperacion {
  id?: string;
  op: string;
  swoid: string;
  actividad: string;
  fechaprog: any;
  fechafin?: any;
  horainicio?: string;
  horafin?: string;
  status: string;
  resultados?: string;
  observaciones?: string;
  operando?: Boolean;
  duracion?: number;
  fse: string;
  refacciones?: any;
  firmada?: Boolean;
  enviada?: Boolean;
  guia?: string;
  fechaenviada?: Date;
  recibida?: Boolean;
  recibio?: string;
  fecharecibida?: Date;
  fotoSwoUrl?: string;
}



// Si es FSE buscar en sus SWOs y OPS las que tienen firmadas == true y enviadas == false
// Si es Karina buscar de todas las SWOs y OPS las que tienen enviadas == true y recibidas == false

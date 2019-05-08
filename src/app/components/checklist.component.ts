import { Component, Input } from '@angular/core';

import { ISwo, ICliente, IEquipo, IOperacion } from '../models/interfaces';

@Component({
  selector: 'checklistC',
  templateUrl: '../views/checklist.html',
  styleUrls: ['../css/checklist.css']
})
export class ChecklistComponent {

  @Input() swo: ISwo;
  @Input() op: IOperacion;
  @Input() cliente: ICliente;
  @Input() equipo: IEquipo;

}

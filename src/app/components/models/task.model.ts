export enum TaskStatus{
    COMPLETED="C",
    IN_PROGRESS="IP",
    PENDING="P"
}

export enum TaskPriority{
    HIGH="H",
    MEDIUM="M",
    LOW="L"
}

export class Task {
    id:string;
    name:string;
    description:string;
    priority:string;
    status:string;
    creationDate:string;
    expirationDate:string;
    isDelete:boolean;

    constructor (id:string,name:string,description:string,priority:TaskPriority,status:TaskStatus,creationDate:string,expirationDate:string,isDelete:boolean){
        this.id = id;
        this.name = name;
        this.description=description;
        this.priority=priority;
        this.status = status;
        this.creationDate = creationDate;
        this.expirationDate =expirationDate;
        this.isDelete = isDelete;
    }



  getStatusText(): string {
    switch (this.status) {
      case TaskStatus.COMPLETED: return 'Completed';
      case TaskStatus.IN_PROGRESS: return 'In Progress';
      case TaskStatus.PENDING: return 'Pending';
      default: return 'Unknown';
    }
  }

  getPriorityText(): string {
    switch (this.priority) {
      case TaskPriority.HIGH: return 'Alta';
      case TaskPriority.MEDIUM: return 'Media';
      case TaskPriority.LOW: return 'Baja';
      default: return '';
    }
  }

  raisePriority(): void {
    if (this.priority === TaskPriority.HIGH) return; // Ya está en el nivel más alto
    this.priority =
      this.priority === TaskPriority.LOW
        ? TaskPriority.MEDIUM
        : TaskPriority.HIGH;
  }

  lowerPriority(): void {
    if (this.priority === TaskPriority.LOW) return; // Ya está en el nivel más bajo
    this.priority =
      this.priority === TaskPriority.HIGH
        ? TaskPriority.MEDIUM
        : TaskPriority.LOW;
  }

    changeStatus(){
        switch(this.status){
            case TaskStatus.COMPLETED: this.status=TaskStatus.IN_PROGRESS;break;
            case TaskStatus.IN_PROGRESS: this.status=TaskStatus.COMPLETED;break;
            case TaskStatus.PENDING: this.status=TaskStatus.IN_PROGRESS;break;

        }
    }


}

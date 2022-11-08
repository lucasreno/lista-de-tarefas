import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Task } from '../interface/task';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  novaTarefa: string;
  tarefas: Task[] = [];
  tarefasBackup: Task[] = [];

  constructor(private storage: Storage, private toast: ToastController) { }

  ngOnInit(){
    this.iniciarBanco();
  }

  async iniciarBanco(){
    await this.storage.create();
    this.tarefas = await this.storage.get("listaTarefas") ?? [];
  }

  async adicionarTarefa() {
    if (this.novaTarefa.trim().length > 0) {
      let task: Task = { nomeTarefa: this.novaTarefa, concluido: false };
      this.tarefas.push(task);
      this.novaTarefa = null;
      await this.storage.set("listaTarefas", this.tarefas);
    }
  }

  async atualizarStatus(indice){
    this.tarefas[indice].concluido = !this.tarefas[indice].concluido;
    await this.storage.set("listaTarefas", this.tarefas);
  }

  async apagarTarefa(indice){
    this.tarefasBackup = [...this.tarefas];
    this.desfazer(this.tarefas[indice]);
    this.tarefas.splice(indice,1);
    await this.storage.set("listaTarefas", this.tarefas);
  }

  async desfazer(tarefaExcluida){
    const t = await this.toast.create({
      message: 'Voce excluiu ' + tarefaExcluida,
      duration: 3000,
      color: 'dark',
      position: 'bottom',
      buttons:[{
        text: 'Desfazer',
        handler: async () => {
          this.tarefas = [...this.tarefasBackup];
          await this.storage.set("listaTarefas", this.tarefas);
        }
      }]
    });
    t.present();
  }
}

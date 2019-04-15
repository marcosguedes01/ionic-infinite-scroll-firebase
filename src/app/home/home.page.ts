import { Component, ViewChild } from '@angular/core';
import { FirebaseDatabaseService } from '../api/firebase-database.service';
import { Post } from '../models/post';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  dados:Array<Post>;

  constructor(private database: FirebaseDatabaseService){
    this.dados = new Array();
    this.loadDados(); // Carrega os dados iniciais
  }

  doInfinite(infiniteScroll) {
    let self = this;
    this.loadDados().then(function(){
      infiniteScroll.target.complete();
      
      if (self.database.isFinish){
        // Desabilita o scroll quando não existem mais dados a serem carregados.
        infiniteScroll.target.disabled = true;
      }
    });
  }

  // Obtém os dados do firebase e armazena num array.
  private loadDados = () => new Promise((resolve)=>{
    let self = this;
    this.database.getPosts().then(function(result:Array<Post>){
      result.forEach(post => {
        self.dados.push(post);
      });
      resolve();
    });
  });
}
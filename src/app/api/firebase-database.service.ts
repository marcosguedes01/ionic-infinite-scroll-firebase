import { Injectable } from '@angular/core';
import { initializeApp } from "firebase";
import { Post } from "../models/post";


@Injectable({
  providedIn: 'root'
})
export class FirebaseDatabaseService {


  private static firebase: firebase.app.App;  
  private lastKey:any;
  private readonly COUNT_LOAD = 3;
  
  public isFinish:boolean;
  
  constructor() { 
    this.initializeFirebase();
  }


  public getPosts = () => new Promise<Array<Post>>((resolve)=>{
    let self = this;

    // Seleciona os posts ordenando pelo Id (você pode preferir ordenar pela data de postagem, por exemplo)
    var postsRef = FirebaseDatabaseService.firebase.database()
      .ref('posts').orderByChild("id");
    
     if (self.lastKey){
       // Dado que estamos considerando a exibição dos itens mais recente primeiro,
       // utilizamos a função "endAt". Caso deseje exibir os dados do mais antigo
       // para o mais recente, basta mudar para "startAt"
       postsRef = postsRef.endAt(self.lastKey);
    }


    postsRef = postsRef.limitToLast(self.COUNT_LOAD + 1)


    postsRef.on('value', function(snapshot) {  
      if (snapshot && snapshot.hasChildren)
      {
        let arrPost: Array<Post> = new Array();
        // Obtém a quantidade de registros filtrados
        let totalPosts = snapshot.numChildren();
        // Define a quantidade total de itens que devem ser incluídos no array de retorno.
        let totalToArray = Math.min(totalPosts, self.COUNT_LOAD)
                
        snapshot.forEach(function(childSnapshot) {
          let childData = childSnapshot.val() as Post; // Converte os dados para um tipo Post
          // obtém a chave de identificação do registro (não está sendo utilizada neste código).
          let key = childSnapshot.key;
                   
          childData.id = childData.id;
          childData.titulo = childData.titulo;
          childData.descricao = childData.descricao;
  
          // Adiciona os dados mais recentes primeiro.
          // Caso deseja exibir os mais antigos primeiro, deve-se alterar "unshift" para "push"
          arrPost.unshift(childData);
        });


        // Regra para obter a próxima chave a partir da qual o filtro ocorrerá
        self.lastKey = arrPost[arrPost.length-1].id;
        arrPost = arrPost.slice(0, totalToArray);


        // Regra para desabilitar o infinite scroll
        self.isFinish = (self.lastKey == arrPost[arrPost.length-1].id)        


        resolve(arrPost);
      }
    });
  });


  private initializeFirebase()
  {
      if (FirebaseDatabaseService.firebase != null) return;


      let config = {
        apiKey: "<API_KEY>",
        authDomain: "<PROJECT_ID>.firebaseapp.com",
        databaseURL: "https://<DATABASE_NAME>.firebaseio.com"
      };
      
      FirebaseDatabaseService.firebase = initializeApp(config);
  }
}
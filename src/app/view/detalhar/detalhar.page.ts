import { FirebaseService } from './../../model/service/firebase.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Computadores } from 'src/app/entity/Computadores';

@Component({
  selector: 'app-detalhar',
  templateUrl: './detalhar.page.html',
  styleUrls: ['./detalhar.page.scss'],
})
export class DetalharPage implements OnInit {
  public categoria! : string
  public processador! : string
  public placaVideo! : string
  public memoriaRam!: string
  public armazenamento! : number
  public imagem!: any
  public computadores!: Computadores
  public edicao: Boolean = true




  constructor(private firebase : FirebaseService,
    private alertController: AlertController,
    private router: Router) {}

  ngOnInit() {

    this.computadores = history.state.Computadores
      this.categoria = this.computadores.categoria
      this.processador = this.computadores.processador
      this.placaVideo = this.computadores.placaVideo
      this.memoriaRam = this.computadores.memoriaRam
      this.armazenamento = this.computadores.armazenamento
  }

  habilitar(){
    if(this.edicao){
      this.edicao = false
    }else{
      this.edicao = true
    }
  }

  uploadFile(imagem: any){
    this.imagem = imagem.files
  }

  editar(){
    if(this.categoria && this.processador){
      let novo: Computadores = new Computadores(this.categoria, this.processador)
      novo.categoria = this.categoria
      novo.processador = this.processador

      novo.id = this.computadores.id
      if(this.imagem){
        this.firebase.uploadImage(this.imagem, novo)
        ?.then(() => {this.router.navigate(["/home"])})
      }else{
        novo.downloadURL = this.computadores.downloadURL
        this.firebase.editar(novo, this.computadores.id)
        .then(() => {this.router.navigate(["/home"])})
        .catch((error) => {
          console.log(error)
          this.presentAlert("Error","Error ao Atualizar Contato")
        })
      }
    }

  }
  excluir(){
    this.presentConfirmAlert("ATENÇÃO", "Dejesa excluir o cadastro")
  }

  excluirComputador(){
    this.firebase.excluir(this.computadores.id)
    .then(() => {this.router.navigate(["/home"])})
    .catch((error) => {
      console.log(error)
      this.presentAlert("Error", "erro ao excluir o computador")

    })
  }

  async presentAlert(subHeader: string, message : string){
    const alert = await this.alertController.create({
      header: 'cadastro de Computadores',
      subHeader : subHeader,
      message: message,
      buttons: ["OK"]
    })
  }
  async presentConfirmAlert(subHeader: string, message : string ){
    const alert = await this.alertController.create({
      header : "Cadastro de Computadores",
      subHeader : subHeader,
      message : message,
      buttons : [
        { text : 'Cancelar' , role : 'cancelar' , handler : ()=> {console.log("Cancelou")} },
        { text : 'Confirmar', role : 'confimar' , handler : (acao) => {this.excluirComputador()}  }
      ]
    })
    await alert.present()
  }

}

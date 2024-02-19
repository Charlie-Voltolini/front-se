import { Component } from '@angular/core';
import { serviceBackend } from './service-backend';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent {
  numConsumidores: number = 1;
  nomesConsumidores: { nome: string }[] = [{ nome: 'Consumidor 1' }];
  itens: any[] = []; // Inicialmente vazio
  compradoresDisponiveis: string[] = ['Consumidor 01'];
  taxaEntrega: number = 0;
  desconto: number = 0;
  customerList: any[] = [];

  adicionarNomesConsumidores() {
    this.nomesConsumidores = [];
    this.compradoresDisponiveis = [];
    for (let i = 0; i < this.numConsumidores; i++) {
      const nomeConsumidor = `Consumidor ${i + 1 < 10 ? '0' : ''}${i + 1}`;
      this.nomesConsumidores.push({ nome: nomeConsumidor });
      this.compradoresDisponiveis.push(nomeConsumidor);
    }
  }

  adicionarItem() {
    this.itens.push({
      item: '',
      quantidade: '',
      comprador: this.nomesConsumidores.map(consumidor => consumidor.nome).join(', ')
    });
  }

  enviar() {
    // Lógica para enviar os dados do formulário
  }

  calcularTotalItem(item: any): number {
    const valorItem = this.obterValorItem(item.item);
    const quantidade = item.quantidade ? parseInt(item.quantidade) : 0;
    return valorItem * quantidade;
  }

  limpar() {
    this.numConsumidores = 1;
    this.adicionarNomesConsumidores();
    this.itens = [];
  }

  atualizarNomesConsumidores() {
    this.adicionarNomesConsumidores();
  }

  obterValorItem(item: string): number {
    switch (item) {
      case 'item1':
        return 40;
      case 'item2':
        return 2;
      case 'item3':
        return 8;
      default:
        return 0;
    }
  }
  calcularTotalCompra(): number {
    let totalCompra = 0;
    for (const item of this.itens) {
      totalCompra += this.calcularTotalItem(item);
    }
    return totalCompra;
  }

  constructor(private service: serviceBackend) { }

  enviarDadosParaBackend() {
    const dados = { /* Aqui você coloca os dados que deseja enviar para o backend */ };
    this.service.enviarDadosParaBackend(dados).subscribe(response => {
      console.log('Resposta do backend:', response);
    });
  }

  gerarJson() {
    const json = {
      customerList: [],
      discount: 0,
      deliveryFee: 0
    };

    for (let i = 0; i < this.numConsumidores; i++) {
      const customer = {
        name: this.nomesConsumidores[i]?.nome || `Consumidor ${i + 1}`,
        itemList: [],
        percentage: "0",
        totalPayable: "0"
      };
      for (const item of this.itens) {
        if (item.comprador === this.nomesConsumidores[i]?.nome) {
          customer.itemList.push({
            name: item.item,
            value: (item.quantidade * 10).toFixed(1)
          });
        }
      }
      json.customerList.push(customer);
    }

    json.discount = this.desconto;
    json.deliveryFee = this.taxaEntrega;

    console.log('JSON gerado:', json);
  }
}

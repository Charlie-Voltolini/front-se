import { Component, OnInit } from '@angular/core';
import { serviceBackend } from './service-backend';
import { Comprador } from './Comprador';


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
  resultados: any[] = [];
  comprador: any[] = [];

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
    const dados = this.estruturarJSON();
    console.log(dados);
    this.service.enviarDadosParaBackend(dados).subscribe(response => {
      console.log('Resposta do backend:', response);

      if (response && response.customerEntityList && Array.isArray(response.customerEntityList)) {
        this.resultados = response.customerEntityList.map((customerEntity: any) => ({
          quantidadeCompradores: response.customerEntityList.length,
          totalCompra: response.totalPurchase,
          desconto: response.discount,
          taxaEntrega: response.deliveryFee,
          totalFinal: response.finalValue,
          compradores: [
            {
              numero: 1,
              itens: customerEntity.itemList.map((item: any) => item.name).join(', '),
              total: customerEntity.totalPayable,
              porcentagem: customerEntity.percentage
            }
          ]
        }));
      } else {
        console.error("Erro ao buscar dados no backend.");
      }

    });
  }

  estruturarJSON(): any {
    const customerList = [];
    for (const item of this.itens) {
      const customer = {
        name: item.comprador,
        itemList: [
          {
            name: item.item,
            value: this.calcularTotalItem(item).toFixed(2)
          }
        ],
        percentage: '0',
        totalPayable: '0'
      };
      customerList.push(customer);
    }
    const json = {
      customerList: customerList,
      discount: this.desconto.toString(),
      deliveryFee: this.taxaEntrega.toString()
    };
    return json;
  }

}

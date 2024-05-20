import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, FlatList } from 'react-native';
import React, { useState } from 'react';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

export default function App() {
  let [name, setName] = useState("");
  const [materiais, setMateriais] = useState([]);
  const [nome, setNome] = useState('');
  const [serial, setSerial] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const Separator = () => <View style={styles.separator} />;

  const adicionarMaterial = () => {
    if (nome && serial || serial == "" && quantidade) {
      setMateriais([...materiais, { id: Date.now().toString(), nome, serial, quantidade }]);
      setNome('');
      setSerial('');
      setQuantidade('');
    }
  };

  const limparLista = () => {
    setMateriais([])
  }

  const html = `
    <html>
    <head>
      <style>
          table {
              width: 100%;
              border-collapse: collapse;
          }
          th, td {
              padding: 8px;
              text-align: left;
              border-bottom: 1px solid #ddd;
          }
          th:nth-child(1), td:nth-child(1) {
              width: 50%;
          }
          th:nth-child(2), td:nth-child(2), th:nth-child(3), td:nth-child(3) {
              width: 25%;
          }
        </style>
      </head>
      <body>
        <h1>Eu, ${name}, confirmo a retirada dos materiais abaixo!</h1>
        <table>
        <thead>
            <tr>
                <th>Material</th>
                <th>Serial</th>
                <th>Quantidade</th>
            </tr>
        </thead>
        <tbody>
        ${materiais.map(item => `
        <tr key="${item.id}">
          <td>${item.nome}</td>
          <td>${item.serial}</td>
          <td>${item.quantidade}</td>
        </tr>
      `).join('')}
        </tbody>
    </table>
      </body>
    </html>
  `;

  let generatePdf = async () => {
    const file = await printToFileAsync({
      html: html,
      base64: false
    });

    await shareAsync(file.uri);
  };

  return (
    <View style={styles.container}>
      <TextInput value={name} placeholder="Nome do Colaborador" style={styles.textInput} onChangeText={(value) => setName(value)} />
      <View style={styles.entrada}>
        <TextInput
          placeholder="Nome do material"
          value={nome}
          onChangeText={setNome}
          style={styles.botaoentrada}
        />
        <TextInput
          style={styles.botaoentrada}
          placeholder="Serial"
          value={serial}
          onChangeText={setSerial}
        />
        <TextInput
          placeholder="Quantidade"
          value={quantidade}
          onChangeText={setQuantidade}
          style={styles.botaoentrada}
        />
      </View>
      <Separator />
     
      <Button title="Adicionar Material" onPress={adicionarMaterial} style={styles.botaoadd}/>

      <FlatList
        data={materiais}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>Nome: {item.nome}</Text>
            <Text>Serial: {item.serial}</Text>
            <Text>Quantidade: {item.quantidade}</Text>
          </View>
        )}
      />
      <View style={styles.botao}>
        <Button title='Limpar Itens' onPress={limparLista}/>
        <Button title="Gerar PDF" onPress={generatePdf} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  entrada: {
    width: "96%",
  },

  botaoentrada: {
    borderWidth: 1,
    padding: 4,
    marginTop: 3,
    borderRadius: 8,
  },

  botao: {
    padding: 10,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  textInput: {
    alignSelf: "stretch",
    borderWidth: 1,
    padding: 4,
    borderRadius: 8,
    margin: 8
  },

  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
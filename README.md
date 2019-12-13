# ZagadnieniaTransportowe

Program do liczenia zagadnień transportowych

Przykład użycia programu

```javascript
let table = [
  [1, 2, 3, 4, 60],
  [4, 3, 2, 0, 80],
  [0, 2, 2, 1, 100],
  [40, 60, 80, 60, 240]
];
const zagadnienie = new ZT(table);
zagadnienie.katPolnocnoZachodni();

while (!zagadnienie.optymalne) {
  zagadnienie.kolejnyKrok();
}
```

ten kod należy umieścić w pliku app.js lub wkleić w

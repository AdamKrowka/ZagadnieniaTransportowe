class ZTT {
  constructor(tabela) {
    this.Tabela = tabela;
    this.Rozwiazanie = [];
    this.Koszty = [];
    this.Popyt = [];
    this.Podaz = [];
    this.Optymalne = false;
    this.Cykl = [];
    this.cyklRoz = false;

    // Filling Kolumna/Podaż table with last column from this.table table
    // Uzupełnianie Tabeli Podaż ostatnią columną z tabeli wprowadzonej do programu
    for (let i = 0; i < this.Tabela.length - 1; i++) {
      this.Podaz.push(this.Tabela[i][this.Tabela[i].length - 1]);
    }

    // filling Wiersz/Popyt table with last row from this.table table
    // Uzupełnianie Tabeli Popyt ostatnim wierszem z tabeli wprowadzonej do programu
    for (let i = 0; i < this.Tabela[this.Tabela.length - 1].length - 1; i++) {
      this.Popyt.push(this.Tabela[this.Tabela.length - 1][i]);
    }

    // Uzupełnianie tabeli Kosztów
    for (let i = 0; i < this.Tabela.length - 1; i++) {
      let row = [];
      for (let j = 0; j < this.Tabela[i].length - 1; j++)
        row.push(this.Tabela[i][j]);
      this.Koszty.push(row);
    }
  }

  // 1. Metoda kąta północno-zachodniego

  katPolnocnoZachodni = () => {
    let wynik = this.Koszty.map(wiersz => wiersz.map(() => null));
    let podaz = this.Podaz.map(elem => elem);
    let popyt = this.Popyt.map(elem => elem);

    wynik.forEach((linia, x) =>
      linia.forEach((element, y) => {
        if (wynik[x][y] == null)
          if (podaz[x] != 0 && popyt[y] != 0) {
            let wartosc = podaz[x] > popyt[y] ? popyt[y] : podaz[x];
            wynik[x][y] = wartosc;
            podaz[x] -= wartosc;
            popyt[y] -= wartosc;
          }
        if (podaz[x] == 0 && popyt[y] == 0) {
          if (x < wynik.length - 1) wynik[x + 1][y] = 0;
          else if (y < wynik[x].lenght - 1) wynik[x][y + 1] = 0;
        }
      })
    );
    console.table(wynik);
    this.Rozwiazanie = wynik;
  };

  // 2. Metoda Potencjału dla bazowych

  bazowePotencjaly = () => {
    let Y = this.Podaz.map(() => null);
    let X = this.Popyt.map(() => null);

    Y[0] = 0;
    let flag = false;
    while (this.hasEmpty(Y) || this.hasEmpty(X)) {
      flag = false;
      for (let y = 0; y <= this.Rozwiazanie.length; y++) {
        for (let x = 0; x <= this.Rozwiazanie[y].length; x++) {
          if (this.Rozwiazanie[y][x] != null) {
            if (X[x] != null ? Y[y] == null : Y[y] != null) {
              if (X[x] == null) X[x] = this.Koszty[y][x] - Y[y];
              else if (Y[y] == null) Y[y] = this.Koszty[y][x] - X[x];
              flag = true;
              break;
            }
          }
        }
        if (flag) break;
      }
    }
    // console.log({ Y, X });
    return { Y, X };
  };

  // 3. Metoda Potencjału dla kratek nie bazowych
  nieBazowePotencjaly = () => {
    const { X, Y } = this.bazowePotencjaly();
    let potencjaly = this.Koszty.map(elem => elem.map(e => e));

    this.Rozwiazanie.forEach((wiersz, y) =>
      wiersz.forEach((elem, x) => {
        if (this.Rozwiazanie[y][x] == null) {
          potencjaly[y][x] = X[x] + Y[y];
        }
      })
    );
    return potencjaly;
  };

  // 3. Sprawdzenie optymalności netodą potencjałów
  czyOptymalne = () => {
    let jestDodatnie = false;
    let potencjaly = this.nieBazowePotencjaly();
    potencjaly.forEach((wiersz, y) =>
      wiersz.forEach((elem, x) => {
        potencjaly[y][x] = potencjaly[y][x] - this.Koszty[y][x];
        if (potencjaly[y][x] > 0) jestDodatnie = true;
      })
    );
    if (!jestDodatnie) {
      console.log("optymalne");
      this.Optymalne = true;
      return this.Rozwiazanie;
    } else {
      console.log("nie optymalne");
      this.najDodatnia(potencjaly);
      this.moveTValue();
      return this.Rozwiazanie;
    }
  };

  najDodatnia = potencjaly => {
    console.log("liczę największy dodatni potencjał");
    let maxVal = 0;
    let max = [];
    let newMax;
    let path = [];
    let start;
    potencjaly.forEach((wiersz, y) => {
      wiersz.forEach((elem, x) => {
        if (elem == maxVal) max.push({ y, x });
        else if (elem > maxVal) {
          max = [];
          maxVal = elem;
          max.push({ y, x });
        }
      });
    });
    if (max.length == 1) {
      console.log("element maxymalny to:", max[0]);
      start = max[0];
    } else {
      console.log("więcej niż jeden maxymalny");
      let minKoszt = max[0].koszt;
      newMax = max[0];
      max.forEach(e => {
        if (e.koszt < minKoszt) newMax = e;
      });
      start = newMax;
      console.log("Do cyklu wybieram element: ", newMax);
    }
    this.Rozwiazanie[start.y][start.x] = 0;
    this.Cykl = [];
    this.cyklRoz = false;
    for (let i = 0; i < this.Koszty[start.y].length; i++) {
      if (this.Rozwiazanie[start.y][i] != null && i != start.x && !this.cyklRoz)
        path = this.path(
          start,
          { y: start.y, x: i },
          this.Koszty.length + this.Koszty[start.y].length - 1,
          "col",
          start
        );
    }
    console.table(this.Rozwiazanie);
  };

  hasInRow = elem => {
    let flag = false;
    for (let x = 0; x < this.Rozwiazanie[elem.y].length; x++) {
      if (this.Rozwiazanie[elem.y][x] != null) {
        flag = true;
      }
    }
    return flag;
  };

  hasInCol = elem => {
    let flag = false;
    for (let y = 0; y < this.Rozwiazanie.length; y++) {
      if (this.Rozwiazanie[y][elem.x] != null) {
        flag = true;
      }
    }
    return flag;
  };

  path = (start, actual, depth, dir, prev) => {
    let path = [];
    if (actual.y == start.y && actual.x == start.x) {
      console.log("cykl zakończony");
      this.Cykl.push({
        x: actual.x,
        y: actual.y,
        value: this.Rozwiazanie[actual.y][actual.x]
      });
      this.cyklRoz = true;
      return [prev];
    }
    if (depth < 0) return null;
    else if (!this.cyklRoz) {
      if (dir == "col") {
        if (this.hasInCol(actual)) {
          for (let i = 0; i < this.Rozwiazanie.length; i++) {
            if (this.Rozwiazanie[i][actual.x] != null && i != actual.y)
              path.push(
                this.path(
                  start,
                  { y: i, x: actual.x },
                  depth - 1,
                  "row",
                  actual
                )
              );
          }
        }
      } else if (dir == "row") {
        if (this.hasInRow(actual)) {
          for (let i = 0; i < this.Rozwiazanie[actual.y].length; i++) {
            if (this.Rozwiazanie[actual.y][i] != null && i != actual.x)
              path.push(
                this.path(
                  start,
                  { y: actual.y, x: i },
                  depth - 1,
                  "col",
                  actual
                )
              );
          }
        }
      }
      if (this.cyklRoz) {
        this.Cykl.push({
          x: actual.x,
          y: actual.y,
          value: this.Rozwiazanie[actual.y][actual.x]
        });
      }
      return path;
    }
  };

  elementMinimalnyCyklu = () => {
    let min = { x: undefined, y: undefined, value: Infinity };
    for (let i = 0; i < this.Cykl.length; i++) {
      if (i % 2 == 1)
        min =
          min.value > this.Cykl[i].value
            ? {
                x: this.Cykl[i].x,
                y: this.Cykl[i].y,
                value: this.Cykl[i].value
              }
            : min;
    }
    return min;
  };

  moveTValue = () => {
    let min = this.elementMinimalnyCyklu();

    for (let i = 0; i < this.Cykl.length; i++) {
      if (i % 2 == 0)
        this.Rozwiazanie[this.Cykl[i].y][this.Cykl[i].x] += min.value;
      if (i % 2 == 1)
        this.Rozwiazanie[this.Cykl[i].y][this.Cykl[i].x] -= min.value;
    }
    this.Rozwiazanie[min.y][min.x] = null;
    console.table(this.Rozwiazanie);
  };

  hasEmpty = table => {
    for (let i = 0; i < table.length; i++) {
      if (table[i] == null) return true;
    }
    return false;
  };

  kolejnyKrok = next => {
    switch (next) {
      case 0:
        console.log("Optymalne");
        break;
      case 1:
        this.katPolnocnoZachodni();
      case 2:
        this.czyOptymalne();
      case 3:
        this.najDodatnia();
      case 4:

      case 5:

      default:
        break;
    }
  };
}

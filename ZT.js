class ZT {
  constructor(tabela) {
    this.Tabela = tabela;
    this.Kolumna = [];
    this.Wiersz = [];
    this.Koszty = [];
    this.table = [];
    this.optymalne = false;

    // Filling Kolumna table with last column from this.table table
    for (let i = 0; i < this.Tabela.length - 1; i++) {
      this.Kolumna.push(this.Tabela[i][this.Tabela[i].length - 1]);
    }

    // filling Wiersz table with last row from this.table table
    for (let i = 0; i < this.Tabela[this.Tabela.length - 1].length - 1; i++) {
      this.Wiersz.push(this.Tabela[this.Tabela.length - 1][i]);
    }

    // Filling Koszty table
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
    let kolumna = this.Kolumna.map(elem => elem);
    let wiersz = this.Wiersz.map(elem => elem);

    wynik.forEach((linia, x) =>
      linia.forEach((element, y) => {
        if (wynik[x][y] == null)
          if (kolumna[x] != 0 && wiersz[y] != 0) {
            let wartosc = kolumna[x] > wiersz[y] ? wiersz[y] : kolumna[x];
            wynik[x][y] = wartosc;
            kolumna[x] -= wartosc;
            wiersz[y] -= wartosc;
          }
        if (kolumna[x] == 0 && wiersz[y] == 0) {
          if (x < wynik.length - 1) wynik[x + 1][y] = 0;
          else if (y < wynik[x].lenght - 1) wynik[x][y + 1] = 0;
        }
      })
    );
    this.table = wynik;
    return wynik;
  };

  czyPuste = table => {
    let flag = false;
    table.forEach(e => {
      if (e == null) {
        flag = true;
      }
    });
    return flag;
  };

  pierwszaNieBazowa = table => {
    let obj = {};
    this.Koszty.forEach((linia, x) =>
      linia.forEach((element, y) => {
        if (table[x][y] == null) {
          obj = { x: x, y: y };
        }
      })
    );
    return obj;
  };

  // jeżeli ta funkcja zwróci pustą tablicę to rozwiązanie jest optymalne
  czyOptymalne = () => {
    let table = this.table;
    let kolumnaBaz = this.Kolumna.map(elem => null);
    let wierszBaz = this.Wiersz.map(elem => null);
    kolumnaBaz[0] = 0;

    while (this.czyPuste(kolumnaBaz) || this.czyPuste(wierszBaz)) {
      this.Koszty.forEach((linia, x) =>
        linia.forEach((element, y) => {
          if (table[x][y] != null) {
            if (kolumnaBaz[x] == null && wierszBaz[y] != null)
              kolumnaBaz[x] = this.Koszty[x][y] - wierszBaz[y];
            else if (kolumnaBaz[x] != null && wierszBaz[y] == null)
              wierszBaz[y] = this.Koszty[x][y] - kolumnaBaz[x];
          }
        })
      );
    }

    let nieBazowe = [];
    let pierw = this.pierwszaNieBazowa(table);
    let value =
      kolumnaBaz[pierw.x] + wierszBaz[pierw.y] - this.Koszty[pierw.x][pierw.y];
    this.Koszty.forEach((linia, x) =>
      linia.forEach((element, y) => {
        if (
          table[x][y] == null &&
          kolumnaBaz[x] + wierszBaz[y] - this.Koszty[x][y] > 0
        ) {
          if (kolumnaBaz[x] + wierszBaz[y] - this.Koszty[x][y] == value) {
            value = kolumnaBaz[x] + wierszBaz[y] - this.Koszty[x][y];
            nieBazowe.push({
              value: value,
              x: x,
              y: y,
              koszt: this.Koszty[x][y]
            });
          } else if (kolumnaBaz[x] + wierszBaz[y] - this.Koszty[x][y] > value) {
            nieBazowe = [];
            value = kolumnaBaz[x] + wierszBaz[y] - this.Koszty[x][y];
            nieBazowe.push({
              value: value,
              x: x,
              y: y,
              koszt: this.Koszty[x][y]
            });
          }
        }
      })
    );

    return nieBazowe;
  };

  nextStep = (step, dir) => {
    let nextStep = {};
    if (dir) {
      this.Wiersz.forEach((e, y) => {
        if (y != step.y && this.table[step.x][y] != null) {
          this.Kolumna.forEach((e, x) => {
            if (this.table[x][y] != null && x != step.x) {
              nextStep = {
                value: this.table[step.x][y],
                x: step.x,
                y: y,
                koszt: this.Koszty[step.x][y]
              };
            }
          });
        }
      });
    } else {
      this.Kolumna.forEach((e, x) => {
        if (x != step.x && this.table[x][step.y] != null) {
          this.Wiersz.forEach((e, y) => {
            if (this.table[x][y] != null && y != step.y) {
              nextStep = {
                value: this.table[x][step.y],
                x: x,
                y: step.y,
                koszt: this.Koszty[x][step.y]
              };
            }
          });
        }
      });
    }
    return nextStep;
  };

  cykl = () => {
    let nieOptymalne = this.czyOptymalne();
    if (nieOptymalne.length == 0) return 0;
    table = this.table;
    let baza = {};
    let cykl = [];
    if (nieOptymalne.length == 1) {
      baza = nieOptymalne[0];
    } else if (nieOptymalne.length > 1) {
      let min = nieOptymalne[0];
      nieOptymalne.forEach(elem => {
        min = min.koszt > elem.koszt ? elem : min;
      });
      baza = min;
    }
    this.table[baza.x][baza.y] = 0;
    cykl.push(baza);
    let flag = true;
    let step = this.nextStep(cykl[0], flag);
    while (!(step.y == baza.y && step.x == baza.x)) {
      cykl.push(step);
      flag = !flag;
      step = this.nextStep(cykl[cykl.length - 1], flag);
    }
    return cykl;
  };

  kolejnyKrok = () => {
    let cykl = this.cykl();
    let temp = this.table.map(e => e.map(e => e));
    console.log(
      "==================================================================================================="
    );
    if (cykl == 0) {
      console.log("optymalne");
      console.table(this.table);
      this.optymalne = true;
      return this.table;
    } else {
      let min = cykl[1].value;
      let flag = true;
      cykl.forEach((e, index) => {
        if (index % 2 == 1) {
          if (e.value < min) min = e.value;
        }
      });
      cykl.forEach((e, index) => {
        if (index % 2 == 1 && index != 0) {
          this.table[e.x][e.y] = this.table[e.x][e.y] - min;
          if (flag && this.table[e.x][e.y] == 0) {
            this.table[e.x][e.y] = null;
            flag = false;
          }
        } else if (index % 2 == 0 && index != 0) {
          this.table[e.x][e.y] = this.table[e.x][e.y] + min;
        }
      });
      this.table[cykl[0].x][cykl[0].y] = min;
      console.table(temp);
      return temp;
    }
  };
}

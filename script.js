function calcular() {
    const total = parseFloat(document.getElementById('total').value);
    const odd1 = parseFloat(document.getElementById('odd1').value);
    const odd2 = parseFloat(document.getElementById('odd2').value);
    const drawOdd = parseFloat(document.getElementById('draw').value); // Pode ser NaN

    if (!total || !odd1 || !odd2 || odd1 <= 1 || odd2 <= 1) {
        alert("Preencha pelo menos as odds dos dois times com valores maiores que 1.");
        return;
    }

    const resultado = document.getElementById('resultado');
    resultado.style.display = 'block';

    // --- 3-way arbitragem (com empate) ---
    let lucro3way = -Infinity;
    let aposta1_3, aposta2_3, apostaEmpate, retorno1_3, retorno2_3, retornoEmpate;
    let arbitragem3way = Infinity;
    let temLucro3way = false;

    if (drawOdd && drawOdd > 1) {
        const inv1 = 1 / odd1;
        const inv2 = 1 / odd2;
        const invDraw = 1 / drawOdd;
        arbitragem3way = inv1 + inv2 + invDraw;

        if (arbitragem3way < 1) {
            const soma = inv1 + inv2 + invDraw;

            aposta1_3 = (total * inv1) / soma;
            aposta2_3 = (total * inv2) / soma;
            apostaEmpate = total - (aposta1_3 + aposta2_3);

            retorno1_3 = aposta1_3 * odd1;
            retorno2_3 = aposta2_3 * odd2;
            retornoEmpate = apostaEmpate * drawOdd;

            const menorRetorno = Math.min(retorno1_3, retorno2_3, retornoEmpate);
            lucro3way = menorRetorno - total;
            temLucro3way = lucro3way > 0.01;
        }
    }

    // --- 2-way arbitragem (sem empate) ---
    let lucro2way = -Infinity;
    let aposta1_2 = 0, aposta2_2 = 0;
    let retorno1_2 = 0, retorno2_2 = 0;
    let temLucro2way = false;

    const inv1_2 = 1 / odd1;
    const inv2_2 = 1 / odd2;
    const arbitragem2way = inv1_2 + inv2_2;

    if (arbitragem2way < 1) {
        aposta1_2 = (total * inv1_2) / arbitragem2way;
        aposta2_2 = total - aposta1_2;

        retorno1_2 = aposta1_2 * odd1;
        retorno2_2 = aposta2_2 * odd2;

        const menorRetorno2 = Math.min(retorno1_2, retorno2_2);
        lucro2way = menorRetorno2 - total;

        if (lucro2way > 0.01) {
            temLucro2way = true;
        }
    }

    // Exibição lógica
    if (!temLucro3way && !temLucro2way) {
        resultado.innerHTML = `
            <div style="text-align: center;">
                <strong style="color: #ff4d4d;">❌&nbsp;&nbsp;&nbsp;Aposta NÃO recomendada</strong><br><br>
                Nem com nem sem o empate essa aposta garante lucro.<br><br>
                Experimente com outras odds ou eventos.
            </div>
        `;
        return;
    }

    if (temLucro3way) {
        resultado.innerHTML = `
            <div style="text-align: center;">
            <strong style="color: #00ffcc;">✅&nbsp;&nbsp;&nbsp;Aposta recomendada (com empate)</strong><br><br>
            </div>
            <strong>Distribuição das apostas:</strong><br>
            • R$ ${aposta1_3.toFixed(2)} na Odd ${odd1}<br>
            • R$ ${aposta2_3.toFixed(2)} na Odd ${odd2}<br>
            • R$ ${apostaEmpate.toFixed(2)} na Odd ${drawOdd}<br><br>

            <strong>Retorno estimado:</strong><br>
            • Se vencer Time 1: R$ ${retorno1_3.toFixed(2)}<br>
            • Se vencer Time 2: R$ ${retorno2_3.toFixed(2)}<br>
            • Se empatar: R$ ${retornoEmpate.toFixed(2)}<br><br>

            <strong>Lucro líquido garantido:</strong><br>
            R$ ${lucro3way.toFixed(2)} (${((lucro3way / total) * 100).toFixed(2)}%)
        `;
        return;
    }

    if (temLucro2way && drawOdd && drawOdd > 1) {
        resultado.innerHTML = `
            <div style="text-align: center;">
            <strong style="color: #ffaa00;">⚠️&nbsp;&nbsp;&nbsp;Aposta recomendada SOMENTE se desconsiderar o empate</strong><br><br>
            </div>
            <strong>Distribuição das apostas:</strong><br>
            • R$ ${aposta1_2.toFixed(2)} na Odd ${odd1}<br>
            • R$ ${aposta2_2.toFixed(2)} na Odd ${odd2}<br><br>

            <strong>Retorno estimado:</strong><br>
            • Se vencer Time 1: R$ ${retorno1_2.toFixed(2)}<br>
            • Se vencer Time 2: R$ ${retorno2_2.toFixed(2)}<br><br>

            <strong>Lucro garantido (exceto empate):</strong><br>
            R$ ${lucro2way.toFixed(2)} (${((lucro2way / total) * 100).toFixed(2)}%)<br><br>
            <div style="text-align: center;">
            <span style="color: #ccc;">Obs: Se o jogo terminar empatado, você perde toda a aposta.</span>
            </div>
        `;
        return;
    }

    if (temLucro2way && (!drawOdd || drawOdd <= 1)) {
        resultado.innerHTML = `
            <div style="text-align: center;">
            <strong style="color: #00ffcc;">✅&nbsp;&nbsp;&nbsp;Aposta recomendada<br>(sem considerar empate)</strong><br><br>
            </div>
            <strong>Distribuição das apostas:</strong><br>
            • R$ ${aposta1_2.toFixed(2)} na Odd ${odd1}<br>
            • R$ ${aposta2_2.toFixed(2)} na Odd ${odd2}<br><br>

            <strong>Retorno estimado:</strong><br>
            • Se vencer Time 1: R$ ${retorno1_2.toFixed(2)}<br>
            • Se vencer Time 2: R$ ${retorno2_2.toFixed(2)}<br><br>

            <strong>Lucro garantido (exceto empate):</strong><br>
            R$ ${lucro2way.toFixed(2)} (${((lucro2way / total) * 100).toFixed(2)}%)<br><br>
            <div style="text-align: center;">
            <span style="color: #ccc;">Obs: Se o jogo terminar empatado, você perde toda a aposta.</span>
            </div>
        `;
        return;
    }
}

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  direction: "vertical",
  gestureDirection: "vertical",
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)
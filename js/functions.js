let tonalidades = [];

// Función para obtener el acorde dominante de una tonalidad
function dominante(tonalidad) {
  const dominantes = {
    'C': 'G', 'G': 'D', 'D': 'A', 'A': 'E', 'E': 'B', 'B': 'Gb',
    'F': 'C', 'Bb': 'F', 'Eb': 'Bb', 'Ab': 'Eb', 'Db': 'Ab', 'Gb': 'Db'
  };
  return dominantes[tonalidad];
}
function relativoMenor(tonalidad) {
  const relativos = {
      C: 'Am', G: 'Em', D: 'Bm', A: 'F#m', E: 'C#m', B: 'G#m',
      F: 'Dm', Bb: 'Gm', Eb: 'Cm', Ab: 'Fm', Db: 'Bbm', Gb: 'Ebm'
  };
  return relativos[tonalidad] || null;
}

function tritono(acorde) {
  const tritonos = {
      C: 'F#', G: 'Db', D: 'Ab', A: 'Eb', E: 'Bb', B: 'F',
      F: 'B', Bb: 'E', Eb: 'A', Ab: 'D', Db: 'G', Gb: 'C'
  };
  return tritonos[acorde] || null;
}

function acordeDisminuido(tonalidad) {
  const disminuidos = {
      C: 'Bdim', G: 'F#dim', D: 'C#dim', A: 'G#dim', E: 'D#dim', B: 'A#dim',
      F: 'Edim', Bb: 'Adim', Eb: 'Ddim', Ab: 'Gdim', Db: 'Cdim', Gb: 'Fdim'
  };
  return disminuidos[tonalidad] || null;
}
function calcularAfinidad(progresion,name) {
  const notasPorAcorde = {
      C: ['C', 'E', 'G'], G: ['G', 'B', 'D'], D: ['D', 'F#', 'A'], A: ['A', 'C#', 'E'],
      E: ['E', 'G#', 'B'], B: ['B', 'D#', 'F#'], F: ['F', 'A', 'C'], Bb: ['Bb', 'D', 'F'],
      Eb: ['Eb', 'G', 'Bb'], Ab: ['Ab', 'C', 'Eb'], Db: ['Db', 'F', 'Ab'], Gb: ['Gb', 'Bb', 'Db'],
      'F#dim': ['F#', 'A', 'C'], 'Bdim': ['B', 'D', 'F'], 'C#dim': ['C#', 'E', 'G'],
      'G#dim': ['G#', 'B', 'D'], 'D#dim': ['D#', 'F#', 'A'], 'A#dim': ['A#', 'C#', 'E']
  };
  console.log('calcularAfinidad progresion',name,progresion)
  let totalNotasCompartidas = 0;
  for (let i = 0; i < progresion.length - 1; i++) {
    console.log(progresion[i + 1])
      const acordeActual = progresion[i].replace(/7|m|dim|maj7|#/, '');
      const acordeSiguiente = progresion[i + 1].replace(/7|m|dim|maj7|#/, '');
      const notasActual = notasPorAcorde[acordeActual] || [];
      const notasSiguiente = notasPorAcorde[acordeSiguiente] || [];
      const compartidas = notasActual.filter(nota => notasSiguiente.includes(nota)).length;
      totalNotasCompartidas += compartidas;
  }
  return totalNotasCompartidas;
}

function generarModulaciones(from, to) {
  const dom = dominante(to);
  const relMenorFrom = relativoMenor(from);
  const relMenorTo = relativoMenor(to);
  const tritonal = tritono(dom);
  const dimCompleto = acordeDisminuido(from);

  const modulaciones = [
      { nombre: 'Dominante Secundaria', progresion: [from, `${dom}7`, to] },
      { nombre: 'Cadencia Perfecta Extendida', progresion: [from, `${from}7`, dom, to] },
      { nombre: 'Cadencia Plagal', progresion: [from, `${from}m`, `${to}m`, to] },
      { nombre: 'Intercambio Modal', progresion: [from, `${from}m`, `${dom}7`, to] },
      { nombre: 'Cadencia por Cromatismo', progresion: [from, `${from}#dim`, `${dom}7`, to] },
      { nombre: 'Círculo de Quintas', progresion: [from, dominante(from), dominante(dom), to] },
      { nombre: 'Cadencia Ascendente', progresion: [from, `${from}maj7`, `${dom}7`, to] },
      { nombre: 'Progresión de Subdominante', progresion: [from, `${from}m`, `${to}m`, `${dom}7`, to] },
      { nombre: 'Modulación Diatónica', progresion: [from, `${from}maj7`, `${dom}7`, `${to}maj7`, to] },
      { nombre: 'Modulación por Acorde Disminuido', progresion: [`${from}`,`${from}#dim`,`${dominante(to)}7`,`${to}m`,`${to}`] }
      { nombre: 'Acordes en Común', progresion: [from, relMenorFrom, relMenorTo, to] },
      { nombre: 'Sustitución Tritonal', progresion: [from, `${tritonal}7`, `${dom}7`, to] },
      { nombre: 'Acorde Disminuido Completo', progresion: [from, dimCompleto, `${dom}7`, to] }
  ];
  modulaciones.forEach(m=>{
    m.afin= calcularAfinidad(m.progresion,m.nombre)
  })
  return modulaciones.map(mod => ({
      ...mod,
      afinidad: calcularAfinidad(mod.progresion,mod.nombre)
  }));
}


function listaTonalidades(){
  const tono=['A','Bb','B','C','Db','D','Eb','E','F','Gb','G','Ab'];
  var tonos=``;
  tono.forEach(t=>{
    tonos+=`<option value="${t}">${t}</option> `;
  })
  document.getElementById('from').innerHTML=tonos;
  document.getElementById('to').innerHTML=tonos;
}

function buscar(){
  let e = document.getElementById("from");
  let from = e.value;
  let e1 = document.getElementById("to");
  let to = e1.value;
  let modulaciones = generarModulaciones(from,to);
  console.log(modulaciones);
  let mods=`<div class="accordion" id="accordionExample">`;
  modulaciones.forEach(m =>{
    let prog='';
    let acordes=``
    m.progresion.forEach(p=>{
      prog+=prog.length?' → '+p:p;
      
      acordes+=`<div class="acordes">
          <ins class="scales_chords_api" chord="${p}"  output="sound"></ins>
        </div>
      `
    })
    let max = (m.progresion.length-1)*3;
    console.log('cant acordes',m.progresion.length)
    console.log('afinindad',m.afinidad)
    let stars = Math.round((m.afinidad*10)/max);
    let starC= Math.trunc(stars/2);
    let starI= stars % 2==0?0:1;
    let noStar= 5-starC-starI;
    let iconStar=``;
    for (let index = 0; index < starC; index++) {
      iconStar+=`<i class="bi bi-star-fill"></i>` 
    }
    for (let index = 0; index < starI; index++) {
      iconStar+=`<i class="bi bi-star-half"></i>` 
    }
    for (let index = 0; index < noStar; index++) {
      iconStar+=`<i class="bi bi-star"></i>` 
    }
    console.log(iconStar);
    m.stars=iconStar;
    mods+=`<div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${m.nombre.replaceAll(' ','_')}" aria-expanded="false" aria-controls="${m.nombre.replaceAll(' ','_')}">
        <div class="d-flex justify-content-start" style="width:100%"><div class="col">${m.nombre} (${prog})</div> <div class="col stars" id='stars_${m.nombre.replaceAll(' ','_')}'></div></div>
      </button>
    </h2>
    <div id="${m.nombre.replaceAll(' ','_')}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
      ${acordes} 
      </div>
    </div>
  </div>`
  })
  mods+=`</div>`;
  //console.log(mods);
  document.getElementById('listaSel').innerHTML=mods
  console.log(modulaciones)
  modulaciones.forEach(m=>{
    document.getElementById('stars_'+m.nombre.replaceAll(' ','_')).innerHTML=m.stars
  })
  
  /*`<div class="accordion" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
        Accordion Item #1
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        Accordion Item #2
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        Accordion Item #3
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
</div>`*/
}

function cargar(){
  listaTonalidades()
}



//console.log(generarModulaciones('G', 'Bb'));

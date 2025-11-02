document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('anemiaForm');
    const resultadoContainer = document.getElementById('resultado-container');
    const resultadoMensaje = document.getElementById('resultado-mensaje');
    const clasificacionAnemia = document.getElementById('clasificacion-anemia');

    // Rangos de Referencia Clínicos (aproximados)
    // Fuente: Literatura médica estándar, ajustado a las necesidades de clasificación.
    const RANGOS = {
        // Rangos principales para el diagnóstico de Anemia por Hemoglobina (g/dL)
        HEMOGLOBINA: {
            '0': { // Hombre
                normal: 13.5, // 13.5 - 17.5 g/dL
            },
            '1': { // Mujer
                normal: 12.0, // 12.0 - 15.5 g/dL
            }
        },
        // Rangos de clasificación
        MCV: { // Volumen Corpuscular Medio (fL)
            microcitica: 80,
            macrocitica: 100
        },
        MCH: { // Hemoglobina Corpuscular Media (pg)
            hipocromica: 27,
            normalMax: 33
        },
        MCHC: { // Concentración de Hemoglobina Corpuscular Media (g/dL)
            hipocromica: 32,
            normalMax: 36
        }
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // 1. Obtener valores de la interfaz
        const genero = document.getElementById('genero').value;
        const hb = parseFloat(document.getElementById('hemoglobina').value);
        const mcv = parseFloat(document.getElementById('mcv').value);
        const mch = parseFloat(document.getElementById('mch').value);
        const mchc = parseFloat(document.getElementById('mchc').value);

        // 2. Realizar el diagnóstico principal (Anemia vs. Normal)
        const hbNormal = RANGOS.HEMOGLOBINA[genero].normal;
        
        let esAnemico = false;
        let clasificacion = "";
        let mensajePrincipal = "";

        if (hb < hbNormal) {
            esAnemico = true;
            mensajePrincipal = `⚠️ **RESULTADO: ANEMIA** (Nivel de Hb: ${hb} g/dL, inferior al límite normal de ${hbNormal} g/dL para ${genero === '0' ? 'Hombres' : 'Mujeres'}).`;
            
            // 3. Clasificación de la Anemia (si aplica)
            clasificacion = clasificarAnemia(mcv, mch, mchc);

        } else {
            esAnemico = false;
            mensajePrincipal = `✅ **RESULTADO: SIN ANEMIA** (Nivel de Hb: ${hb} g/dL, dentro del rango normal).`;
            clasificacion = "Los demás índices son normales y no sugieren anemia. Se recomienda revisar los rangos altos para policitemia u otras condiciones.";
        }

        // 4. Mostrar el resultado en la interfaz
        mostrarResultado(esAnemico, mensajePrincipal, clasificacion);
    });

    /**
     * Clasifica la anemia según los índices corpusculares.
     * Basado en VCM para tamaño (cítica) y HCM/CHCM para color (crómica).
     */
    function clasificarAnemia(mcv, mch, mchc) {
        let clasifVCM = "";
        let clasifMCH = "";

        // Clasificación por Tamaño (VCM)
        if (mcv < RANGOS.MCV.microcitica) {
            clasifVCM = "Microcítica (VCM bajo)";
        } else if (mcv > RANGOS.MCV.macrocitica) {
            clasifVCM = "Macrocítica (VCM alto)";
        } else {
            clasifVCM = "Normocítica (VCM normal)";
        }

        // Clasificación por Color/Concentración (HCM y CHCM)
        // Usamos el CHCM como principal indicador de hipocromía
        if (mchc < RANGOS.MCHC.hipocromica) {
            clasifMCH = "Hipocrómica (CHCM bajo)";
        } else if (mchc > RANGOS.MCHC.normalMax || mch > RANGOS.MCH.normalMax) {
            // Nota: La hipercrómica es rara y a menudo artificial, pero la señalamos
            clasifMCH = "Hipercrómica/Esferocítica (CHCM/HCM alto)";
        } else {
            clasifMCH = "Normocrómica (CHCM/HCM normal)";
        }

        let mensajeClasificacion = `
            <p><strong>Clasificación Morfológica:</strong></p>
            <ul>
                <li><strong>Tamaño del Eritrocito (VCM):</strong> ${clasifVCM}</li>
                <li><strong>Concentración de Hemoglobina (CHCM/HCM):</strong> ${clasifMCH}</li>
            </ul>
        `;
        
        // Sugerencias clínicas basadas en la clasificación
        if (clasifVCM.includes("Microcítica") && clasifMCH.includes("Hipocrómica")) {
            mensajeClasificacion += '<p class="nota">➡️ **Sugerencia Clínica:** Típico de Anemia Ferropénica (por Deficiencia de Hierro) o Talasemia.</p>';
        } else if (clasifVCM.includes("Macrocítica")) {
            mensajeClasificacion += '<p class="nota">➡️ **Sugerencia Clínica:** Típico de Anemia Megaloblástica (por deficiencia de Vitamina B12 o Folato).</p>';
        } else if (clasifVCM.includes("Normocítica") && clasifMCH.includes("Normocrómica")) {
            mensajeClasificacion += '<p class="nota">➡️ **Sugerencia Clínica:** Típico de Anemia por Enfermedad Crónica, Anemia Aplásica o Hemorragia Aguda.</p>';
        }

        return mensajeClasificacion;
    }

    /**
     * Muestra los resultados en el contenedor de la interfaz.
     */
    function mostrarResultado(esAnemico, mensajePrincipal, clasificacion) {
        // Actualizar clases y visibilidad
        resultadoContainer.classList.remove('hidden', 'anemia', 'normal');
        resultadoContainer.classList.add(esAnemico ? 'anemia' : 'normal');

        // Insertar el mensaje principal
        resultadoMensaje.innerHTML = mensajePrincipal;
        
        // Insertar la clasificación detallada
        clasificacionAnemia.innerHTML = clasificacion;

        // Asegurar que se haga scroll al resultado
        resultadoContainer.scrollIntoView({ behavior: 'smooth' });
    }
});
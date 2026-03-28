const translations = {
  // ── Navigation ──
  "nav.home": { en: "Home", es: "Inicio" },
  "nav.interactions": { en: "Interactions", es: "Interacciones" },
  "nav.about": { en: "About", es: "Acerca de" },
  "nav.compare": { en: "Compare", es: "Comparar" },

  // ── Home page: hero ──
  "home.badge": { en: "FDA-powered insights", es: "Datos respaldados por la FDA" },
  "home.hero.title.line1": { en: "Understand Your", es: "Entiende Tus" },
  "home.hero.title.line2": { en: "Medications", es: "Medicamentos" },
  "home.hero.subtitle": {
    en: "Get plain-language explanations, reported side effects, and safety assessments — all from real FDA data.",
    es: "Obtén explicaciones en lenguaje sencillo, efectos secundarios reportados y evaluaciones de seguridad — todo con datos reales de la FDA.",
  },

  // ── Home page: trust indicators ──
  "home.trust.noData": { en: "No data stored", es: "No se guardan datos" },
  "home.trust.realFda": { en: "Real FDA data", es: "Datos reales de la FDA" },
  "home.trust.safetyFirst": { en: "Safety-first design", es: "Diseño enfocado en la seguridad" },

  // ── Guided intro goals ──
  "guided.prompt": { en: "What would you like to do?", es: "¿Qué te gustaría hacer?" },
  "guided.goal.understand": { en: "Understand my medication", es: "Entender mi medicamento" },
  "guided.goal.understand.desc": {
    en: "Learn what it does, how to take it, and what to watch for",
    es: "Aprende para qué sirve, cómo tomarlo y qué vigilar",
  },
  "guided.goal.sideEffects": { en: "Check side effects", es: "Revisar efectos secundarios" },
  "guided.goal.sideEffects.desc": {
    en: "See what others have reported to the FDA",
    es: "Mira lo que otros han reportado a la FDA",
  },
  "guided.goal.symptoms": { en: "I have symptoms", es: "Tengo síntomas" },
  "guided.goal.symptoms.desc": {
    en: "Check if your symptoms need attention",
    es: "Verifica si tus síntomas necesitan atención",
  },
  "guided.goal.interactions": { en: "Check drug interactions", es: "Revisar interacciones entre medicamentos" },
  "guided.goal.interactions.desc": {
    en: "See if your medications interact with each other",
    es: "Verifica si tus medicamentos interactúan entre sí",
  },
  "guided.changeGoal": { en: "Change goal", es: "Cambiar objetivo" },
  "guided.whichMedication": { en: "Which medication?", es: "¿Cuál medicamento?" },
  "guided.typeAMedication": { en: "Type a medication name...", es: "Escribe el nombre de un medicamento..." },
  "guided.whatSymptoms": { en: "What symptoms are you experiencing?", es: "¿Qué síntomas estás experimentando?" },
  "guided.anySymptoms": { en: "Any current symptoms? (optional)", es: "¿Algún síntoma actual? (opcional)" },
  "guided.addAnotherSymptom": { en: "Add another symptom...", es: "Agregar otro síntoma..." },

  // ── Common symptoms ──
  "symptom.nausea": { en: "Nausea", es: "Náuseas" },
  "symptom.headache": { en: "Headache", es: "Dolor de cabeza" },
  "symptom.dizziness": { en: "Dizziness", es: "Mareo" },
  "symptom.fatigue": { en: "Fatigue", es: "Fatiga" },
  "symptom.rash": { en: "Rash", es: "Sarpullido" },
  "symptom.stomachPain": { en: "Stomach pain", es: "Dolor de estómago" },
  "symptom.insomnia": { en: "Insomnia", es: "Insomnio" },
  "symptom.dryMouth": { en: "Dry mouth", es: "Boca seca" },
  "symptom.drowsiness": { en: "Drowsiness", es: "Somnolencia" },
  "symptom.anxiety": { en: "Anxiety", es: "Ansiedad" },
  "symptom.jointPain": { en: "Joint pain", es: "Dolor articular" },
  "symptom.blurredVision": { en: "Blurred vision", es: "Visión borrosa" },
  "symptom.chestPain": { en: "Chest pain", es: "Dolor en el pecho" },
  "symptom.shortnessOfBreath": { en: "Shortness of breath", es: "Dificultad para respirar" },

  // ── Form labels ──
  "form.medicationName": { en: "Medication Name", es: "Nombre del medicamento" },
  "form.currentSymptoms": { en: "Current Symptoms", es: "Síntomas actuales" },
  "form.optional": { en: "(optional)", es: "(opcional)" },
  "form.category": { en: "Category", es: "Categoría" },
  "form.quickAdd": { en: "Quick add", es: "Agregar rápido" },
  "form.popularInCategory": { en: "Popular in this category", es: "Populares en esta categoría" },
  "form.searchMedication": { en: "Search for a medication...", es: "Busca un medicamento..." },
  "form.symptomsPlaceholder": { en: "e.g., nausea, headache, dizziness", es: "ej., náuseas, dolor de cabeza, mareo" },
  "form.separateSymptoms": { en: "Separate multiple symptoms with commas", es: "Separa los síntomas con comas" },
  "form.symptomsNote": {
    en: "We'll check if your symptoms may be related to these medications",
    es: "Verificaremos si tus síntomas pueden estar relacionados con estos medicamentos",
  },
  "form.medicationsToCheck": { en: "Medications to check", es: "Medicamentos a verificar" },
  "form.addMedication": { en: "Add medication", es: "Agregar medicamento" },

  // ── Buttons ──
  "btn.analyze": { en: "Analyze Medication", es: "Analizar medicamento" },
  "btn.analyzing": { en: "Analyzing...", es: "Analizando..." },
  "btn.checkInteractions": { en: "Check Interactions", es: "Verificar interacciones" },
  "btn.checking": { en: "Checking...", es: "Verificando..." },
  "btn.compare": { en: "Compare", es: "Comparar" },
  "btn.checkMySymptoms": { en: "Check My Symptoms", es: "Revisar mis síntomas" },
  "btn.viewSideEffects": { en: "View Side Effects", es: "Ver efectos secundarios" },

  // ── Results page ──
  "results.for": { en: "Results for", es: "Resultados para" },
  "results.newSearch": { en: "New search", es: "Nueva búsqueda" },
  "results.back": { en: "Back", es: "Volver" },
  "results.loading.title": { en: "Analyzing", es: "Analizando" },
  "results.loading.subtitle": { en: "Fetching data from FDA database", es: "Obteniendo datos de la base de datos de la FDA" },
  "results.error.tryAnother": { en: "Try another medication", es: "Prueba con otro medicamento" },
  "results.error.fetchFailed": {
    en: "Failed to fetch medication data. Please try again.",
    es: "No se pudieron obtener los datos del medicamento. Por favor, intenta de nuevo.",
  },
  "results.noMedication": { en: "No medication specified.", es: "No se especificó ningún medicamento." },
  "results.goBackAndSearch": { en: "Go back and search", es: "Volver y buscar" },

  // ── Drug info section ──
  "drugInfo.whatItDoes": { en: "What it does", es: "Para qué sirve" },
  "drugInfo.whatItDoes.plain": { en: "This medication is used for:", es: "Este medicamento se usa para:" },
  "drugInfo.howToUse": { en: "How to use", es: "Cómo usarlo" },
  "drugInfo.howToUse.plain": { en: "How to take this medication:", es: "Cómo tomar este medicamento:" },
  "drugInfo.dosage": { en: "Dosage", es: "Dosis" },
  "drugInfo.dosage.plain": { en: "Typical dosage information:", es: "Información de dosis habitual:" },
  "drugInfo.keyWarnings": { en: "Key Warnings", es: "Advertencias importantes" },
  "drugInfo.genericAvailable": { en: "Generic available", es: "Genérico disponible" },

  // ── Chart titles ──
  "chart.sideEffects": { en: "Reported Side Effects", es: "Efectos secundarios reportados" },
  "chart.sideEffects.subtitle": { en: "Based on FDA adverse event reports", es: "Basado en reportes de eventos adversos de la FDA" },
  "chart.sideEffects.note": {
    en: "Percentages represent proportion of total adverse event reports, not likelihood of occurrence.",
    es: "Los porcentajes representan la proporción del total de reportes de eventos adversos, no la probabilidad de que ocurran.",
  },
  "chart.reportsOverTime": { en: "Reports Over Time", es: "Reportes a lo largo del tiempo" },
  "chart.reportsOverTime.subtitle": { en: "FDA adverse event reports received per year", es: "Reportes de eventos adversos recibidos por la FDA por año" },
  "chart.reportsOverTime.tooltipLabel": { en: "Reports", es: "Reportes" },
  "chart.patientOutcomes": { en: "Patient Outcomes", es: "Resultados de los pacientes" },
  "chart.patientOutcomes.subtitle": { en: "Reported outcomes from adverse event cases", es: "Resultados reportados de casos de eventos adversos" },
  "chart.demographics": { en: "Demographics", es: "Demografía" },
  "chart.demographics.subtitle": { en: "Who reports adverse events for this medication", es: "Quién reporta eventos adversos para este medicamento" },
  "chart.bySex": { en: "By Sex", es: "Por sexo" },
  "chart.byAgeGroup": { en: "By Age Group", es: "Por grupo de edad" },

  // ── No data messages ──
  "noData.sideEffects": { en: "No adverse event data available for this medication.", es: "No hay datos de eventos adversos disponibles para este medicamento." },
  "noData.reportsOverTime": { en: "No timeline data available.", es: "No hay datos de cronología disponibles." },
  "noData.patientOutcomes": { en: "No outcome data available.", es: "No hay datos de resultados disponibles." },
  "noData.demographics": { en: "No demographic data available.", es: "No hay datos demográficos disponibles." },
  "noData.general": { en: "No data available", es: "No hay datos disponibles" },

  // ── Risk levels ──
  "risk.high": { en: "high risk", es: "riesgo alto" },
  "risk.moderate": { en: "moderate risk", es: "riesgo moderado" },
  "risk.low": { en: "low risk", es: "riesgo bajo" },
  "risk.flaggedSymptoms": { en: "Flagged symptoms", es: "Síntomas señalados" },

  // ── Interaction checker ──
  "interactions.badge": { en: "Interaction Checker", es: "Verificador de interacciones" },
  "interactions.title.line1": { en: "Drug Interaction", es: "Verificador de" },
  "interactions.title.line2": { en: "Checker", es: "Interacciones" },
  "interactions.subtitle": {
    en: "Enter two or more medications to check for known interactions from FDA data.",
    es: "Ingresa dos o más medicamentos para verificar interacciones conocidas con datos de la FDA.",
  },
  "interactions.found": { en: "interaction", es: "interacción" },
  "interactions.foundPlural": { en: "interactions", es: "interacciones" },
  "interactions.found.suffix": { en: "found", es: "encontrada(s)" },
  "interactions.noKnown": { en: "No known interactions", es: "No se encontraron interacciones conocidas" },
  "interactions.noKnown.detail": {
    en: "No interactions found in FDA label data. This doesn't guarantee safety — always check with your pharmacist.",
    es: "No se encontraron interacciones en los datos de la FDA. Esto no garantiza seguridad — siempre consulta con tu farmacéutico.",
  },
  "interactions.noMatchFilter": { en: "No interactions match this filter.", es: "Ninguna interacción coincide con este filtro." },
  "interactions.potentialRisks": { en: "Potential risks", es: "Riesgos potenciales" },
  "interactions.whatToDo": { en: "What to do", es: "Qué hacer" },
  "interactions.showFdaSource": { en: "Show FDA source text", es: "Mostrar texto fuente de la FDA" },
  "interactions.hideFdaSource": { en: "Hide FDA source text", es: "Ocultar texto fuente de la FDA" },
  "interactions.failedToCheck": {
    en: "Failed to check interactions. Please try again.",
    es: "No se pudieron verificar las interacciones. Por favor, intenta de nuevo.",
  },
  "interactions.filterAll": { en: "All", es: "Todas" },

  // ── Severity labels and summaries ──
  "severity.high.label": { en: "High Risk", es: "Riesgo alto" },
  "severity.high.summary": {
    en: "These medications may have a dangerous interaction. Talk to your doctor before combining them.",
    es: "Estos medicamentos pueden tener una interacción peligrosa. Habla con tu médico antes de combinarlos.",
  },
  "severity.moderate.label": { en: "Moderate", es: "Moderado" },
  "severity.moderate.summary": {
    en: "Use caution. Your doctor may need to adjust your dose or monitor you more closely.",
    es: "Usa precaución. Tu médico podría necesitar ajustar tu dosis o monitorearte más de cerca.",
  },
  "severity.low.label": { en: "Low Risk", es: "Riesgo bajo" },
  "severity.low.summary": {
    en: "Minor interaction noted. Usually safe, but let your doctor know you take both.",
    es: "Se encontró una interacción menor. Generalmente es seguro, pero informa a tu médico que tomas ambos.",
  },

  // ── Disclaimer ──
  "disclaimer.title": { en: "Important Notice", es: "Aviso importante" },
  "disclaimer.body": {
    en: "This tool is for educational purposes only and does not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before making any medical decisions. If you are experiencing a medical emergency, call 911 immediately.",
    es: "Esta herramienta es solo con fines educativos y no proporciona asesoramiento médico, diagnóstico ni tratamiento. Siempre consulta a un profesional de salud calificado antes de tomar decisiones médicas. Si tienes una emergencia médica, llama al 911 de inmediato.",
  },

  // ── About page ──
  "about.badge": { en: "About", es: "Acerca de" },
  "about.title": { en: "About", es: "Acerca de" },
  "about.subtitle": {
    en: "An AI-powered medication companion that improves health literacy and safety by translating prescriptions into plain language and using population-level insights to help users make informed, safer health decisions.",
    es: "Un asistente de medicamentos con inteligencia artificial que mejora la alfabetización y seguridad en salud traduciendo recetas a lenguaje sencillo y usando datos a nivel poblacional para ayudar a tomar decisiones de salud más informadas y seguras.",
  },
  "about.problem.title": { en: "The Problem", es: "El problema" },
  "about.problem.body": {
    en: "Millions of patients struggle to understand their prescriptions. Complex medical terminology, dense drug labels, and limited access to healthcare providers lead to medication misuse, adverse reactions, and preventable hospitalizations — disproportionately affecting elderly, low-income, and underserved communities.",
    es: "Millones de pacientes tienen dificultades para entender sus recetas médicas. La terminología médica compleja, las etiquetas de medicamentos densas y el acceso limitado a proveedores de salud conducen al uso incorrecto de medicamentos, reacciones adversas y hospitalizaciones prevenibles — afectando desproporcionadamente a personas mayores, de bajos ingresos y comunidades desatendidas.",
  },
  "about.approach.title": { en: "Our Approach", es: "Nuestro enfoque" },
  "about.approach.plainLanguage": { en: "Plain Language", es: "Lenguaje sencillo" },
  "about.approach.plainLanguage.desc": {
    en: "We translate complex drug information into simple, understandable language.",
    es: "Traducimos la información compleja de medicamentos a un lenguaje simple y comprensible.",
  },
  "about.approach.realData": { en: "Real Data", es: "Datos reales" },
  "about.approach.realData.desc": {
    en: "Side effect insights come from actual FDA adverse event reports.",
    es: "Los datos de efectos secundarios provienen de reportes reales de eventos adversos de la FDA.",
  },
  "about.approach.safetyFirst": { en: "Safety First", es: "Seguridad ante todo" },
  "about.approach.safetyFirst.desc": {
    en: "Our risk engine flags dangerous symptoms and recommends professional care when needed.",
    es: "Nuestro motor de riesgo detecta síntomas peligrosos y recomienda atención profesional cuando es necesario.",
  },
  "about.approach.empowerment": { en: "Empowerment", es: "Empoderamiento" },
  "about.approach.empowerment.desc": {
    en: "We help people understand — we never diagnose, prescribe, or replace doctors.",
    es: "Ayudamos a las personas a entender — nunca diagnosticamos, recetamos ni reemplazamos a los médicos.",
  },
  "about.dataSources.title": { en: "Data Sources", es: "Fuentes de datos" },
  "about.dataSources.body": {
    en: "All medication data comes from the",
    es: "Todos los datos de medicamentos provienen de la",
  },
  "about.dataSources.linkText": { en: "openFDA API", es: "API de openFDA" },
  "about.dataSources.suffix": {
    en: ", a public database maintained by the U.S. Food and Drug Administration.",
    es: ", una base de datos pública mantenida por la Administración de Alimentos y Medicamentos de EE.UU.",
  },
  "about.privacy.title": { en: "Privacy", es: "Privacidad" },
  "about.privacy.body": {
    en: "MedEquity does not store any user data. Your medication searches and symptom inputs are processed in real-time and never saved or shared.",
    es: "MedEquity no almacena ningún dato del usuario. Tus búsquedas de medicamentos y síntomas se procesan en tiempo real y nunca se guardan ni se comparten.",
  },
  "about.ethics.title": { en: "Ethics & Safety", es: "Ética y seguridad" },
  "about.ethics.item1": {
    en: "No medical diagnosis or prescription recommendations",
    es: "Sin diagnósticos médicos ni recomendaciones de recetas",
  },
  "about.ethics.item2": {
    en: "Emergency symptoms always trigger urgent care recommendations",
    es: "Los síntomas de emergencia siempre generan recomendaciones de atención urgente",
  },
  "about.ethics.item3": {
    en: "All data sources are transparently cited",
    es: "Todas las fuentes de datos se citan de forma transparente",
  },
  "about.ethics.item4": {
    en: "Disclaimers accompany every result",
    es: "Los avisos legales acompañan cada resultado",
  },
  "about.ethics.item5": {
    en: "Designed to supplement, not replace, professional medical advice",
    es: "Diseñado para complementar, no reemplazar, el consejo médico profesional",
  },

  // ── Comparison page ──
  "compare.title": { en: "Medication Comparison", es: "Comparación de medicamentos" },
  "compare.subtitle": {
    en: "Compare two medications side by side -- see their purposes, dosages, warnings, and adverse event profiles.",
    es: "Compara dos medicamentos lado a lado — mira sus propósitos, dosis, advertencias y perfiles de eventos adversos.",
  },
  "compare.vs": { en: "vs", es: "vs" },
  "compare.sharedSideEffects": { en: "Shared side effects", es: "Efectos secundarios en común" },
  "compare.uniqueTo": { en: "Unique to", es: "Exclusivo de" },
  "compare.sideEffectsComparison": { en: "Side Effects Comparison", es: "Comparación de efectos secundarios" },
  "compare.sideEffectsComparison.subtitle": {
    en: "Top reported adverse events from FDA data (percentage of total reports)",
    es: "Principales eventos adversos reportados con datos de la FDA (porcentaje del total de reportes)",
  },
  "compare.noAdverseData": {
    en: "No adverse event data available for comparison.",
    es: "No hay datos de eventos adversos disponibles para comparación.",
  },
  "compare.firstMedication": { en: "First Medication", es: "Primer medicamento" },
  "compare.secondMedication": { en: "Second Medication", es: "Segundo medicamento" },
  "compare.comparing": { en: "Comparing...", es: "Comparando..." },
  "compare.purpose": { en: "Purpose", es: "Propósito" },
  "compare.warnings": { en: "Warnings", es: "Advertencias" },
  "compare.genericAvailable": { en: "Generic Available", es: "Genérico disponible" },
  "compare.failedToFetch": {
    en: "Failed to fetch comparison data. Please try again.",
    es: "No se pudieron obtener los datos de comparación. Por favor, intenta de nuevo.",
  },

  // ── Footer ──
  "footer.copyright": { en: "MedEquity", es: "MedEquity" },
  "footer.poweredBy": { en: "Powered by openFDA data", es: "Con datos de openFDA" },

  // ── Interactions results ──
  "interactions.found.count": { en: "interaction", es: "interacción" },
  "interactions.found.countPlural": { en: "interactions", es: "interacciones" },
  "interactions.found.label": { en: "found", es: "encontrada(s)" },

  // ── Misc ──
  "misc.noDataAvailable": { en: "No data available", es: "No hay datos disponibles" },
  "misc.fdaPoweredInsights": { en: "FDA-powered insights", es: "Datos respaldados por la FDA" },
} as const;

export type Locale = "en" | "es";

export type TranslationKey = keyof typeof translations;

export { translations };

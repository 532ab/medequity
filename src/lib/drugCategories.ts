export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "otc", label: "OTC" },
  { id: "prescription", label: "Prescription" },
  { id: "pain", label: "Pain Relief" },
  { id: "cardio", label: "Cardiovascular" },
  { id: "diabetes", label: "Diabetes" },
  { id: "mental", label: "Mental Health" },
  { id: "antibiotic", label: "Antibiotics" },
  { id: "allergy", label: "Allergy" },
  { id: "gi", label: "Stomach / GI" },
  { id: "thyroid", label: "Thyroid" },
  { id: "respiratory", label: "Respiratory" },
];

export const POPULAR_DRUGS: Record<string, string[]> = {
  all: ["Ibuprofen", "Metformin", "Lisinopril", "Amoxicillin", "Omeprazole", "Sertraline", "Atorvastatin", "Acetaminophen", "Levothyroxine", "Amlodipine", "Losartan", "Gabapentin"],
  otc: ["Ibuprofen", "Acetaminophen", "Aspirin", "Diphenhydramine", "Loratadine", "Omeprazole", "Famotidine", "Cetirizine", "Guaifenesin", "Naproxen", "Bismuth Subsalicylate", "Melatonin"],
  prescription: ["Metformin", "Lisinopril", "Atorvastatin", "Sertraline", "Amlodipine", "Metoprolol", "Levothyroxine", "Losartan", "Gabapentin", "Omeprazole", "Prednisone", "Tramadol"],
  pain: ["Ibuprofen", "Acetaminophen", "Aspirin", "Naproxen", "Gabapentin", "Tramadol", "Celecoxib", "Meloxicam", "Diclofenac", "Pregabalin", "Cyclobenzaprine", "Ketorolac"],
  cardio: ["Lisinopril", "Atorvastatin", "Amlodipine", "Metoprolol", "Losartan", "Warfarin", "Clopidogrel", "Furosemide", "Hydrochlorothiazide", "Simvastatin", "Rosuvastatin", "Spironolactone"],
  diabetes: ["Metformin", "Glipizide", "Sitagliptin", "Pioglitazone", "Empagliflozin", "Liraglutide", "Glyburide", "Acarbose", "Glimepiride", "Dapagliflozin", "Canagliflozin", "Insulin"],
  mental: ["Sertraline", "Fluoxetine", "Escitalopram", "Bupropion", "Venlafaxine", "Duloxetine", "Aripiprazole", "Quetiapine", "Trazodone", "Citalopram", "Paroxetine", "Lorazepam"],
  antibiotic: ["Amoxicillin", "Azithromycin", "Ciprofloxacin", "Doxycycline", "Cephalexin", "Metronidazole", "Clindamycin", "Trimethoprim", "Levofloxacin", "Nitrofurantoin", "Erythromycin", "Penicillin"],
  allergy: ["Loratadine", "Cetirizine", "Fexofenadine", "Diphenhydramine", "Montelukast", "Fluticasone", "Hydroxyzine", "Promethazine", "Desloratadine", "Levocetirizine", "Chlorpheniramine", "Cromoglicic Acid"],
  gi: ["Omeprazole", "Pantoprazole", "Famotidine", "Ranitidine", "Esomeprazole", "Lansoprazole", "Sucralfate", "Metoclopramide", "Ondansetron", "Bismuth Subsalicylate", "Loperamide", "Docusate"],
  thyroid: ["Levothyroxine", "Liothyronine", "Methimazole", "Propylthiouracil", "Armour Thyroid"],
  respiratory: ["Albuterol", "Fluticasone", "Montelukast", "Budesonide", "Tiotropium", "Ipratropium", "Theophylline", "Prednisone", "Guaifenesin", "Dextromethorphan", "Benzonatate", "Pseudoephedrine"],
};

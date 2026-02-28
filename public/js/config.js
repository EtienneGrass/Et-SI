/* ============================================
   Et-SI — Configuration & Personas Data
   ============================================ */

window.ETSI = window.ETSI || {};

// API configuration for direct browser calls
window.ETSI.API_MODEL = 'claude-sonnet-4-5-20250929';
window.ETSI.API_MAX_TOKENS = 12000;

window.ETSI.PERSONAS = [
  { id:1,  nom:"Inès", profil:"Étudiante boursière", age:21, revenu:600, decile:"D1", loc:"Ville universitaire", color:"#6366f1" },
  { id:2,  nom:"Karim", profil:"Jeune actif CDI", age:28, revenu:2100, decile:"D5", loc:"Grande métropole", color:"#8b5cf6" },
  { id:3,  nom:"Nathalie", profil:"Ouvrière qualifiée", age:38, revenu:1650, decile:"D4", loc:"Périurbain industriel", color:"#ec4899" },
  { id:4,  nom:"Stéphane", profil:"Cadre intermédiaire", age:42, revenu:3200, decile:"D7", loc:"Métropole régionale", color:"#3b82f6" },
  { id:5,  nom:"Isabelle", profil:"Cadre supérieure", age:52, revenu:5500, decile:"D9", loc:"Paris", color:"#0ea5e9" },
  { id:6,  nom:"Jean-Marc", profil:"Artisan plombier", age:47, revenu:2800, decile:"D6", loc:"Ville moyenne", color:"#14b8a6" },
  { id:7,  nom:"Marie-Claire", profil:"Agricultrice", age:55, revenu:1400, decile:"D3", loc:"Zone rurale", color:"#22c55e" },
  { id:8,  nom:"Olivier", profil:"Médecin libéral", age:44, revenu:5000, decile:"D9", loc:"Ville moyenne", color:"#10b981" },
  { id:9,  nom:"Fatima", profil:"Fonctionnaire cat. C", age:33, revenu:1650, decile:"D3", loc:"Banlieue métropole", color:"#f43f5e" },
  { id:10, nom:"Claire", profil:"Enseignante (cat. A)", age:39, revenu:2300, decile:"D6", loc:"Métropole régionale", color:"#a855f7" },
  { id:11, nom:"Dylan", profil:"Intérimaire précaire", age:26, revenu:1100, decile:"D2", loc:"Petite ville", color:"#f97316" },
  { id:12, nom:"Sandra", profil:"Parent isolé aide-soignante", age:36, revenu:1750, decile:"D3", loc:"Banlieue ville moyenne", color:"#e11d48" },
  { id:13, nom:"Marcel", profil:"Retraité modeste", age:73, revenu:1100, decile:"D2", loc:"Zone rurale", color:"#78716c" },
  { id:14, nom:"Françoise", profil:"Retraitée aisée", age:68, revenu:3200, decile:"D8", loc:"Centre-ville métropole", color:"#0284c7" },
  { id:15, nom:"Philippe", profil:"Chômeur longue durée", age:49, revenu:900, decile:"D1", loc:"Périphérie ville moyenne", color:"#b45309" },
  { id:16, nom:"Amandine", profil:"Cheffe d'entreprise TPE", age:35, revenu:3500, decile:"D7", loc:"Métropole régionale", color:"#7c3aed" },
  { id:17, nom:"Sylvie & Bruno", profil:"Famille nombreuse", age:43, revenu:4200, decile:"D5", loc:"Périurbain", color:"#059669" },
  { id:18, nom:"Thomas", profil:"Handicap (AAH)", age:40, revenu:1050, decile:"D2", loc:"Ville moyenne", color:"#dc2626" },
  { id:19, nom:"Lucie", profil:"Travailleuse frontalière", age:34, revenu:4500, decile:"D8", loc:"Pays de Gex", color:"#2563eb" },
  { id:20, nom:"Sofiane", profil:"Auto-entrepreneur livreur", age:24, revenu:1200, decile:"D2", loc:"Banlieue métropole", color:"#ea580c" }
];

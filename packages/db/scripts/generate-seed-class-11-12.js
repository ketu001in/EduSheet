// Generates packages/db/src/seed_chunks/class_11_12_subjects.sql -- the
// subjects CBSE/ICSE Class 11 & 12 were still missing (only "Chemistry"
// existed for either board at either grade, added by an earlier, untracked
// change directly to production -- see schema.sql's comment about an
// "applied migration" not reproduced in this repo). Classes 11/12 and the
// CBSE/ICSE board rows already exist in the database, so unlike
// generate-seed.js's classBlock() (which creates fresh board/class rows),
// this looks both up by natural key (board code, grade_number) rather than
// creating/assuming fixed UUIDs, so it's safe to re-run anywhere.
//
// Run with: node packages/db/scripts/generate-seed-class-11-12.js
//
// Chapter/topic depth matches the existing Chemistry rows (9-14 real
// chapters, 3 real topics each) -- CBSE chapters are real NCERT chapter
// titles; ICSE chapters are real, standard CISCE/ISC syllabus topic areas
// (not claimed as exact Selina/Frank/publisher textbook chapter titles,
// which aren't something this script's author can verify precisely).
// Computer Science is deliberately excluded from both boards -- its chapter
// structure is far less standardized/publicly documented than the other
// ten subjects here.

const fs = require('fs');
const path = require('path');

function esc(s) {
  return String(s).replace(/'/g, "''");
}

// -- CBSE Class 11 & 12 (NCERT) -------------------------------------------

const CBSE_11 = {
  English: {
    code: 'ENGL11',
    chapters: [
      { title: 'The Portrait of a Lady', topics: ['Theme and central idea', 'Character and narrative voice', 'Literary devices and vocabulary'] },
      { title: "We're Not Afraid to Die... if We Can All Be Together", topics: ['Theme and central idea', 'Narrative structure and tone', 'Literary devices and vocabulary'] },
      { title: 'Discovering Tut: the Saga Continues', topics: ['Theme and central idea', 'Structure of an expository essay', 'Vocabulary in context'] },
      { title: 'Landscape of the Soul', topics: ['Theme and central idea', 'Comparative art criticism', 'Literary devices and vocabulary'] },
      { title: "The Ailing Planet: the Green Movement's Role", topics: ['Theme and central idea', 'Persuasive and argumentative writing', 'Vocabulary in context'] },
      { title: 'The Browning Version', topics: ['Plot and character development', 'Theme and central idea', 'Literary devices and vocabulary'] },
      { title: 'The Adventure', topics: ['Plot and narrative technique', 'Theme and central idea', 'Science-fiction conventions'] },
      { title: 'Silk Road', topics: ['Theme and central idea', 'Travel-writing structure', 'Vocabulary in context'] },
    ],
  },
  Mathematics: {
    code: 'MATH11',
    chapters: [
      { title: 'Sets', topics: ['Types of sets and operations', 'Venn diagrams', 'Practical problems on union and intersection'] },
      { title: 'Relations and Functions', topics: ['Cartesian product of sets', 'Relations as subsets', 'Functions and their domains'] },
      { title: 'Trigonometric Functions', topics: ['Angles and degree/radian measure', 'Trigonometric identities', 'Graphs of trigonometric functions'] },
      { title: 'Complex Numbers and Quadratic Equations', topics: ['Algebra of complex numbers', 'Argand plane and polar form', 'Quadratic equations with complex roots'] },
      { title: 'Linear Inequalities', topics: ['Algebraic solutions in one variable', 'Graphical solutions in two variables', 'Systems of linear inequalities'] },
      { title: 'Permutations and Combinations', topics: ['Fundamental principle of counting', 'Permutations', 'Combinations'] },
      { title: 'Binomial Theorem', topics: ['Binomial theorem for positive integers', "Pascal's triangle", 'General and middle terms'] },
      { title: 'Sequences and Series', topics: ['Arithmetic progressions', 'Geometric progressions', 'Relationship between A.M. and G.M.'] },
      { title: 'Straight Lines', topics: ['Slope of a line', 'Various forms of the line equation', 'Distance of a point from a line'] },
      { title: 'Limits and Derivatives', topics: ['Intuitive idea of limits', 'Limits of trigonometric functions', 'Derivatives from first principles'] },
    ],
  },
  Physics: {
    code: 'PHYS11',
    chapters: [
      { title: 'Physical World', topics: ['Scope and excitement of physics', 'Fundamental forces in nature', 'Nature of physical laws'] },
      { title: 'Units and Measurements', topics: ['The international system of units', 'Errors in measurement', 'Significant figures and dimensional analysis'] },
      { title: 'Motion in a Straight Line', topics: ['Position, path length and displacement', 'Velocity and acceleration', 'Kinematic equations for uniform acceleration'] },
      { title: 'Motion in a Plane', topics: ['Scalars and vectors', 'Vector addition and resolution', 'Projectile and circular motion'] },
      { title: 'Laws of Motion', topics: ["Newton's three laws", 'Conservation of momentum', 'Friction and circular motion dynamics'] },
      { title: 'Work, Energy and Power', topics: ['Work done by a constant/variable force', 'Kinetic and potential energy', 'Conservation of mechanical energy'] },
      { title: 'System of Particles and Rotational Motion', topics: ['Centre of mass', 'Torque and angular momentum', 'Moment of inertia'] },
      { title: 'Gravitation', topics: ["Kepler's laws", "Universal law of gravitation", 'Escape velocity and satellite motion'] },
      { title: 'Oscillations', topics: ['Periodic and simple harmonic motion', 'Simple pendulum and spring systems', 'Damped and forced oscillations'] },
      { title: 'Waves', topics: ['Transverse and longitudinal waves', 'Speed of a travelling wave', 'Superposition and standing waves'] },
    ],
  },
  Biology: {
    code: 'BIO11',
    chapters: [
      { title: 'The Living World', topics: ['Diversity in the living world', 'Taxonomic categories', 'Taxonomical aids'] },
      { title: 'Biological Classification', topics: ['Five kingdom classification', 'Kingdom Monera, Protista and Fungi', 'Viruses, viroids and lichens'] },
      { title: 'Plant Kingdom', topics: ['Algae, bryophytes and pteridophytes', 'Gymnosperms', 'Angiosperms and plant life cycles'] },
      { title: 'Animal Kingdom', topics: ['Basis of classification', 'Non-chordate phyla up to Echinodermata', 'Chordate classes'] },
      { title: 'Cell: The Unit of Life', topics: ['Cell theory', 'Prokaryotic and eukaryotic cells', 'Cell organelles'] },
      { title: 'Cell Cycle and Cell Division', topics: ['Phases of the cell cycle', 'Mitosis', 'Meiosis'] },
      { title: 'Photosynthesis in Higher Plants', topics: ['Light and dark reactions', "Calvin cycle (C3 pathway)", 'Factors affecting photosynthesis'] },
      { title: 'Respiration in Plants', topics: ['Glycolysis', 'Krebs cycle and electron transport', 'Respiratory quotient'] },
      { title: 'Human Physiology: Breathing and Exchange of Gases', topics: ['Respiratory organs', 'Mechanism of breathing', 'Exchange and transport of gases'] },
    ],
  },
  Economics: {
    code: 'ECON11',
    chapters: [
      { title: 'Introduction to Microeconomics', topics: ['Central problems of an economy', 'Positive and normative economics', 'Production possibility frontier'] },
      { title: 'Theory of Consumer Behaviour', topics: ['Utility analysis', 'Indifference curve analysis', 'Consumer equilibrium'] },
      { title: 'Production and Costs', topics: ['Production function', 'Short-run and long-run costs', 'Returns to a factor and scale'] },
      { title: 'The Theory of the Firm Under Perfect Competition', topics: ['Revenue concepts', "Firm's supply curve", 'Market equilibrium'] },
      { title: 'Market Competition', topics: ['Monopoly', 'Monopolistic competition', 'Oligopoly'] },
      { title: 'Indian Economy on the Eve of Independence', topics: ['Agricultural sector under colonial rule', 'Industrial sector and de-industrialisation', 'Demographic and occupational structure'] },
      { title: 'Indian Economy 1950-1990', topics: ['Goals of five year plans', 'Agricultural policy and green revolution', 'Industrial policy'] },
      { title: 'Liberalisation, Privatisation and Globalisation', topics: ['1991 economic reforms', 'LPG policies', 'Impact on different sectors'] },
    ],
  },
  Accountancy: {
    code: 'ACCT11',
    chapters: [
      { title: 'Introduction to Accounting', topics: ['Meaning and objectives of accounting', 'Basic accounting terms', 'Qualitative characteristics'] },
      { title: 'Theory Base of Accounting', topics: ['Generally accepted accounting principles', 'Accounting standards and Ind-AS', 'Accounting concepts and conventions'] },
      { title: 'Recording of Transactions - Journal', topics: ['Business transactions and source documents', 'Rules of debit and credit', 'Journal entries'] },
      { title: 'Recording of Transactions - Ledger', topics: ['Posting from journal to ledger', 'Balancing accounts', 'Trial balance'] },
      { title: 'Bank Reconciliation Statement', topics: ['Need for reconciliation', 'Causes of differences', 'Preparing a reconciliation statement'] },
      { title: 'Trial Balance and Rectification of Errors', topics: ['Preparation of trial balance', 'Types of errors', 'Suspense account'] },
      { title: 'Depreciation, Provisions and Reserves', topics: ['Straight line and written down value methods', 'Provisions', 'Types of reserves'] },
      { title: 'Financial Statements', topics: ['Trading and profit & loss account', 'Balance sheet', 'Adjustments in final accounts'] },
    ],
  },
  'Business Studies': {
    code: 'BSTD11',
    chapters: [
      { title: 'Nature and Purpose of Business', topics: ['Concept and characteristics of business', 'Business, profession and employment', 'Objectives of business'] },
      { title: 'Forms of Business Organisation', topics: ['Sole proprietorship and partnership', 'Joint Hindu family business', 'Cooperative societies and companies'] },
      { title: 'Private, Public and Global Enterprises', topics: ['Private and public sector enterprises', 'Forms of public sector organisation', 'Joint ventures and global enterprises'] },
      { title: 'Business Services', topics: ['Banking services', 'Insurance services', 'Communication and warehousing services'] },
      { title: 'Emerging Modes of Business', topics: ['E-business', 'Outsourcing', 'Business process outsourcing'] },
      { title: 'Social Responsibility of Business', topics: ['Concept of social responsibility', 'Business and environmental protection', 'Business ethics'] },
      { title: 'Formation of a Company', topics: ['Stages in company formation', 'Memorandum and articles of association', 'Prospectus'] },
    ],
  },
  History: {
    code: 'HIST11',
    chapters: [
      { title: 'From the Beginning of Time', topics: ['Early human evolution', 'Hunting-gathering societies', 'Transition to food production'] },
      { title: 'Writing and City Life', topics: ['Mesopotamian civilisation', 'Growth of cities', 'Development of writing systems'] },
      { title: 'An Empire Across Three Continents', topics: ['Roman empire\'s expansion', 'Political and economic institutions', 'Decline of the western empire'] },
      { title: 'Nomadic Empires', topics: ['Mongol society and economy', "Genghis Khan's conquests", 'Administration of the Mongol empire'] },
      { title: 'The Three Orders', topics: ['Feudal society in Europe', 'Role of the Church', 'Economic and social change'] },
      { title: 'Changing Cultural Traditions', topics: ['The Renaissance', 'Humanism and art', 'Scientific developments'] },
      { title: 'Confrontation of Cultures', topics: ['European voyages of exploration', 'Conquest of the Americas', 'Consequences of colonial encounters'] },
      { title: 'The Industrial Revolution', topics: ['Agricultural and technological change', 'Growth of factories', 'Social consequences of industrialisation'] },
    ],
  },
  'Political Science': {
    code: 'POLS11',
    chapters: [
      { title: 'Constitution: Why and How?', topics: ['Need for a constitution', 'Authority of a constitution', 'Making of the Indian Constitution'] },
      { title: 'Rights in the Indian Constitution', topics: ['Fundamental rights', 'Directive principles of state policy', 'Fundamental duties'] },
      { title: 'Election and Representation', topics: ['Need for elections', 'Electoral constituencies', 'Election Commission and reforms'] },
      { title: 'Executive', topics: ['Parliamentary and presidential executives', 'Powers of the Prime Minister', 'Civil services'] },
      { title: 'Legislature', topics: ['Need for a legislature', 'Composition of Parliament', 'Functions of Parliament'] },
      { title: 'Judiciary', topics: ['Independence of the judiciary', 'Structure of courts in India', 'Judicial review and activism'] },
      { title: 'Federalism', topics: ['Features of federalism', 'Centre-state relations', 'Decentralisation and local government'] },
      { title: 'Political Theory: An Introduction', topics: ['What is politics?', 'Political theory and its relevance', 'Concepts of freedom, equality and justice'] },
    ],
  },
  Geography: {
    code: 'GEOG11',
    chapters: [
      { title: 'Geography as a Discipline', topics: ['Branches of geography', 'Geography as an integrating discipline', 'Physical and human geography'] },
      { title: "The Origin and Evolution of the Earth", topics: ['Theories of the origin of the earth', 'Interior of the earth', 'Earth\'s crust composition'] },
      { title: 'Interior of the Earth', topics: ['Earthquakes and seismic waves', 'Structure of the earth', 'Earthquake hazards'] },
      { title: 'Distribution of Oceans and Continents', topics: ['Continental drift theory', 'Plate tectonic theory', 'Distribution of major landforms'] },
      { title: 'Landforms and their Evolution', topics: ['Geomorphic processes', 'Weathering and mass movements', 'Landform development cycles'] },
      { title: 'Composition and Structure of Atmosphere', topics: ['Composition of the atmosphere', 'Structure in layers', 'Weather and climate elements'] },
      { title: 'Water (Oceans)', topics: ['Relief of the ocean floor', 'Temperature and salinity of ocean water', 'Ocean currents and tides'] },
      { title: 'Life on the Earth', topics: ['Biosphere and ecosystems', 'Biodiversity', 'Ecological balance'] },
    ],
  },
};

const CBSE_12 = {
  English: {
    code: 'ENGL12',
    chapters: [
      { title: 'The Last Lesson', topics: ['Theme and central idea', 'Historical context and symbolism', 'Literary devices and vocabulary'] },
      { title: 'Lost Spring', topics: ['Theme and central idea', 'Social commentary', 'Vocabulary in context'] },
      { title: 'Deep Water', topics: ['Theme and central idea', 'Narrative technique and suspense', 'Literary devices and vocabulary'] },
      { title: 'The Rattrap', topics: ['Plot and character transformation', 'Theme and central idea', 'Literary devices and vocabulary'] },
      { title: 'Indigo', topics: ['Theme and central idea', 'Historical and political context', 'Vocabulary in context'] },
      { title: 'Poets and Pancakes', topics: ['Theme and tone', 'Satire and humour', 'Vocabulary in context'] },
      { title: 'The Interview', topics: ['Structure of an interview-based essay', 'Theme and central idea', 'Vocabulary in context'] },
      { title: 'Going Places', topics: ['Plot and character analysis', 'Theme and central idea', 'Literary devices and vocabulary'] },
    ],
  },
  Mathematics: {
    code: 'MATH12',
    chapters: [
      { title: 'Relations and Functions', topics: ['Types of relations', 'Types of functions', 'Composition and invertibility'] },
      { title: 'Inverse Trigonometric Functions', topics: ['Basic concepts', 'Properties of inverse trigonometric functions', 'Graphs and domains'] },
      { title: 'Matrices', topics: ['Types of matrices', 'Operations on matrices', 'Elementary row and column operations'] },
      { title: 'Determinants', topics: ['Properties of determinants', 'Area of a triangle', 'Adjoint and inverse of a matrix'] },
      { title: 'Continuity and Differentiability', topics: ['Continuity of a function', 'Differentiability and chain rule', 'Logarithmic differentiation'] },
      { title: 'Application of Derivatives', topics: ['Rate of change of quantities', 'Increasing and decreasing functions', 'Maxima and minima'] },
      { title: 'Integrals', topics: ['Integration as the inverse of differentiation', 'Methods of integration', 'Definite integrals'] },
      { title: 'Application of Integrals', topics: ['Area under simple curves', 'Area between two curves', 'Area bounded by a circle/parabola/ellipse'] },
      { title: 'Differential Equations', topics: ['Order and degree', 'Methods of solving first order equations', 'Applications of differential equations'] },
      { title: 'Vector Algebra', topics: ['Vectors and their types', 'Addition and scalar product of vectors', 'Dot and cross product'] },
      { title: 'Three Dimensional Geometry', topics: ['Direction cosines and ratios', 'Equation of a line in space', 'Equation of a plane'] },
      { title: 'Probability', topics: ['Conditional probability', "Bayes' theorem", 'Random variables and probability distribution'] },
    ],
  },
  Physics: {
    code: 'PHYS12',
    chapters: [
      { title: 'Electric Charges and Fields', topics: ['Coulomb\'s law', 'Electric field and field lines', "Gauss's law and applications"] },
      { title: 'Electrostatic Potential and Capacitance', topics: ['Electric potential and potential energy', 'Equipotential surfaces', 'Capacitors and dielectrics'] },
      { title: 'Current Electricity', topics: ["Ohm's law and resistivity", 'Combination of resistors', "Kirchhoff's laws and Wheatstone bridge"] },
      { title: 'Moving Charges and Magnetism', topics: ["Biot-Savart law", "Ampere's circuital law", 'Force on a moving charge in a magnetic field'] },
      { title: 'Magnetism and Matter', topics: ['Bar magnet as an equivalent solenoid', "Earth's magnetism", 'Magnetic properties of materials'] },
      { title: 'Electromagnetic Induction', topics: ["Faraday's laws", "Lenz's law", 'Self and mutual inductance'] },
      { title: 'Alternating Current', topics: ['AC voltage applied to resistors/inductors/capacitors', 'LCR circuits and resonance', 'Transformers'] },
      { title: 'Electromagnetic Waves', topics: ['Displacement current', 'Characteristics of electromagnetic waves', 'Electromagnetic spectrum'] },
      { title: 'Ray Optics and Optical Instruments', topics: ['Reflection and refraction', 'Lens formula and power', 'Optical instruments'] },
      { title: 'Wave Optics', topics: ["Huygens' principle", "Young's double slit experiment", 'Diffraction and polarisation'] },
      { title: 'Dual Nature of Radiation and Matter', topics: ['Photoelectric effect', "Einstein's photoelectric equation", 'de Broglie wavelength'] },
      { title: 'Atoms', topics: ["Rutherford's model", "Bohr model of the hydrogen atom", 'Line spectra'] },
    ],
  },
  Biology: {
    code: 'BIO12',
    chapters: [
      { title: 'Reproduction in Organisms', topics: ['Asexual and sexual reproduction', 'Modes of reproduction in organisms', 'Life cycles'] },
      { title: 'Sexual Reproduction in Flowering Plants', topics: ['Flower structure', 'Pollination and fertilisation', 'Seed and fruit formation'] },
      { title: 'Human Reproduction', topics: ['Male and female reproductive systems', 'Gametogenesis', 'Menstrual cycle and fertilisation'] },
      { title: 'Reproductive Health', topics: ['Reproductive health problems', 'Birth control methods', 'Infertility and assisted reproductive technologies'] },
      { title: 'Principles of Inheritance and Variation', topics: ["Mendel's laws of inheritance", 'Chromosomal theory of inheritance', 'Genetic disorders'] },
      { title: 'Molecular Basis of Inheritance', topics: ['DNA structure and replication', 'Transcription and translation', 'Gene regulation'] },
      { title: 'Evolution', topics: ['Origin of life', 'Evidence for evolution', 'Mechanisms of evolution'] },
      { title: 'Human Health and Disease', topics: ['Common diseases in humans', 'Immunity', 'AIDS and cancer'] },
      { title: 'Microbes in Human Welfare', topics: ['Microbes in household products', 'Microbes in industrial production', 'Microbes as biocontrol agents'] },
    ],
  },
  Economics: {
    code: 'ECON12',
    chapters: [
      { title: 'Introduction to Macroeconomics', topics: ['National income aggregates', 'Circular flow of income', 'Methods of calculating national income'] },
      { title: 'Money and Banking', topics: ['Functions of money', 'Central bank functions', 'Money creation by commercial banks'] },
      { title: 'Determination of Income and Employment', topics: ['Aggregate demand and supply', 'Investment multiplier', 'Problems of excess and deficient demand'] },
      { title: 'Government Budget and the Economy', topics: ['Components of government budget', 'Fiscal deficit and its implications', 'Types of taxes'] },
      { title: 'Balance of Payments', topics: ['Foreign exchange rate', 'Components of balance of payments', 'Determination of exchange rate'] },
      { title: 'Development Experience of India', topics: ['Economic development since 1947', 'Human capital formation', 'Rural development'] },
      { title: 'Employment and Poverty', topics: ['Formal and informal sectors', 'Poverty estimation', 'Employment generation schemes'] },
      { title: 'Comparative Development: India and its Neighbours', topics: ['Development strategies in India, China and Pakistan', 'Demographic indicators', 'Human development indicators'] },
    ],
  },
  Accountancy: {
    code: 'ACCT12',
    chapters: [
      { title: 'Accounting for Partnership Firms', topics: ['Partnership deed and features', 'Profit and loss appropriation account', "Partners' capital accounts"] },
      { title: 'Reconstitution of Partnership - Admission', topics: ['New profit sharing ratio', 'Goodwill valuation', 'Revaluation of assets and liabilities'] },
      { title: 'Reconstitution of Partnership - Retirement/Death', topics: ['Gaining ratio', 'Settlement of outgoing partner\'s dues', 'Adjustment of accumulated profits'] },
      { title: 'Dissolution of a Partnership Firm', topics: ['Settlement of accounts on dissolution', 'Realisation account', 'Insolvency of a partner'] },
      { title: 'Accounting for Share Capital', topics: ['Types of shares', 'Issue of shares at par/premium', 'Forfeiture and reissue of shares'] },
      { title: 'Issue and Redemption of Debentures', topics: ['Issue of debentures', 'Writing off discount/loss on issue', 'Redemption of debentures'] },
      { title: 'Financial Statements of a Company', topics: ['Format of company balance sheet', 'Statement of profit and loss', 'Notes to accounts'] },
      { title: 'Financial Statement Analysis', topics: ['Objectives and tools of analysis', 'Comparative and common size statements', 'Trend analysis'] },
      { title: 'Ratio Analysis', topics: ['Liquidity and solvency ratios', 'Activity ratios', 'Profitability ratios'] },
      { title: 'Cash Flow Statement', topics: ['Classification of activities', 'Operating activities (indirect method)', 'Investing and financing activities'] },
    ],
  },
  'Business Studies': {
    code: 'BSTD12',
    chapters: [
      { title: 'Nature and Significance of Management', topics: ['Concept and characteristics of management', 'Objectives and importance', 'Management as a science, art and profession'] },
      { title: 'Principles of Management', topics: ["Fayol's principles of management", "Taylor's scientific management", 'Significance of management principles'] },
      { title: 'Business Environment', topics: ['Concept and importance', 'Dimensions of business environment', 'Economic environment and government policy'] },
      { title: 'Planning', topics: ['Features and importance of planning', 'Planning process', 'Types of plans'] },
      { title: 'Organising', topics: ['Organisation structure', 'Formal and informal organisation', 'Delegation and decentralisation'] },
      { title: 'Staffing', topics: ['Staffing process', 'Recruitment and selection', 'Training and development'] },
      { title: 'Directing', topics: ['Elements of direction', 'Motivation theories', 'Leadership and communication'] },
      { title: 'Controlling', topics: ['Importance of controlling', 'Relationship between planning and controlling', 'Steps in the control process'] },
      { title: 'Financial Management', topics: ['Objectives of financial management', 'Financial planning', 'Capital structure decisions'] },
      { title: 'Marketing Management', topics: ['Marketing mix', 'Product and pricing decisions', 'Promotion and physical distribution'] },
    ],
  },
  History: {
    code: 'HIST12',
    chapters: [
      { title: 'Bricks, Beads and Bones: The Harappan Civilisation', topics: ['Harappan town planning', 'Craft and trade', 'Decline of the civilisation'] },
      { title: 'Kings, Farmers and Towns: Early States', topics: ['Mauryan administration', 'Early agrarian societies', 'Growth of towns and trade'] },
      { title: 'Kinship, Caste and Class: Early Societies', topics: ['Social structure in the Mahabharata', 'Varna and jati', 'Marriage and kinship rules'] },
      { title: 'Thinkers, Beliefs and Buildings: Religious Traditions', topics: ['Buddhism and Jainism', 'Stupas and their significance', 'Bhakti and Sufi traditions'] },
      { title: 'Through the Eyes of Travellers', topics: ['Al-Biruni\'s account of India', 'Ibn Battuta\'s travels', 'Bernier\'s observations'] },
      { title: 'Bhakti-Sufi Traditions', topics: ['Bhakti movements across regions', 'Sufi silsilas', 'Religious synthesis'] },
      { title: 'An Imperial Capital: Vijayanagara', topics: ['City of Vijayanagara', 'Political structure', 'Religion and architecture'] },
      { title: 'Peasants, Zamindars and the State: Mughal Empire', topics: ['Agricultural production', 'Village society', 'Zamindars and the Mughal state'] },
      { title: 'Colonialism and the Countryside', topics: ['Permanent settlement in Bengal', 'Ryotwari and mahalwari systems', 'Agrarian relations'] },
      { title: "Framing the Constitution", topics: ['Constituent Assembly debates', 'Making of the Indian Constitution', 'Key constitutional provisions'] },
    ],
  },
  'Political Science': {
    code: 'POLS12',
    chapters: [
      { title: 'The Cold War Era', topics: ['Origins of the Cold War', 'Non-Aligned Movement', 'End of bipolarity'] },
      { title: 'The End of Bipolarity', topics: ['Disintegration of the Soviet Union', 'Shock therapy in post-communist regimes', "India's relations with Russia"] },
      { title: 'US Hegemony in World Politics', topics: ["Nature of US power", 'Iraq war', 'Critiques of US hegemony'] },
      { title: 'Alternative Centres of Power', topics: ['European Union', 'ASEAN', 'Rise of China'] },
      { title: 'Contemporary South Asia', topics: ['Processes of democratisation', 'Conflicts and cooperation in South Asia', "India's role in the region"] },
      { title: 'International Organisations', topics: ['Role of the United Nations', 'UN Security Council reform', 'Humanitarian intervention'] },
      { title: 'Security in the Contemporary World', topics: ['Traditional and non-traditional security', 'Terrorism', 'Human security'] },
      { title: 'Environment and Natural Resources', topics: ['Global environmental negotiations', 'Common but differentiated responsibilities', 'Resource geopolitics'] },
      { title: 'Challenges of Nation Building', topics: ["India's partition", "Integration of princely states", 'Reorganisation of states'] },
      { title: 'Era of One-Party Dominance', topics: ['First three general elections', 'Nature of Congress dominance', 'Nature of opposition'] },
    ],
  },
  Geography: {
    code: 'GEOG12',
    chapters: [
      { title: 'Human Geography: Nature and Scope', topics: ['Nature of human geography', 'Human-environment relationship', 'Fields of human geography'] },
      { title: 'The World Population: Distribution, Density and Growth', topics: ['Patterns of population distribution', 'Factors influencing density', 'Components of population growth'] },
      { title: 'Population Composition', topics: ['Age-sex composition', 'Rural-urban composition', 'Literacy and occupational structure'] },
      { title: 'Human Development', topics: ['Concept of human development', 'Indicators of human development', 'Human development index'] },
      { title: 'Primary Activities', topics: ['Hunting and gathering', 'Subsistence and commercial farming', 'Mining activities'] },
      { title: 'Secondary Activities', topics: ['Manufacturing types', 'Industrial location factors', 'Major industrial regions'] },
      { title: 'Tertiary and Quaternary Activities', topics: ['Trade and transport services', 'Tourism', 'Quaternary and quinary activities'] },
      { title: 'Transport and Communication', topics: ['Modes of transportation', 'International trade', 'Communication and trade routes'] },
      { title: 'Human Settlements', topics: ['Rural settlement patterns', 'Urban settlement classification', 'Problems of urban settlements'] },
    ],
  },
};

// -- ICSE Class 11 & 12 (CISCE/ISC) ----------------------------------------
// Real, standard ISC syllabus topic areas -- not claimed as exact
// publisher textbook chapter titles.

const ICSE_11 = {
  English: {
    code: 'ENGL11I',
    chapters: [
      { title: 'Prose: Expository and Narrative Essays', topics: ['Theme and central idea', 'Structure and tone', 'Vocabulary in context'] },
      { title: 'Drama Set Text', topics: ['Plot and character development', 'Thematic analysis', 'Dramatic devices'] },
      { title: 'Poetry Appraisal', topics: ['Theme and imagery', 'Poetic devices and form', 'Critical appreciation'] },
      { title: 'Novel/Rapid Reader', topics: ['Plot and character analysis', 'Narrative technique', 'Theme and social context'] },
      { title: 'Composition and Comprehension', topics: ['Directed and discursive writing', 'Précis writing', 'Comprehension skills'] },
      { title: 'Grammar and Usage', topics: ['Tenses and voice', 'Clauses and sentence structure', 'Vocabulary building'] },
    ],
  },
  Mathematics: {
    code: 'MATH11I',
    chapters: [
      { title: 'Sets, Relations and Functions', topics: ['Types of sets and operations', 'Relations as subsets', 'Functions and domains'] },
      { title: 'Complex Numbers', topics: ['Algebra of complex numbers', 'Argand plane', 'Polar and Euler form'] },
      { title: 'Sequences and Series', topics: ['Arithmetic and geometric progressions', 'Sum of special series', 'Arithmetico-geometric series'] },
      { title: 'Permutations and Combinations', topics: ['Fundamental counting principle', 'Permutations', 'Combinations'] },
      { title: 'Binomial Theorem', topics: ['Binomial expansion', 'General term', 'Properties of binomial coefficients'] },
      { title: 'Trigonometry', topics: ['Trigonometric ratios and identities', 'Compound and multiple angles', 'General solutions of equations'] },
      { title: 'Straight Lines and Conic Sections', topics: ['Forms of the straight line', 'Circles, parabolas and ellipses', 'Hyperbola'] },
      { title: 'Limits, Continuity and Differentiability', topics: ['Intuitive idea of limits', 'Continuity of a function', 'Differentiation from first principles'] },
      { title: 'Statistics and Probability', topics: ['Measures of dispersion', 'Conditional probability', 'Bayes theorem'] },
    ],
  },
  Physics: {
    code: 'PHYS11I',
    chapters: [
      { title: 'Physical Quantities and Measurement', topics: ['Units and dimensions', 'Errors in measurement', 'Significant figures'] },
      { title: 'Motion in One and Two Dimensions', topics: ['Equations of uniformly accelerated motion', 'Vector resolution', 'Projectile motion'] },
      { title: 'Laws of Motion and Friction', topics: ["Newton's laws", 'Friction and its laws', 'Circular motion dynamics'] },
      { title: 'Work, Power and Energy', topics: ['Work-energy theorem', 'Conservation of energy', 'Collisions'] },
      { title: 'Rotational Mechanics', topics: ['Torque and angular momentum', 'Moment of inertia', 'Rolling motion'] },
      { title: 'Gravitation', topics: ["Kepler's laws", 'Gravitational potential and field', 'Satellites and escape velocity'] },
      { title: 'Properties of Matter', topics: ['Elasticity', 'Surface tension', 'Viscosity and fluid flow'] },
      { title: 'Heat and Thermodynamics', topics: ['Kinetic theory of gases', 'Laws of thermodynamics', 'Heat transfer mechanisms'] },
      { title: 'Oscillations and Waves', topics: ['Simple harmonic motion', 'Wave motion and speed', 'Superposition of waves'] },
    ],
  },
  Biology: {
    code: 'BIO11I',
    chapters: [
      { title: 'Diversity of Living Organisms', topics: ['Taxonomic hierarchy', 'Five kingdom classification', 'Binomial nomenclature'] },
      { title: 'Plant Kingdom', topics: ['Algae, bryophytes and pteridophytes', 'Gymnosperms and angiosperms', 'Plant life cycles'] },
      { title: 'Animal Kingdom', topics: ['Non-chordate phyla', 'Chordate classes', 'Basis of classification'] },
      { title: 'Cell Biology', topics: ['Cell structure and organelles', 'Cell division', 'Biomolecules'] },
      { title: 'Plant Physiology', topics: ['Photosynthesis', 'Respiration in plants', 'Plant growth and hormones'] },
      { title: 'Human Physiology: Digestion and Respiration', topics: ['Digestive system', 'Respiratory system', 'Mechanism of breathing'] },
      { title: 'Human Physiology: Circulation and Excretion', topics: ['Circulatory system', 'Excretory system', 'Osmoregulation'] },
      { title: 'Ecology', topics: ['Ecosystem structure and function', 'Energy flow and nutrient cycling', 'Biodiversity and conservation'] },
    ],
  },
  Economics: {
    code: 'ECON11I',
    chapters: [
      { title: 'Introduction to Economics', topics: ['Central problems of an economy', 'Scarcity and choice', 'Production possibility curve'] },
      { title: 'Theory of Demand and Supply', topics: ['Law of demand and elasticity', 'Law of supply and elasticity', 'Market equilibrium'] },
      { title: 'Theory of Production and Cost', topics: ['Production function', 'Law of variable proportions', 'Cost curves'] },
      { title: 'Forms of Market', topics: ['Perfect competition', 'Monopoly and monopolistic competition', 'Oligopoly'] },
      { title: 'National Income Accounting', topics: ['Concepts of national income', 'Methods of measurement', 'Circular flow of income'] },
      { title: 'Money and Banking', topics: ['Functions of money', 'Commercial and central banking', 'Credit creation'] },
    ],
  },
  Accounts: {
    code: 'ACCT11I',
    chapters: [
      { title: 'Introduction to Accounting', topics: ['Meaning, scope and objectives', 'Basic accounting terms', 'Accounting principles'] },
      { title: 'Books of Original Entry', topics: ['Journal entries', 'Subsidiary books', 'Cash book'] },
      { title: 'Ledger and Trial Balance', topics: ['Posting to the ledger', 'Balancing accounts', 'Preparing a trial balance'] },
      { title: 'Bank Reconciliation Statement', topics: ['Causes of differences', 'Preparing a reconciliation statement', 'Adjusting cash book balance'] },
      { title: 'Rectification of Errors', topics: ['Types of errors', 'Suspense account', 'Effect on trial balance'] },
      { title: 'Depreciation Accounting', topics: ['Straight line method', 'Written down value method', 'Accounting treatment'] },
      { title: 'Final Accounts of Sole Proprietors', topics: ['Trading account', 'Profit and loss account', 'Balance sheet'] },
    ],
  },
  Commerce: {
    code: 'COMM11I',
    chapters: [
      { title: 'Introduction to Commerce', topics: ['Meaning and scope of commerce', 'Trade, aids to trade and industry', 'Commerce and economic development'] },
      { title: 'Forms of Business Organisation', topics: ['Sole proprietorship and partnership', 'Joint stock company', 'Cooperative organisation'] },
      { title: 'Sources of Business Finance', topics: ['Owned and borrowed capital', 'Short-term and long-term sources', 'Capital market instruments'] },
      { title: 'Internal Trade', topics: ['Wholesale and retail trade', 'Departmental stores and chain stores', 'E-retailing'] },
      { title: 'International Trade', topics: ['Export and import procedure', 'Documents in foreign trade', 'Role of trade organisations'] },
      { title: 'Business Services', topics: ['Banking and insurance services', 'Warehousing', 'Communication services'] },
    ],
  },
  History: {
    code: 'HIST11I',
    chapters: [
      { title: 'Establishment of British Rule in India', topics: ['Expansion of British power', 'Subsidiary alliance and doctrine of lapse', 'Administrative consolidation'] },
      { title: 'The Revolt of 1857', topics: ['Causes of the revolt', 'Course of the rebellion', 'Consequences and aftermath'] },
      { title: 'Economic Impact of British Rule', topics: ['Deindustrialisation', 'Land revenue systems', 'Drain of wealth theory'] },
      { title: 'Socio-Religious Reform Movements', topics: ['Brahmo Samaj and Arya Samaj', 'Aligarh movement', 'Social reform legislation'] },
      { title: 'Rise of Indian Nationalism', topics: ['Factors leading to nationalism', 'Formation of the Indian National Congress', 'Early nationalist demands'] },
      { title: 'The French Revolution', topics: ['Causes of the revolution', 'Course of the revolution', 'Impact on Europe'] },
    ],
  },
  'Political Science': {
    code: 'POLS11I',
    chapters: [
      { title: 'Meaning and Scope of Political Science', topics: ['Nature and scope', 'Relationship with other disciplines', 'Approaches to political science'] },
      { title: 'The State', topics: ['Elements of the state', 'Theories of origin of the state', 'State and government distinguished'] },
      { title: 'Sovereignty', topics: ['Meaning and kinds', 'Monistic and pluralistic theories', 'Austin\'s theory of sovereignty'] },
      { title: 'Forms of Government', topics: ['Unitary and federal governments', 'Parliamentary and presidential systems', 'Democracy and its forms'] },
      { title: 'Organs of Government', topics: ['Legislature', 'Executive', 'Judiciary'] },
      { title: 'Citizenship', topics: ['Meaning of citizenship', 'Modes of acquiring citizenship', 'Rights and duties of citizens'] },
    ],
  },
  Geography: {
    code: 'GEOG11I',
    chapters: [
      { title: 'The Earth as a Planet', topics: ['Origin of the earth', 'Earth movements', 'Latitude and longitude'] },
      { title: 'Interior of the Earth and Rocks', topics: ['Structure of the earth', 'Types of rocks', 'Rock cycle'] },
      { title: 'Landforms: Weathering and Erosion', topics: ['Weathering processes', 'Fluvial landforms', 'Glacial and arid landforms'] },
      { title: 'Climatology', topics: ['Atmospheric composition and structure', 'Insolation and temperature', 'Atmospheric pressure and winds'] },
      { title: 'Oceanography', topics: ['Relief of the ocean floor', 'Ocean currents', 'Tides and salinity'] },
      { title: 'Map Work and Practical Geography', topics: ['Topographical map interpretation', 'Contour representation', 'Statistical map work'] },
    ],
  },
};

const ICSE_12 = {
  English: {
    code: 'ENGL12I',
    chapters: [
      { title: 'Prose: Expository and Reflective Essays', topics: ['Theme and central idea', 'Structure and tone', 'Vocabulary in context'] },
      { title: 'Drama Set Text', topics: ['Plot and character development', 'Thematic analysis', 'Dramatic devices'] },
      { title: 'Poetry Appraisal', topics: ['Theme and imagery', 'Poetic devices and form', 'Critical appreciation'] },
      { title: 'Novel/Rapid Reader', topics: ['Plot and character analysis', 'Narrative technique', 'Theme and social context'] },
      { title: 'Composition and Comprehension', topics: ['Directed and discursive writing', 'Précis writing', 'Comprehension skills'] },
      { title: 'Grammar and Usage', topics: ['Advanced sentence structure', 'Reported speech and voice', 'Vocabulary building'] },
    ],
  },
  Mathematics: {
    code: 'MATH12I',
    chapters: [
      { title: 'Relations and Functions', topics: ['Types of relations', 'Types of functions', 'Composition and invertibility'] },
      { title: 'Inverse Trigonometric Functions', topics: ['Basic concepts', 'Properties', 'Graphs and domains'] },
      { title: 'Matrices and Determinants', topics: ['Operations on matrices', 'Properties of determinants', 'Inverse of a matrix'] },
      { title: 'Continuity, Differentiability and Applications', topics: ['Continuity of a function', 'Chain rule', 'Maxima and minima'] },
      { title: 'Integrals and Applications', topics: ['Methods of integration', 'Definite integrals', 'Area under curves'] },
      { title: 'Differential Equations', topics: ['Order and degree', 'Solving first order equations', 'Applications'] },
      { title: 'Vectors and Three-Dimensional Geometry', topics: ['Vector algebra', 'Equation of a line in space', 'Equation of a plane'] },
      { title: 'Probability', topics: ['Conditional probability', "Bayes' theorem", 'Probability distributions'] },
    ],
  },
  Physics: {
    code: 'PHYS12I',
    chapters: [
      { title: 'Electrostatics', topics: ["Coulomb's law", 'Electric field and potential', "Gauss's law"] },
      { title: 'Current Electricity', topics: ["Ohm's law", 'Combination of resistors', "Kirchhoff's laws"] },
      { title: 'Magnetism and Magnetic Effects of Current', topics: ["Biot-Savart law", "Ampere's law", 'Force on a moving charge'] },
      { title: 'Electromagnetic Induction and AC', topics: ["Faraday's laws", 'Self and mutual inductance', 'Alternating current circuits'] },
      { title: 'Electromagnetic Waves and Optics', topics: ['Electromagnetic spectrum', 'Reflection and refraction', "Young's double slit experiment"] },
      { title: 'Dual Nature of Matter and Atoms', topics: ['Photoelectric effect', 'de Broglie wavelength', "Bohr's model of the atom"] },
      { title: 'Nuclei and Semiconductor Devices', topics: ['Nuclear binding energy', 'Radioactivity', 'Semiconductor diodes and transistors'] },
    ],
  },
  Biology: {
    code: 'BIO12I',
    chapters: [
      { title: 'Reproduction', topics: ['Reproduction in plants', 'Human reproductive system', 'Reproductive health'] },
      { title: 'Genetics and Evolution', topics: ["Mendel's laws", 'Molecular basis of inheritance', 'Theories of evolution'] },
      { title: 'Biology and Human Welfare', topics: ['Human health and disease', 'Immunity', 'Microbes in human welfare'] },
      { title: 'Biotechnology', topics: ['Principles of biotechnology', 'Genetic engineering tools', 'Applications of biotechnology'] },
      { title: 'Ecology and Environment', topics: ['Organisms and populations', 'Ecosystems', 'Environmental issues'] },
    ],
  },
  Economics: {
    code: 'ECON12I',
    chapters: [
      { title: 'Macroeconomics: An Introduction', topics: ['National income aggregates', 'Circular flow of income', 'Methods of estimation'] },
      { title: 'Money and Banking', topics: ['Functions of money', 'Central bank functions', 'Credit control measures'] },
      { title: 'Income Determination', topics: ['Aggregate demand and supply', 'Investment multiplier', 'Excess and deficient demand'] },
      { title: 'Government Budget', topics: ['Components of the budget', 'Fiscal deficit', 'Taxation'] },
      { title: 'Balance of Payments', topics: ['Foreign exchange rate', 'Components of BoP', 'Determination of exchange rate'] },
      { title: "India's Economic Development", topics: ['Economic reforms since 1991', 'Human capital formation', 'Sustainable development'] },
    ],
  },
  Accounts: {
    code: 'ACCT12I',
    chapters: [
      { title: 'Partnership Accounts: Fundamentals', topics: ['Partnership deed', 'Profit and loss appropriation', "Partners' capital accounts"] },
      { title: 'Reconstitution of Partnership', topics: ['Admission of a partner', 'Retirement and death of a partner', 'Goodwill valuation'] },
      { title: 'Dissolution of Partnership', topics: ['Realisation account', 'Settlement of accounts', 'Insolvency of partners'] },
      { title: 'Company Accounts: Shares', topics: ['Issue of shares', 'Forfeiture and reissue', 'Types of share capital'] },
      { title: 'Company Accounts: Debentures', topics: ['Issue of debentures', 'Writing off discount/loss', 'Redemption of debentures'] },
      { title: 'Financial Statement Analysis', topics: ['Comparative and common-size statements', 'Ratio analysis', 'Trend analysis'] },
      { title: 'Cash Flow Statement', topics: ['Operating, investing and financing activities', 'Indirect method', 'Preparation of the statement'] },
    ],
  },
  Commerce: {
    code: 'COMM12I',
    chapters: [
      { title: 'Nature and Significance of Management', topics: ['Concept and characteristics', 'Management as science, art and profession', 'Levels of management'] },
      { title: 'Principles of Management', topics: ["Fayol's principles", "Taylor's scientific management", 'Significance of principles'] },
      { title: 'Business Environment', topics: ['Dimensions of business environment', 'Economic environment', 'Government policy changes'] },
      { title: 'Planning and Organising', topics: ['Planning process', 'Organisation structure', 'Delegation and decentralisation'] },
      { title: 'Staffing and Directing', topics: ['Recruitment and selection', 'Training and development', 'Motivation and leadership'] },
      { title: 'Controlling', topics: ['Importance of controlling', 'Control process', 'Techniques of control'] },
      { title: 'Financial and Marketing Management', topics: ['Financial planning', 'Capital structure', 'Marketing mix'] },
    ],
  },
  History: {
    code: 'HIST12I',
    chapters: [
      { title: 'Nationalist Movement 1905-1918', topics: ['Partition of Bengal', 'Swadeshi movement', 'Formation of the Muslim League'] },
      { title: "Gandhian Era", topics: ['Non-cooperation movement', 'Civil disobedience movement', 'Quit India movement'] },
      { title: 'Constitutional Developments', topics: ['Government of India Act 1935', 'Cripps Mission', 'Cabinet Mission Plan'] },
      { title: 'Partition and Independence', topics: ['Mountbatten Plan', 'Communal politics', 'Transfer of power'] },
      { title: 'India After Independence', topics: ['Integration of princely states', 'Making of the Constitution', 'Linguistic reorganisation of states'] },
      { title: 'The World Wars', topics: ['Causes of the First World War', 'Treaty of Versailles', 'Causes and course of the Second World War'] },
      { title: 'The United Nations and Cold War', topics: ['Formation of the UN', 'Origins of the Cold War', 'Non-Aligned Movement'] },
    ],
  },
  'Political Science': {
    code: 'POLS12I',
    chapters: [
      { title: 'The Indian Constitution', topics: ['Salient features', 'Preamble', 'Fundamental rights and duties'] },
      { title: 'Union Executive', topics: ['President and Vice-President', 'Prime Minister and Council of Ministers', 'Powers and functions'] },
      { title: 'Union Legislature', topics: ['Composition of Parliament', 'Legislative procedure', 'Parliamentary committees'] },
      { title: 'Judiciary', topics: ['Supreme Court composition and powers', 'Judicial review', 'Public interest litigation'] },
      { title: 'State Government', topics: ['Governor and Council of Ministers', 'State legislature', 'Centre-state relations'] },
      { title: 'International Relations', topics: ["India's foreign policy", 'United Nations and its organs', 'Regional organisations'] },
    ],
  },
  Geography: {
    code: 'GEOG12I',
    chapters: [
      { title: 'India: Location and Physical Features', topics: ['Location and extent', 'Physiographic divisions', 'Drainage systems'] },
      { title: 'Climate of India', topics: ['Factors affecting climate', 'Monsoon mechanism', 'Climatic regions'] },
      { title: 'Natural Vegetation and Soils', topics: ['Vegetation types', 'Soil classification', 'Soil conservation'] },
      { title: 'Population of India', topics: ['Distribution and density', 'Growth and composition', 'Migration patterns'] },
      { title: 'Agriculture in India', topics: ['Cropping patterns', 'Major crops', 'Agricultural challenges'] },
      { title: 'Mineral and Energy Resources', topics: ['Metallic and non-metallic minerals', 'Conventional energy sources', 'Non-conventional energy sources'] },
      { title: 'Manufacturing Industries', topics: ['Industrial location factors', 'Major industrial regions', 'Industrial policy'] },
      { title: 'Transport and Trade', topics: ['Transport networks', 'Trade patterns', 'Trade routes'] },
    ],
  },
};

// -- SQL generation ---------------------------------------------------------

function boardLookup(varName, code) {
  return `  SELECT id INTO ${varName} FROM public.boards WHERE code = '${esc(code)}';\n`;
}

function classLookup(varName, grade) {
  return `  SELECT id INTO ${varName} FROM public.classes WHERE grade_number = ${grade} AND board_id IS NULL;\n`;
}

function subjectsBlock(boardVar, classVar, subjectsData) {
  let sql = '';
  for (const [name, data] of Object.entries(subjectsData)) {
    sql += `  INSERT INTO public.subjects (id, class_id, board_id, name, code)\n`;
    sql += `  VALUES (gen_random_uuid(), ${classVar}, ${boardVar}, '${esc(name)}', '${esc(data.code)}')\n`;
    sql += `  ON CONFLICT (class_id, board_id, name) DO UPDATE SET code = EXCLUDED.code\n`;
    sql += `  RETURNING id INTO v_subj_id;\n\n`;

    data.chapters.forEach((chapter, idx) => {
      const chapterNum = idx + 1;
      sql += `  INSERT INTO public.chapters (id, subject_id, chapter_number, title)\n`;
      sql += `  VALUES (gen_random_uuid(), v_subj_id, ${chapterNum}, '${esc(chapter.title)}')\n`;
      sql += `  ON CONFLICT (subject_id, chapter_number) DO UPDATE SET title = EXCLUDED.title\n`;
      sql += `  RETURNING id INTO v_chap_id;\n\n`;

      const topicValues = chapter.topics
        .map((t, i) => `(gen_random_uuid(), v_chap_id, ${i + 1}, '${esc(t)}')`)
        .join(', ');
      sql += `  INSERT INTO public.topics (id, chapter_id, topic_number, title)\n`;
      sql += `  VALUES ${topicValues}\n`;
      sql += `  ON CONFLICT (chapter_id, topic_number) DO UPDATE SET title = EXCLUDED.title;\n\n`;
    });
  }
  return sql;
}

function gradeBlock(grade, cbseSubjects, icseSubjects) {
  let sql = `-- Class ${grade} ------------------------------------------------------------\n`;
  sql += `DO $$\n`;
  sql += `DECLARE\n`;
  sql += `  v_board_cbse UUID;\n`;
  sql += `  v_board_icse UUID;\n`;
  sql += `  v_class_id UUID;\n`;
  sql += `  v_subj_id UUID;\n`;
  sql += `  v_chap_id UUID;\n`;
  sql += `BEGIN\n`;
  sql += boardLookup('v_board_cbse', 'CBSE');
  sql += boardLookup('v_board_icse', 'ICSE');
  sql += classLookup('v_class_id', grade);
  sql += '\n';
  sql += `  -- CBSE subjects\n`;
  sql += subjectsBlock('v_board_cbse', 'v_class_id', cbseSubjects);
  sql += `  -- ICSE subjects\n`;
  sql += subjectsBlock('v_board_icse', 'v_class_id', icseSubjects);
  sql += `END $$;\n\n`;
  return sql;
}

let fullSql = '-- Auto-generated by generate-seed-class-11-12.js -- do not edit by hand.\n';
fullSql += '-- Adds the subjects/chapters/topics CBSE and ICSE Class 11 & 12 were still\n';
fullSql += '-- missing (only "Chemistry" existed for either board at either grade).\n';
fullSql += '-- Classes 11/12 and the CBSE/ICSE board rows already exist in the database\n';
fullSql += '-- (added outside this repo) -- this looks both up by natural key rather\n';
fullSql += '-- than assuming fixed UUIDs, so it is safe to run against any environment\n';
fullSql += '-- that already has Class 11/12 and CBSE/ICSE board rows.\n\n';
fullSql += gradeBlock(11, CBSE_11, ICSE_11);
fullSql += gradeBlock(12, CBSE_12, ICSE_12);

const outPath = path.join(__dirname, '..', 'src', 'seed_chunks', 'class_11_12_subjects.sql');
fs.writeFileSync(outPath, fullSql, 'utf8');
console.log(`Wrote ${outPath} (${fullSql.length} bytes)`);

// Also emit one small, self-contained file per (board, grade, subject), so
// each can be applied individually (e.g. via an MCP tool with a practical
// per-call size limit) without needing the ~200KB combined file in one shot.
// Scratch output only -- not part of the committed seed chunks.
function perSubjectFiles(grade, boardVar, boardCode, subjectsData) {
  const outDir = path.join(__dirname, '..', '..', '..', '.scratch-seed-chunks');
  fs.mkdirSync(outDir, { recursive: true });
  let i = 0;
  for (const [name, data] of Object.entries(subjectsData)) {
    i += 1;
    const safeName = name.replace(/[^a-zA-Z0-9]+/g, '_');
    const fname = `g${grade}_${boardCode}_${String(i).padStart(2, '0')}_${safeName}.sql`;
    let sql = `DO $$\nDECLARE\n  v_board UUID;\n  v_class_id UUID;\n  v_subj_id UUID;\n  v_chap_id UUID;\nBEGIN\n`;
    sql += `  SELECT id INTO v_board FROM public.boards WHERE code = '${esc(boardCode)}';\n`;
    sql += `  SELECT id INTO v_class_id FROM public.classes WHERE grade_number = ${grade} AND board_id IS NULL;\n\n`;
    sql += subjectsBlock('v_board', 'v_class_id', { [name]: data });
    sql += `END $$;\n`;
    fs.writeFileSync(path.join(outDir, fname), sql, 'utf8');
  }
}

perSubjectFiles(11, null, 'CBSE', CBSE_11);
perSubjectFiles(11, null, 'ICSE', ICSE_11);
perSubjectFiles(12, null, 'CBSE', CBSE_12);
perSubjectFiles(12, null, 'ICSE', ICSE_12);
console.log('Wrote per-subject scratch files to packages/.scratch-seed-chunks');

import { EvaluationResult } from '../types';

export interface SampleExamPaper {
  id: string;
  title: string;
  subject: string;
  studentName: string;
  studentRoll: string;
  filename: string;
  description: string;
  result: EvaluationResult;
  svgPreview: string;
}

export const SAMPLE_EXAM_PAPERS: SampleExamPaper[] = [
  {
    id: 'cs-os-ds',
    title: 'Computer Science: Operating Systems & Data Structures',
    subject: 'Computer Science & Engineering',
    studentName: 'Dhanush S.',
    studentRoll: 'CS2026-8841',
    filename: 'CS_MidTerm_Exam_Sheet_01.jpg',
    description: 'Midterm descriptive answers covering Virtual Memory, Paging, and Binary Search Trees.',
    svgPreview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850"><rect width="100%" height="100%" fill="%23fdfaf4"/><line x1="60" y1="0" x2="60" y2="850" stroke="%23ff9b9b" stroke-width="2"/><g stroke="%23d6e4ff" stroke-width="1.2">' +
      Array.from({ length: 30 }, (_, i) => `<line x1="0" y1="${80 + i * 25}" x2="600" y2="${80 + i * 25}"/>`).join('') +
      '</g><text x="75" y="65" font-family="cursive, serif" font-size="14" fill="%231e3a8a">Roll No: CS2026-8841 | Student: Dhanush S. | Subject: OS &amp; DS</text>' +
      '<text x="75" y="100" font-family="cursive, sans-serif" font-size="15" font-weight="bold" fill="%230f172a">Q1. Explain Virtual Memory and the concept of Page Fault.</text>' +
      '<text x="75" y="125" font-family="cursive, sans-serif" font-size="13" fill="%232563eb">Ans: Virtual memory is a memory management capability of an OS that uses</text>' +
      '<text x="75" y="150" font-family="cursive, sans-serif" font-size="13" fill="%232563eb">hardware and software to allow a computer to address more memory than is physically</text>' +
      '<text x="75" y="175" font-family="cursive, sans-serif" font-size="13" fill="%232563eb">present. It maps virtual addresses into physical addresses in RAM or swap space.</text>' +
      '<text x="75" y="200" font-family="cursive, sans-serif" font-size="13" fill="%232563eb">A page fault happens when a program accesses a memory page not currently mapped in RAM.</text>' +
      '<text x="75" y="275" font-family="cursive, sans-serif" font-size="15" font-weight="bold" fill="%230f172a">Q2. What is a Binary Search Tree (BST) and explain its worst-case search complexity.</text>' +
      '<text x="75" y="300" font-family="cursive, sans-serif" font-size="13" fill="%232563eb">Ans: A BST is a rooted binary tree where the left subtree contains keys smaller</text>' +
      '<text x="75" y="325" font-family="cursive, sans-serif" font-size="13" fill="%232563eb">than the node key, and the right subtree contains keys greater. In a balanced BST,</text>' +
      '<text x="75" y="350" font-family="cursive, sans-serif" font-size="13" fill="%232563eb">search takes O(log n). But in the worst case (skewed tree), search degrades to O(n).</text>' +
      '<text x="75" y="425" font-family="cursive, sans-serif" font-size="15" font-weight="bold" fill="%230f172a">Q3. Differentiate between Preemptive and Non-Preemptive Scheduling.</text>' +
      '<text x="75" y="450" font-family="cursive, sans-serif" font-size="13" fill="%232563eb">Ans: Preemptive scheduling allows the CPU to interrupt a running process to allocate</text>' +
      '<text x="75" y="475" font-family="cursive, sans-serif" font-size="13" fill="%232563eb">resources to higher priority tasks (e.g. Round Robin, SRTF). Non-preemptive processes</text>' +
      '<text x="75" y="500" font-family="cursive, sans-serif" font-size="13" fill="%232563eb">run until completion or until they voluntarily yield control (e.g. FCFS).</text>' +
      '</svg>',
    result: {
      id: 'sample-res-1',
      overallScore: 8.8,
      maxOverallScore: 10,
      percentage: 88,
      grade: 'A',
      subject: 'Computer Science & Engineering',
      studentName: 'Dhanush S.',
      studentRoll: 'CS2026-8841',
      evaluationDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      evaluationMode: 'balanced',
      documentName: 'CS_MidTerm_Exam_Sheet_01.jpg',
      generalFeedback: 'Exceptional conceptual understanding across all three questions. The student demonstrates clear command of memory virtualization, data structures, and CPU scheduling mechanisms with accurate asymptotic notations.',
      strengths: [
        'Clear articulation of virtual-to-physical address translation and paging trap mechanics.',
        'Accurate distinction between average O(log n) and worst-case skewed O(n) complexity in BST.',
        'Proper concrete examples provided for both preemptive (Round Robin) and non-preemptive (FCFS) paradigms.'
      ],
      areasForImprovement: [
        'Could elaborate on the Translation Lookaside Buffer (TLB) role during page translation.',
        'Mention self-balancing BST variants (e.g., AVL, Red-Black trees) as solutions to skewed tree degradation.'
      ],
      criteriaBreakdown: {
        factualAccuracy: 9.2,
        conceptualDepth: 8.8,
        keywordCoverage: 8.5,
        clarityAndStructure: 9.0,
        languageAndGrammar: 8.5
      },
      evaluations: [
        {
          questionNumber: 1,
          question: 'Explain Virtual Memory and the concept of Page Fault.',
          answer: 'Virtual memory is a memory management capability of an OS that uses hardware and software to allow a computer to address more memory than is physically present. It maps virtual addresses into physical addresses in RAM or swap space. A page fault happens when a program accesses a memory page not currently mapped in RAM.',
          score: 8.5,
          maxMarks: 10,
          feedback: 'Solid foundational definition. Accurately explains address mapping and defines page fault as a trap to the OS kernel. To score full marks, mention how the OS brings the page from secondary storage to physical RAM using page replacement algorithms (e.g., LRU).',
          strengths: ['Clear definition of address translation', 'Correct identification of page fault trigger condition'],
          improvements: ['Detail the role of Page Tables and valid/invalid bit validation', 'Mention swap space and page replacement policies'],
          keyConceptsCovered: ['Virtual Address', 'Physical RAM', 'Swap Space', 'Page Fault Trap', 'Address Mapping'],
          missingKeyConcepts: ['Translation Lookaside Buffer (TLB)', 'Page Replacement Algorithms (LRU/FIFO)', 'MMU hardware'],
          idealModelAnswer: 'Virtual memory is an OS memory management technique creating an illusion of large contiguous memory by abstracting physical RAM through secondary storage (swap/paging file). The MMU uses Page Tables to translate virtual addresses into physical addresses. When an instruction references a virtual page with its valid bit set to 0 (page not in RAM), the MMU triggers a Page Fault trap. The OS kernel intercepts the trap, locates the requested page on backing store, selects a victim frame using replacement policies (e.g., LRU), fetches the page into RAM, updates the page table entry, and restarts the faulted instruction.',
          criteriaBreakdown: {
            factualAccuracy: 9.0,
            conceptualDepth: 8.0,
            keywordCoverage: 8.0,
            clarityAndStructure: 9.0,
            languageAndGrammar: 9.0
          }
        },
        {
          questionNumber: 2,
          question: 'What is a Binary Search Tree (BST) and explain its worst-case search complexity.',
          answer: 'A BST is a rooted binary tree where the left subtree contains keys smaller than the node key, and the right subtree contains keys greater. In a balanced BST, search takes O(log n). But in the worst case (skewed tree), search degrades to O(n).',
          score: 9.0,
          maxMarks: 10,
          feedback: 'Excellent answer. Explicitly defines the BST ordering invariant and accurately identifies why worst-case search is O(n) (when elements are inserted in ascending or descending sorted order).',
          strengths: ['Accurate BST property definition', 'Explicit contrast between balanced O(log n) and unbalanced O(n)'],
          improvements: ['Mention height of tree h directly determining time complexity O(h)'],
          keyConceptsCovered: ['Left Subtree < Root < Right Subtree', 'Search Complexity O(log n)', 'Skewed Tree Degeneration O(n)'],
          missingKeyConcepts: ['Tree height h relation', 'Self-balancing trees (AVL / Red-Black)'],
          idealModelAnswer: 'A Binary Search Tree (BST) is a hierarchical node-based binary tree data structure where for every node X, all keys in X\'s left subtree are strictly less than X.key, and all keys in X\'s right subtree are strictly greater. The search time complexity is directly proportional to tree height O(h). In a balanced tree (height = log2(n)), search is O(log n). However, if elements are inserted in sorted order, the tree degenerates into a linear linked list (skewed tree) of height n, resulting in worst-case search complexity of O(n). Self-balancing structures like AVL or Red-Black trees prevent this.',
          criteriaBreakdown: {
            factualAccuracy: 9.5,
            conceptualDepth: 9.0,
            keywordCoverage: 8.5,
            clarityAndStructure: 9.0,
            languageAndGrammar: 9.0
          }
        },
        {
          questionNumber: 3,
          question: 'Differentiate between Preemptive and Non-Preemptive Scheduling.',
          answer: 'Preemptive scheduling allows the CPU to interrupt a running process to allocate resources to higher priority tasks (e.g. Round Robin, SRTF). Non-preemptive processes run until completion or until they voluntarily yield control (e.g. FCFS).',
          score: 9.0,
          maxMarks: 10,
          feedback: 'Concise, direct, and factually accurate. Good choice of real scheduling algorithm examples for both categories.',
          strengths: ['Identifies preemption mechanism (CPU context switch)', 'Gives accurate examples for each paradigm'],
          improvements: ['Discuss overhead of context switching and race condition concerns in preemptive systems'],
          keyConceptsCovered: ['Context interruption', 'Voluntary yield', 'Round Robin & SRTF', 'FCFS'],
          missingKeyConcepts: ['Context switch overhead', 'Shared memory synchronization / Race conditions'],
          idealModelAnswer: 'Preemptive scheduling enables the OS scheduler to forcefully interrupt a running process in the CPU to switch context to another ready process based on priority or time quantum expiration (e.g., Round Robin, Shortest Remaining Time First). This improves responsiveness but incurs context-switching overhead and concurrency hazards. Non-preemptive scheduling (cooperative) allows a process to retain the CPU until it terminates or enters waiting state for I/O (e.g., First-Come-First-Served, Shortest Job First), minimizing overhead but causing convoy effect and poor responsiveness.',
          criteriaBreakdown: {
            factualAccuracy: 9.0,
            conceptualDepth: 9.0,
            keywordCoverage: 9.0,
            clarityAndStructure: 9.0,
            languageAndGrammar: 9.0
          }
        }
      ]
    }
  },
  {
    id: 'physics-thermo',
    title: 'Physics: Thermodynamics & Laws of Motion',
    subject: 'Physics & Applied Sciences',
    studentName: 'Priya Raman',
    studentRoll: 'PHY2026-104',
    filename: 'Physics_Thermodynamics_AnswerSheet.pdf',
    description: 'Answers on Second Law of Thermodynamics, Carnot efficiency, and Entropy.',
    svgPreview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850"><rect width="100%" height="100%" fill="%23faf8f5"/><line x1="50" y1="0" x2="50" y2="850" stroke="%23f87171" stroke-width="1.5"/><g stroke="%23e2e8f0" stroke-width="1">' +
      Array.from({ length: 30 }, (_, i) => `<line x1="0" y1="${80 + i * 25}" x2="600" y2="${80 + i * 25}"/>`).join('') +
      '</g><text x="65" y="65" font-family="serif" font-size="14" fill="%234338ca">Roll: PHY2026-104 | Priya Raman | Thermodynamics Paper</text>' +
      '<text x="65" y="100" font-family="cursive, sans-serif" font-size="15" font-weight="bold" fill="%230f172a">Q1. State the Second Law of Thermodynamics (Kelvin-Planck &amp; Clausius).</text>' +
      '<text x="65" y="125" font-family="cursive, sans-serif" font-size="13" fill="%231e40af">Ans: Kelvin-Planck: It is impossible for a heat engine to produce network</text>' +
      '<text x="65" y="150" font-family="cursive, sans-serif" font-size="13" fill="%231e40af">operating in a cycle that absorbs heat from a single reservoir with 100% efficiency.</text>' +
      '<text x="65" y="175" font-family="cursive, sans-serif" font-size="13" fill="%231e40af">Clausius: Heat cannot spontaneously flow from a colder to a hotter body without work.</text>' +
      '<text x="65" y="275" font-family="cursive, sans-serif" font-size="15" font-weight="bold" fill="%230f172a">Q2. Write the formula for Carnot Engine efficiency and explain its parameters.</text>' +
      '<text x="65" y="300" font-family="cursive, sans-serif" font-size="13" fill="%231e40af">Ans: Efficiency eta = 1 - (Tc / Th) where Tc is sink temp and Th is source temp.</text>' +
      '<text x="65" y="325" font-family="cursive, sans-serif" font-size="13" fill="%231e40af">Both temperatures must be in Kelvin. No engine can be more efficient than Carnot.</text>' +
      '</svg>',
    result: {
      id: 'sample-res-2',
      overallScore: 9.3,
      maxOverallScore: 10,
      percentage: 93,
      grade: 'A+',
      subject: 'Physics & Applied Sciences',
      studentName: 'Priya Raman',
      studentRoll: 'PHY2026-104',
      evaluationDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      evaluationMode: 'strict',
      documentName: 'Physics_Thermodynamics_AnswerSheet.pdf',
      generalFeedback: 'Masterful presentation of thermodynamic laws. Precision in scientific definitions and mathematical relationships is commendable.',
      strengths: [
        'Complete statements of both Kelvin-Planck and Clausius formulations.',
        'Clear emphasis on absolute temperature (Kelvin scale) for Carnot efficiency.',
        'High linguistic precision and structured format.'
      ],
      areasForImprovement: [
        'Mention reversible processes vs irreversible processes in cyclic operations.',
        'State Carnot theorem conditions formally.'
      ],
      criteriaBreakdown: {
        factualAccuracy: 9.6,
        conceptualDepth: 9.2,
        keywordCoverage: 9.4,
        clarityAndStructure: 9.2,
        languageAndGrammar: 9.1
      },
      evaluations: [
        {
          questionNumber: 1,
          question: 'State the Second Law of Thermodynamics (Kelvin-Planck & Clausius statements).',
          answer: 'Kelvin-Planck: It is impossible for a heat engine to produce network operating in a cycle that absorbs heat from a single reservoir with 100% efficiency. Clausius: Heat cannot spontaneously flow from a colder to a hotter body without external work input.',
          score: 9.5,
          maxMarks: 10,
          feedback: 'Excellent dual statement. Both the reservoir restriction and directional heat flow criteria are properly conveyed.',
          strengths: ['Identified both statements accurately', 'Noted cyclical process requirement'],
          improvements: ['Add that violation of one statement leads to violation of the other'],
          keyConceptsCovered: ['Kelvin-Planck', 'Clausius', 'Single Thermal Reservoir', 'Spontaneous heat flow', 'Cycle efficiency'],
          missingKeyConcepts: ['Equivalence of formulations', 'Entropy increase in isolated system'],
          idealModelAnswer: 'The Second Law of Thermodynamics defines the direction of thermodynamic processes: 1) Kelvin-Planck Statement: It is impossible to construct a device operating on a thermodynamic cycle which will produce no effect other than the extraction of heat from a single thermal reservoir and the performance of an equivalent amount of work (i.e., thermal efficiency cannot be 100%). 2) Clausius Statement: It is impossible to construct a device operating in a cycle that produces no effect other than the transfer of heat from a lower-temperature reservoir to a higher-temperature reservoir without external work. Both statements are logically equivalent.',
          criteriaBreakdown: {
            factualAccuracy: 9.8,
            conceptualDepth: 9.3,
            keywordCoverage: 9.5,
            clarityAndStructure: 9.5,
            languageAndGrammar: 9.4
          }
        },
        {
          questionNumber: 2,
          question: 'Write the formula for Carnot Engine efficiency and explain its parameters.',
          answer: 'Efficiency eta = 1 - (Tc / Th) where Tc is sink temp and Th is source temp. Both temperatures must be in Kelvin. No engine can be more efficient than Carnot.',
          score: 9.1,
          maxMarks: 10,
          feedback: 'Accurate equation and critical mention of absolute Kelvin temperatures. High marks awarded.',
          strengths: ['Correct formula eta = 1 - Tc/Th', 'Highlighted Kelvin requirement'],
          improvements: ['State Carnot theorem explicitly', 'Show four steps of Carnot cycle'],
          keyConceptsCovered: ['eta = 1 - Tc/Th', 'Source and Sink Temperatures', 'Kelvin Scale', 'Theoretical maximum'],
          missingKeyConcepts: ['Isothermal and Adiabatic cycle steps', 'Carnot Theorem formal statement'],
          idealModelAnswer: 'The thermal efficiency of an ideal reversible Carnot engine is given by η = 1 - (T_cold / T_hot) = (T_hot - T_cold) / T_hot, where T_hot is the absolute temperature of the heat source (reservoir) and T_cold is the absolute temperature of the heat sink in Kelvin (K). Key principles: 1) Carnot efficiency depends solely on reservoir temperatures, independent of working substance. 2) η = 1 (100%) is achievable only if T_cold = 0 K, impossible by the Third Law. 3) Carnot Theorem proves no real engine operating between two temperatures can exceed Carnot efficiency.',
          criteriaBreakdown: {
            factualAccuracy: 9.4,
            conceptualDepth: 9.1,
            keywordCoverage: 9.3,
            clarityAndStructure: 8.9,
            languageAndGrammar: 8.8
          }
        }
      ]
    }
  }
];
